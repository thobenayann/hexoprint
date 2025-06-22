import { z } from 'zod';

// Types de fichiers supportés pour impression 3D
export const SUPPORTED_FILE_TYPES = {
    '3d': ['.stl', '.obj', '.3mf', '.step', '.stp'],
    image: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
    document: ['.pdf', '.doc', '.docx', '.txt'],
    archive: ['.zip', '.rar', '.7z'],
} as const;

// Limites de taille (en bytes)
export const FILE_SIZE_LIMITS = {
    '3d': 100 * 1024 * 1024, // 100MB
    image: 10 * 1024 * 1024, // 10MB
    document: 25 * 1024 * 1024, // 25MB
    archive: 50 * 1024 * 1024, // 50MB
} as const;

// Schema pour un fichier uploadé
export const FileUploadSchema = z.object({
    file: z.instanceof(File),
    category: z.enum(['3d', 'image', 'document', 'archive']),
});

export type FileUpload = z.infer<typeof FileUploadSchema>;

// Résultat d'un upload
export type UploadResult =
    | {
          success: true;
          data: {
              url: string;
              filename: string;
              size: number;
              type: string;
              category: string;
          };
      }
    | {
          success: false;
          error: string;
      };

/**
 * Détermine la catégorie d'un fichier basé sur son extension
 */
export function getFileCategory(filename: string): string | null {
    const extension = '.' + filename.split('.').pop()?.toLowerCase();

    for (const [category, extensions] of Object.entries(SUPPORTED_FILE_TYPES)) {
        if ((extensions as readonly string[]).includes(extension)) {
            return category;
        }
    }

    return null;
}

/**
 * Valide un fichier selon les critères supportés
 */
export function validateFile(file: File): {
    valid: boolean;
    error?: string;
    category?: string;
} {
    const category = getFileCategory(file.name);

    if (!category) {
        return {
            valid: false,
            error: `Type de fichier non supporté: ${file.name.split('.').pop()}`,
        };
    }

    const maxSize = FILE_SIZE_LIMITS[category as keyof typeof FILE_SIZE_LIMITS];
    if (file.size > maxSize) {
        return {
            valid: false,
            error: `Fichier trop volumineux: ${(file.size / 1024 / 1024).toFixed(1)}MB (max: ${maxSize / 1024 / 1024}MB)`,
        };
    }

    return { valid: true, category };
}

// Les fonctions d'upload sont maintenant gérées par l'API route /api/upload
