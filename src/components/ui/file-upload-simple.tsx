'use client';

import { Button } from '@/components/ui/button';
import type { UploadResult } from '@/lib/file-upload';
import {
    FILE_SIZE_LIMITS,
    SUPPORTED_FILE_TYPES,
    validateFile,
} from '@/lib/file-upload';
import { useCallback, useState } from 'react';

interface FileUploadSimpleProps {
    onFilesUploaded: (results: UploadResult[]) => void;
    maxFiles?: number;
    className?: string;
}

export function FileUploadSimple({
    onFilesUploaded,
    maxFiles = 5,
    className = '',
}: FileUploadSimpleProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleFiles = useCallback(
        async (files: FileList | null) => {
            if (!files || files.length === 0) return;

            const fileArray = Array.from(files).slice(0, maxFiles);

            // Validation côté client
            const validationErrors: string[] = [];
            fileArray.forEach((file) => {
                const validation = validateFile(file);
                if (!validation.valid) {
                    validationErrors.push(`${file.name}: ${validation.error}`);
                }
            });

            if (validationErrors.length > 0) {
                alert(`Erreurs de validation:\n${validationErrors.join('\n')}`);
                return;
            }

            setIsUploading(true);
            try {
                // Créer un FormData pour envoyer les fichiers à l'API
                const formData = new FormData();
                fileArray.forEach((file) => {
                    formData.append('files', file);
                });

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error("Erreur lors de l'upload");
                }

                const data = await response.json();
                onFilesUploaded(data.results);
            } catch (error) {
                console.error('Erreur upload:', error);
                alert("Erreur lors de l'upload des fichiers");
            } finally {
                setIsUploading(false);
            }
        },
        [maxFiles, onFilesUploaded]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragActive(false);
            handleFiles(e.dataTransfer.files);
        },
        [handleFiles]
    );

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            handleFiles(e.target.files);
        },
        [handleFiles]
    );

    const formatFileSize = (bytes: number) => {
        const mb = bytes / (1024 * 1024);
        return `${mb.toFixed(0)}MB`;
    };

    return (
        <div className={className}>
            <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                }}
                onDragLeave={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                <div className="space-y-4">
                    <div className="text-4xl">📁</div>
                    <div>
                        <h3 className="text-lg font-medium mb-2">
                            Glissez vos fichiers ici ou cliquez pour
                            sélectionner
                        </h3>
                        <p className="text-sm text-primary">
                            Jusqu&apos;à {maxFiles} fichiers - Formats 3D,
                            images, documents, archives
                        </p>
                    </div>

                    <input
                        type="file"
                        multiple
                        accept={Object.values(SUPPORTED_FILE_TYPES)
                            .flat()
                            .join(',')}
                        onChange={handleFileInput}
                        className="hidden"
                        id="file-upload-input"
                        disabled={isUploading}
                    />

                    <Button
                        type="button"
                        onClick={() =>
                            document
                                .getElementById('file-upload-input')
                                ?.click()
                        }
                        disabled={isUploading}
                        variant="outline"
                    >
                        {isUploading
                            ? 'Upload en cours...'
                            : 'Sélectionner des fichiers'}
                    </Button>
                </div>
            </div>

            {/* Info sur les types supportés */}
            <div className="mt-4 text-xs text-gray-500">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <div>
                        <strong>Fichiers 3D:</strong> STL, OBJ, 3MF, STEP (max{' '}
                        {formatFileSize(FILE_SIZE_LIMITS['3d'])})
                    </div>
                    <div>
                        <strong>Images:</strong> JPG, PNG, WebP, GIF (max{' '}
                        {formatFileSize(FILE_SIZE_LIMITS.image)})
                    </div>
                    <div>
                        <strong>Documents:</strong> PDF, DOC, TXT (max{' '}
                        {formatFileSize(FILE_SIZE_LIMITS.document)})
                    </div>
                    <div>
                        <strong>Archives:</strong> ZIP, RAR, 7Z (max{' '}
                        {formatFileSize(FILE_SIZE_LIMITS.archive)})
                    </div>
                </div>
            </div>
        </div>
    );
}
