/**
 * Utilitaires pour la validation et le testing du sitemap
 */

import type { MetadataRoute } from 'next';

/**
 * Valide une entrée de sitemap
 */
export function validateSitemapEntry(entry: MetadataRoute.Sitemap[0]): boolean {
    // Vérifications de base
    if (!entry.url) return false;
    if (!entry.url.startsWith('http')) return false;

    // Vérification de la priorité
    if (entry.priority !== undefined) {
        if (entry.priority < 0 || entry.priority > 1) return false;
    }

    // Vérification de la fréquence de changement
    const validFrequencies = [
        'always',
        'hourly',
        'daily',
        'weekly',
        'monthly',
        'yearly',
        'never',
    ];
    if (
        entry.changeFrequency &&
        !validFrequencies.includes(entry.changeFrequency)
    ) {
        return false;
    }

    return true;
}

/**
 * Valide un sitemap complet
 */
export function validateSitemap(sitemap: MetadataRoute.Sitemap): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
} {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Vérification du nombre d'entrées (limite Google: 50,000)
    if (sitemap.length > 50000) {
        errors.push(
            `Trop d'entrées dans le sitemap: ${sitemap.length}. Limite: 50,000`
        );
    }

    // Vérification de chaque entrée
    sitemap.forEach((entry, index) => {
        if (!validateSitemapEntry(entry)) {
            errors.push(`Entrée invalide à l'index ${index}: ${entry.url}`);
        }
    });

    // Vérification des doublons
    const urls = sitemap.map((entry) => entry.url);
    const uniqueUrls = new Set(urls);
    if (urls.length !== uniqueUrls.size) {
        warnings.push('Des URLs en doublon ont été détectées');
    }

    // Vérification de la page d'accueil
    const hasHomepage = sitemap.some(
        (entry) => entry.url.endsWith('/') && entry.priority === 1
    );
    if (!hasHomepage) {
        warnings.push("Aucune page d'accueil avec priorité 1 détectée");
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}

/**
 * Statistiques du sitemap
 */
export function getSitemapStats(sitemap: MetadataRoute.Sitemap) {
    const stats = {
        totalEntries: sitemap.length,
        byPriority: {} as Record<string, number>,
        byChangeFrequency: {} as Record<string, number>,
        withImages: 0,
        withVideos: 0,
        mostRecentUpdate: null as Date | null,
        oldestUpdate: null as Date | null,
    };

    sitemap.forEach((entry) => {
        // Statistiques par priorité
        const priority = entry.priority?.toString() || 'undefined';
        stats.byPriority[priority] = (stats.byPriority[priority] || 0) + 1;

        // Statistiques par fréquence
        const freq = entry.changeFrequency || 'undefined';
        stats.byChangeFrequency[freq] =
            (stats.byChangeFrequency[freq] || 0) + 1;

        // Images et vidéos
        if (entry.images && entry.images.length > 0) {
            stats.withImages++;
        }
        if (entry.videos && entry.videos.length > 0) {
            stats.withVideos++;
        }

        // Dates
        if (entry.lastModified) {
            const date = new Date(entry.lastModified);
            if (!stats.mostRecentUpdate || date > stats.mostRecentUpdate) {
                stats.mostRecentUpdate = date;
            }
            if (!stats.oldestUpdate || date < stats.oldestUpdate) {
                stats.oldestUpdate = date;
            }
        }
    });

    return stats;
}

/**
 * Génère un rapport de validation du sitemap
 */
export function generateSitemapReport(sitemap: MetadataRoute.Sitemap): string {
    const validation = validateSitemap(sitemap);
    const stats = getSitemapStats(sitemap);

    let report = '# Rapport de validation du sitemap\n\n';

    // Status général
    report += `## ✅ Status: ${validation.isValid ? 'VALIDE' : 'INVALIDE'}\n\n`;

    // Statistiques
    report += `## 📊 Statistiques\n`;
    report += `- **Nombre total d'entrées**: ${stats.totalEntries}\n`;
    report += `- **Entrées avec images**: ${stats.withImages}\n`;
    report += `- **Entrées avec vidéos**: ${stats.withVideos}\n`;

    if (stats.mostRecentUpdate) {
        report += `- **Dernière modification**: ${stats.mostRecentUpdate.toLocaleString('fr-FR')}\n`;
    }

    report += '\n';

    // Répartition par priorité
    report += `### Répartition par priorité\n`;
    Object.entries(stats.byPriority).forEach(([priority, count]) => {
        report += `- **${priority}**: ${count} entrées\n`;
    });
    report += '\n';

    // Répartition par fréquence
    report += `### Répartition par fréquence de changement\n`;
    Object.entries(stats.byChangeFrequency).forEach(([freq, count]) => {
        report += `- **${freq}**: ${count} entrées\n`;
    });
    report += '\n';

    // Erreurs
    if (validation.errors.length > 0) {
        report += `## ❌ Erreurs (${validation.errors.length})\n`;
        validation.errors.forEach((error) => {
            report += `- ${error}\n`;
        });
        report += '\n';
    }

    // Avertissements
    if (validation.warnings.length > 0) {
        report += `## ⚠️ Avertissements (${validation.warnings.length})\n`;
        validation.warnings.forEach((warning) => {
            report += `- ${warning}\n`;
        });
        report += '\n';
    }

    return report;
}
