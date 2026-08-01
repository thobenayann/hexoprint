#!/usr/bin/env node

/**
 * Script de validation SEO pour Hexoprint
 * Vérifie automatiquement les optimisations SEO du site
 */

// This CLI is intentionally CommonJS because it is executed directly by Node.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

// Configuration des chemins
// Couleurs pour les logs
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m',
};

const log = {
    success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
    warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
    info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
};

// Vérifications SEO
const checks = {
    // Vérifie si les fichiers essentiels SEO existent
    checkEssentialFiles() {
        log.info('Vérification des fichiers SEO essentiels...');

        const essentialFiles = [
            'src/app/layout.tsx',
            'src/app/robots.ts',
            'src/app/sitemap.ts',
            'src/app/manifest.json',
            'src/lib/company-info.ts',
            'src/lib/seo-utils.ts',
        ];

        let allExists = true;

        essentialFiles.forEach((file) => {
            const filePath = path.join(__dirname, '..', file);
            if (fs.existsSync(filePath)) {
                log.success(`${file} existe`);
            } else {
                log.error(`${file} manquant`);
                allExists = false;
            }
        });

        return allExists;
    },

    // Vérifie les métadonnées dans les pages
    checkPageMetadata() {
        log.info('Vérification des métadonnées des pages...');

        const pageFiles = [
            'src/app/(client)/page.tsx',
            'src/app/(client)/prestations/page.tsx',
            'src/app/(client)/a-propos/page.tsx',
            'src/app/(client)/contact/page.tsx',
            'src/app/(client)/blog/page.tsx',
            'src/app/(client)/galerie/page.tsx',
        ];

        let allHaveMetadata = true;

        pageFiles.forEach((file) => {
            const filePath = path.join(__dirname, '..', file);
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');

                if (
                    content.includes('export const metadata') ||
                    content.includes('export async function generateMetadata')
                ) {
                    log.success(`${file} a des métadonnées`);
                } else {
                    log.error(`${file} manque de métadonnées`);
                    allHaveMetadata = false;
                }
            } else {
                log.warning(`${file} n'existe pas`);
            }
        });

        return allHaveMetadata;
    },

    // Vérifie la configuration du manifest
    checkManifest() {
        log.info('Vérification du manifest.json...');

        const manifestPath = path.join(
            __dirname,
            '..',
            'src/app/manifest.json'
        );

        if (!fs.existsSync(manifestPath)) {
            log.error('manifest.json manquant');
            return false;
        }

        try {
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

            const requiredFields = [
                'name',
                'short_name',
                'description',
                'icons',
                'theme_color',
            ];
            let isValid = true;

            requiredFields.forEach((field) => {
                if (manifest[field]) {
                    log.success(`Manifest: ${field} présent`);
                } else {
                    log.error(`Manifest: ${field} manquant`);
                    isValid = false;
                }
            });

            // Vérifications spécifiques
            if (manifest.name && manifest.name.includes('Hexo')) {
                log.success('Manifest: nom spécifique à Hexoprint');
            } else {
                log.error('Manifest: nom générique détecté');
                isValid = false;
            }

            return isValid;
        } catch (error) {
            log.error(`Erreur de parsing du manifest: ${error.message}`);
            return false;
        }
    },

    // Vérifie la configuration du next.config.ts
    checkNextConfig() {
        log.info('Vérification du next.config.ts...');

        const configPath = path.join(__dirname, '..', 'next.config.ts');

        if (!fs.existsSync(configPath)) {
            log.error('next.config.ts manquant');
            return false;
        }

        const content = fs.readFileSync(configPath, 'utf8');

        const optimizations = [
            { name: 'Images remotePatterns', check: 'remotePatterns' },
            { name: 'Headers de sécurité', check: 'async headers()' },
            { name: 'Compression', check: 'compress: true' },
            {
                name: 'Format images WebP/AVIF',
                check: "formats: ['image/webp', 'image/avif']",
            },
        ];

        let allOptimized = true;

        optimizations.forEach((opt) => {
            if (content.includes(opt.check)) {
                log.success(`Next.js: ${opt.name} configuré`);
            } else {
                log.warning(`Next.js: ${opt.name} non configuré`);
                allOptimized = false;
            }
        });

        return allOptimized;
    },

    // Vérifie l'utilisation de COMPANY_INFO
    checkCompanyInfoUsage() {
        log.info("Vérification de l'utilisation de COMPANY_INFO...");

        const filesToCheck = [
            'src/app/layout.tsx',
            'src/app/robots.ts',
            'src/app/sitemap.ts',
            'src/app/(client)/contact/page.tsx',
            'src/app/(client)/a-propos/page.tsx',
        ];

        let allUseCompanyInfo = true;

        filesToCheck.forEach((file) => {
            const filePath = path.join(__dirname, '..', file);
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');

                if (content.includes('COMPANY_INFO')) {
                    log.success(`${file} utilise COMPANY_INFO`);
                } else {
                    log.warning(`${file} n'utilise pas COMPANY_INFO`);
                    allUseCompanyInfo = false;
                }

                // Vérifier les URLs hardcodées
                if (
                    content.includes('https://hexoprint.fr') &&
                    !content.includes('COMPANY_INFO.siteUrl')
                ) {
                    log.error(`${file} contient des URLs hardcodées`);
                    allUseCompanyInfo = false;
                }
            }
        });

        return allUseCompanyInfo;
    },

    // Vérifie les structured data JSON-LD
    checkStructuredData() {
        log.info('Vérification des données structurées JSON-LD...');

        const filesToCheck = [
            'src/app/layout.tsx',
            'src/app/(client)/a-propos/page.tsx',
            'src/app/(client)/prestations/page.tsx',
            'src/app/(client)/blog/page.tsx',
            'src/app/(client)/galerie/page.tsx',
        ];

        let hasStructuredData = false;

        filesToCheck.forEach((file) => {
            const filePath = path.join(__dirname, '..', file);
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');

                if (
                    content.includes('application/ld+json') ||
                    content.includes('@context')
                ) {
                    log.success(`${file} contient des données structurées`);
                    hasStructuredData = true;
                } else {
                    log.warning(`${file} sans données structurées`);
                }
            }
        });

        return hasStructuredData;
    },
};

