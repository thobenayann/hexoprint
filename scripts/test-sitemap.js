#!/usr/bin/env node

/**
 * Script pour tester le sitemap localement
 * Usage: node scripts/test-sitemap.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Test du sitemap Hexoprint.fr\n');

async function testSitemap() {
    try {
        // Vérifier que le serveur de développement est lancé
        console.log('📡 Test de connexion au serveur local...');

        const response = await fetch('http://localhost:3000/api/sitemap-test');

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            console.log('✅ Sitemap généré avec succès!');
            console.log(`📊 Nombre d'entrées: ${data.count}`);
            console.log(
                `⏰ Généré le: ${new Date(data.timestamp).toLocaleString('fr-FR')}\n`
            );

            // Afficher le rapport
            console.log('📋 Rapport de validation:');
            console.log('='.repeat(50));
            console.log(data.report);

            // Sauvegarder le sitemap pour inspection
            const sitemapPath = path.join(__dirname, '../sitemap-test.json');
            fs.writeFileSync(
                sitemapPath,
                JSON.stringify(data.sitemap, null, 2)
            );
            console.log(`💾 Sitemap sauvegardé dans: ${sitemapPath}`);

            // Tester l'accès direct au sitemap XML
            console.log("\n🔍 Test d'accès au sitemap XML...");
            const xmlResponse = await fetch(
                'http://localhost:3000/sitemap.xml'
            );

            if (xmlResponse.ok) {
                console.log('✅ Sitemap XML accessible');
                const xmlContent = await xmlResponse.text();
                console.log(
                    `📏 Taille du XML: ${xmlContent.length} caractères`
                );
            } else {
                console.log("❌ Erreur d'accès au sitemap XML");
            }
        } else {
            console.log('❌ Erreur lors de la génération du sitemap');
            console.log(data.error);
        }
    } catch (error) {
        console.error('❌ Erreur de connexion:');
        console.error(error.message);
        console.log(
            '\n💡 Assurez-vous que le serveur de développement est lancé:'
        );
        console.log('   npm run dev');
        console.log('   ou');
        console.log('   pnpm dev');
    }
}

// Exécuter le test
testSitemap();
