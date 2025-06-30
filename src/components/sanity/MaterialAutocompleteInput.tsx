'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { set, StringInputProps, unset, useClient } from 'sanity';

interface MaterialOption {
    value: string;
    count: number;
}

export function MaterialAutocompleteInput(props: StringInputProps) {
    const { onChange, value = '', schemaType } = props;
    const [options, setOptions] = useState<MaterialOption[]>([]);
    const [filteredOptions, setFilteredOptions] = useState<MaterialOption[]>(
        []
    );
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const client = useClient();

    // Fonction pour récupérer les matériaux existants
    const fetchExistingMaterials = useCallback(async () => {
        setLoading(true);
        try {
            // Requête GROQ pour récupérer TOUS les matériaux de TOUTES les réalisations
            const query = `*[_type == "gallery" && defined(material) && material != null && material != ""] {
                material
            }`;

            const results = await client.fetch(query);
            console.log('Matériaux récupérés depuis Sanity:', results);

            // Compter les occurrences
            const materialCounts: Record<string, number> = {};

            results.forEach((item: { material: string }) => {
                if (item.material && typeof item.material === 'string') {
                    const cleanMaterial = item.material.trim();
                    if (cleanMaterial) {
                        materialCounts[cleanMaterial] =
                            (materialCounts[cleanMaterial] || 0) + 1;
                    }
                }
            });

            console.log('Comptage des matériaux:', materialCounts);

            // Convertir en tableau d'options triées par fréquence
            const materialOptions: MaterialOption[] = Object.entries(
                materialCounts
            )
                .map(([material, count]) => ({ value: material, count }))
                .sort((a, b) => b.count - a.count);

            console.log('Options finales:', materialOptions);
            setOptions(materialOptions);
        } catch (error) {
            console.error(
                'Erreur lors de la récupération des matériaux:',
                error
            );
            // Fallback avec quelques matériaux de base pour tester
            setOptions([
                { value: 'PLA', count: 1 },
                { value: 'ABS', count: 1 },
                { value: 'PETG', count: 1 },
                { value: 'Résine', count: 1 },
            ]);
        } finally {
            setLoading(false);
        }
    }, [client]);

    useEffect(() => {
        fetchExistingMaterials();
    }, [fetchExistingMaterials]);

    // Filtrer les options lors de la saisie
    useEffect(() => {
        if (!value) {
            setFilteredOptions(options.slice(0, 10)); // Afficher les 10 premiers par défaut
        } else {
            const filtered = options
                .filter((option) =>
                    option.value.toLowerCase().includes(value.toLowerCase())
                )
                .slice(0, 10);
            setFilteredOptions(filtered);
        }
    }, [value, options]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        onChange(newValue ? set(newValue) : unset());
    };

    const handleOptionSelect = (material: string) => {
        onChange(set(material));
        setShowDropdown(false);
    };

    const handleFocus = () => {
        setShowDropdown(true);
    };

    const handleBlur = () => {
        // Délai pour permettre les clics sur les options
        setTimeout(() => {
            setShowDropdown(false);
        }, 150);
    };

    return (
        <div style={{ position: 'relative' }}>
            {/* Input avec styles par défaut Sanity */}
            <input
                type="text"
                value={value || ''}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={
                    schemaType?.placeholder ||
                    'Tapez pour rechercher un matériau...'
                }
            />

            {/* Dropdown avec suggestions - styles fixes pour la lisibilité */}
            {showDropdown && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        zIndex: 9999,
                        backgroundColor: '#ffffff',
                        border: '1px solid #d1d5db',
                        borderTop: 'none',
                        borderRadius: '0 0 3px 3px',
                        boxShadow:
                            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        marginTop: '0',
                        color: '#000000',
                    }}
                >
                    {loading ? (
                        <div
                            style={{
                                padding: '12px 16px',
                                textAlign: 'center',
                                color: '#6b7280',
                                fontSize: '13px',
                            }}
                        >
                            <div
                                style={{
                                    display: 'inline-block',
                                    width: '12px',
                                    height: '12px',
                                    border: '2px solid #e5e7eb',
                                    borderTop: '2px solid #0070f3',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite',
                                    marginRight: '8px',
                                }}
                            ></div>
                            Chargement...
                        </div>
                    ) : filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <div
                                key={option.value}
                                style={{
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    borderBottom: '1px solid #f3f4f6',
                                    fontSize: '13px',
                                    lineHeight: '1.4',
                                    color: '#000000', // NOIR au lieu de gris
                                    backgroundColor: 'transparent',
                                    transition: 'background-color 0.15s ease',
                                }}
                                onMouseDown={() =>
                                    handleOptionSelect(option.value)
                                }
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        '#f9fafb';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        'transparent';
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <span
                                        style={{
                                            fontWeight: '500',
                                            color: '#000000', // NOIR pour le nom du matériau
                                        }}
                                    >
                                        {option.value}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: '11px',
                                            color: '#6b7280', // Gris pour le compteur
                                            fontWeight: '400',
                                        }}
                                    >
                                        {option.count} fois
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : value && value.length > 0 ? (
                        <div
                            style={{
                                padding: '12px 16px',
                                color: '#6b7280',
                                fontSize: '13px',
                                textAlign: 'center',
                            }}
                        >
                            Aucune suggestion trouvée
                        </div>
                    ) : (
                        <div
                            style={{
                                padding: '12px 16px',
                                color: '#6b7280',
                                fontSize: '13px',
                                textAlign: 'center',
                            }}
                        >
                            Commencez à taper pour voir les suggestions
                        </div>
                    )}
                </div>
            )}

            {/* Animation CSS pour le spinner */}
            <style jsx>{`
                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
}

export default MaterialAutocompleteInput;