// Exécution des vérifications
async function runSEOValidation() {
    console.log(`${colors.blue}🔍 Validation SEO Hexoprint${colors.reset}\n`);

    const results = {
        essentialFiles: checks.checkEssentialFiles(),
        pageMetadata: checks.checkPageMetadata(),
        manifest: checks.checkManifest(),
        nextConfig: checks.checkNextConfig(),
        companyInfo: checks.checkCompanyInfoUsage(),
        structuredData: checks.checkStructuredData(),
    };

    console.log('\n' + '='.repeat(50));
    console.log(`${colors.blue}📊 RÉSUMÉ DE LA VALIDATION SEO${colors.reset}`);
    console.log('='.repeat(50));

    const passed = Object.values(results).filter(Boolean).length;
    const total = Object.keys(results).length;

    Object.entries(results).forEach(([check, passed]) => {
        const status = passed
            ? `${colors.green}✓ PASSÉ${colors.reset}`
            : `${colors.red}✗ ÉCHEC${colors.reset}`;
        console.log(`${check.padEnd(20)} : ${status}`);
    });

    console.log('='.repeat(50));

    if (passed === total) {
        log.success(
            `🎉 Toutes les vérifications SEO sont passées ! (${passed}/${total})`
        );
        console.log(
            `${colors.green}✨ Votre site Hexoprint est optimisé pour le SEO !${colors.reset}`
        );
    } else {
        log.warning(`⚠️  ${passed}/${total} vérifications passées`);
        console.log(
            `${colors.yellow}🔧 Veuillez corriger les points mentionnés ci-dessus.${colors.reset}`
        );
    }

    console.log(
        "\n💡 Pour plus d'informations sur les optimisations SEO, consultez :"
    );
    console.log('   - Google Search Console');
    console.log('   - PageSpeed Insights');
    console.log('   - GTmetrix');

    process.exit(passed === total ? 0 : 1);
}

// Lancement du script
if (require.main === module) {
    runSEOValidation().catch(console.error);
}

module.exports = { checks, runSEOValidation };
