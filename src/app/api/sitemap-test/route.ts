import sitemap from '@/app/sitemap';
import { generateSitemapReport } from '@/lib/sitemap-utils';
import { NextResponse } from 'next/server';

/**
 * Route de test pour valider le sitemap en développement
 * Accessible uniquement en mode développement
 */
export async function GET() {
    // Sécurité : uniquement en développement
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
            { error: "Cette route n'est disponible qu'en développement" },
            { status: 403 }
        );
    }

    try {
        // Générer le sitemap
        const sitemapData = await sitemap();

        // Générer le rapport de validation
        const report = generateSitemapReport(sitemapData);

        return NextResponse.json({
            success: true,
            sitemap: sitemapData,
            report,
            count: sitemapData.length,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error(
            'Erreur lors de la génération du sitemap de test:',
            error
        );

        return NextResponse.json(
            {
                error: 'Erreur lors de la génération du sitemap',
                details:
                    error instanceof Error ? error.message : 'Erreur inconnue',
            },
            { status: 500 }
        );
    }
}
