import { validateFile } from '@/lib/file-upload';
import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Vérifier que le token Vercel Blob est configuré
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
            return NextResponse.json(
                { error: 'Token Vercel Blob non configuré' },
                { status: 500 }
            );
        }

        const formData = await request.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: 'Aucun fichier fourni' },
                { status: 400 }
            );
        }

        const uploadResults = [];

        for (const file of files) {
            try {
                // Validation du fichier
                const validation = validateFile(file);
                if (!validation.valid) {
                    uploadResults.push({
                        success: false,
                        error: validation.error,
                        filename: file.name,
                    });
                    continue;
                }

                // Générer un nom de fichier unique
                const timestamp = Date.now();
                const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                const filename = `${timestamp}_${cleanName}`;

                // Upload vers Vercel Blob
                const blob = await put(filename, file, {
                    access: 'public',
                    addRandomSuffix: true,
                });

                uploadResults.push({
                    success: true,
                    data: {
                        url: blob.url,
                        filename: file.name,
                        size: file.size,
                        type: file.type,
                        category: validation.category,
                    },
                });
            } catch (error) {
                console.error(`Erreur upload ${file.name}:`, error);
                uploadResults.push({
                    success: false,
                    error: `Erreur lors de l'upload de ${file.name}`,
                    filename: file.name,
                });
            }
        }

        return NextResponse.json({ results: uploadResults });
    } catch (error) {
        console.error('Erreur API upload:', error);
        return NextResponse.json(
            { error: "Erreur serveur lors de l'upload" },
            { status: 500 }
        );
    }
}
