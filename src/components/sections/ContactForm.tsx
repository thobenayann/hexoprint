'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    AlertCircleIcon,
    BuildingIcon,
    CheckCircleIcon,
    FileTextIcon,
    SendIcon,
    UploadIcon,
    UsersIcon,
} from 'lucide-react';
import { useState } from 'react';

type ContactFormData = {
    type: 'particulier' | 'professionnel';
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    projectType: string;
    description: string;
    files: File[];
    budget?: string;
    deadline?: string;
};

export function ContactForm() {
    const [formData, setFormData] = useState<ContactFormData>({
        type: 'particulier',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        projectType: '',
        description: '',
        files: [],
        budget: '',
        deadline: '',
    });

    const [isDragOver, setIsDragOver] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simuler l'envoi du formulaire
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setIsSubmitting(false);
        // TODO: Implémenter la logique d'envoi réelle
        console.log('Form submitted:', formData);
    };

    const handleFileUpload = (files: FileList | null) => {
        if (!files) return;

        const newFiles = Array.from(files).filter((file) => {
            const validTypes = [
                '.stl',
                '.obj',
                '.3mf',
                '.step',
                '.stp',
                '.pdf',
                '.jpg',
                '.jpeg',
                '.png',
            ];
            const fileExt = file.name
                .toLowerCase()
                .substring(file.name.lastIndexOf('.'));
            return (
                validTypes.includes(fileExt) && file.size <= 50 * 1024 * 1024
            ); // 50MB max
        });

        setFormData((prev) => ({
            ...prev,
            files: [...prev.files, ...newFiles].slice(0, 5), // Max 5 files
        }));
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        handleFileUpload(e.dataTransfer.files);
    };

    const removeFile = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            files: prev.files.filter((_, i) => i !== index),
        }));
    };

    return (
        <section className='py-20 md:py-32 bg-gradient-to-b from-background to-muted/20'>
            <div className='container mx-auto px-4 max-w-4xl'>
                <div className='text-center mb-12'>
                    <Badge
                        variant='outline'
                        className='px-4 py-2 text-sm font-medium border-primary/20 bg-primary/5 mb-4'
                    >
                        <FileTextIcon className='w-4 h-4 mr-2 text-primary' />
                        Demande de Devis
                    </Badge>
                    <h2 className='text-3xl md:text-4xl font-bold mb-4'>
                        Partagez-nous votre projet d&apos;impression 3D
                    </h2>
                    <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
                        Remplissez ce formulaire pour obtenir un devis
                        personnalisé. Nous accompagnons vos idées, des plus
                        simples aux plus audacieuses.
                    </p>
                </div>

                <Card className='border-border/50 shadow-lg'>
                    <CardHeader className='pb-6'>
                        <CardTitle className='text-xl font-semibold'>
                            Informations sur votre projet
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className='space-y-8'>
                            {/* Type de client */}
                            <Tabs
                                value={formData.type}
                                onValueChange={(value) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        type: value as
                                            | 'particulier'
                                            | 'professionnel',
                                    }))
                                }
                            >
                                <TabsList className='grid w-full grid-cols-2'>
                                    <TabsTrigger
                                        value='particulier'
                                        className='flex items-center gap-2'
                                    >
                                        <UsersIcon className='w-4 h-4' />
                                        Particulier
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value='professionnel'
                                        className='flex items-center gap-2'
                                    >
                                        <BuildingIcon className='w-4 h-4' />
                                        Professionnel
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent
                                    value='particulier'
                                    className='space-y-6 mt-6'
                                >
                                    <div className='grid md:grid-cols-2 gap-4'>
                                        <div>
                                            <label
                                                htmlFor='firstName'
                                                className='block text-sm font-medium mb-2'
                                            >
                                                Prénom{' '}
                                                <span className='text-destructive'>
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type='text'
                                                id='firstName'
                                                required
                                                value={formData.firstName}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        firstName:
                                                            e.target.value,
                                                    }))
                                                }
                                                className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
                                                placeholder='Votre prénom'
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor='lastName'
                                                className='block text-sm font-medium mb-2'
                                            >
                                                Nom{' '}
                                                <span className='text-destructive'>
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type='text'
                                                id='lastName'
                                                required
                                                value={formData.lastName}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        lastName:
                                                            e.target.value,
                                                    }))
                                                }
                                                className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
                                                placeholder='Votre nom'
                                            />
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent
                                    value='professionnel'
                                    className='space-y-6 mt-6'
                                >
                                    <div className='grid md:grid-cols-2 gap-4'>
                                        <div>
                                            <label
                                                htmlFor='firstName-pro'
                                                className='block text-sm font-medium mb-2'
                                            >
                                                Prénom{' '}
                                                <span className='text-destructive'>
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type='text'
                                                id='firstName-pro'
                                                required
                                                value={formData.firstName}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        firstName:
                                                            e.target.value,
                                                    }))
                                                }
                                                className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
                                                placeholder='Votre prénom'
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor='lastName-pro'
                                                className='block text-sm font-medium mb-2'
                                            >
                                                Nom{' '}
                                                <span className='text-destructive'>
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type='text'
                                                id='lastName-pro'
                                                required
                                                value={formData.lastName}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        lastName:
                                                            e.target.value,
                                                    }))
                                                }
                                                className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
                                                placeholder='Votre nom'
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor='company'
                                            className='block text-sm font-medium mb-2'
                                        >
                                            Entreprise{' '}
                                            <span className='text-destructive'>
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type='text'
                                            id='company'
                                            required={
                                                formData.type ===
                                                'professionnel'
                                            }
                                            value={formData.company || ''}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    company: e.target.value,
                                                }))
                                            }
                                            className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
                                            placeholder='Nom de votre entreprise'
                                        />
                                    </div>
                                </TabsContent>
                            </Tabs>

                            {/* Contact */}
                            <div className='grid md:grid-cols-2 gap-4'>
                                <div>
                                    <label
                                        htmlFor='email'
                                        className='block text-sm font-medium mb-2'
                                    >
                                        Email{' '}
                                        <span className='text-destructive'>
                                            *
                                        </span>
                                    </label>
                                    <input
                                        type='email'
                                        id='email'
                                        required
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                email: e.target.value,
                                            }))
                                        }
                                        className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
                                        placeholder='votre.email@exemple.com'
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor='phone'
                                        className='block text-sm font-medium mb-2'
                                    >
                                        Téléphone
                                    </label>
                                    <input
                                        type='tel'
                                        id='phone'
                                        value={formData.phone || ''}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                phone: e.target.value,
                                            }))
                                        }
                                        className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
                                        placeholder='06 12 34 56 78'
                                    />
                                </div>
                            </div>

                            {/* Type de projet */}
                            <div>
                                <label
                                    htmlFor='projectType'
                                    className='block text-sm font-medium mb-2'
                                >
                                    Type de projet{' '}
                                    <span className='text-destructive'>*</span>
                                </label>
                                <select
                                    id='projectType'
                                    required
                                    value={formData.projectType}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            projectType: e.target.value,
                                        }))
                                    }
                                    className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
                                >
                                    <option value=''>
                                        Sélectionnez le type de projet
                                    </option>
                                    <option value='prototypage'>
                                        Prototypage rapide
                                    </option>
                                    <option value='reparation'>
                                        Réparation de pièce
                                    </option>
                                    <option value='modelisme'>Modélisme</option>
                                    <option value='decoration'>
                                        Objet décoratif
                                    </option>
                                    <option value='piece-technique'>
                                        Pièce technique sur-mesure
                                    </option>
                                    <option value='petite-serie'>
                                        Petite série
                                    </option>
                                    <option value='autre'>Autre projet</option>
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label
                                    htmlFor='description'
                                    className='block text-sm font-medium mb-2'
                                >
                                    Description du projet{' '}
                                    <span className='text-destructive'>*</span>
                                </label>
                                <textarea
                                    id='description'
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                    className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-vertical'
                                    placeholder='Décrivez votre projet : dimensions, matériau souhaité, couleur, utilisation prévue, contraintes techniques...'
                                />
                            </div>

                            {/* Upload de fichiers */}
                            <div>
                                <label className='block text-sm font-medium mb-2'>
                                    Fichiers (STL, OBJ, images, plans...)
                                </label>
                                <div
                                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                        isDragOver
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/50'
                                    }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <UploadIcon className='w-8 h-8 mx-auto mb-2 text-muted-foreground' />
                                    <p className='text-sm text-muted-foreground mb-2'>
                                        Glissez-déposez vos fichiers ici ou{' '}
                                        <button
                                            type='button'
                                            className='text-primary hover:underline'
                                            onClick={() =>
                                                document
                                                    .getElementById(
                                                        'file-input'
                                                    )
                                                    ?.click()
                                            }
                                        >
                                            parcourez
                                        </button>
                                    </p>
                                    <p className='text-xs text-muted-foreground'>
                                        STL, OBJ, 3MF, STEP, PDF, JPG, PNG - Max
                                        50MB par fichier
                                    </p>
                                    <input
                                        id='file-input'
                                        type='file'
                                        multiple
                                        accept='.stl,.obj,.3mf,.step,.stp,.pdf,.jpg,.jpeg,.png'
                                        onChange={(e) =>
                                            handleFileUpload(e.target.files)
                                        }
                                        className='hidden'
                                    />
                                </div>

                                {/* Liste des fichiers uploadés */}
                                {formData.files.length > 0 && (
                                    <div className='mt-4 space-y-2'>
                                        {formData.files.map((file, index) => (
                                            <div
                                                key={index}
                                                className='flex items-center justify-between p-2 bg-muted rounded-md'
                                            >
                                                <div className='flex items-center space-x-2'>
                                                    <CheckCircleIcon className='w-4 h-4 text-green-500' />
                                                    <span className='text-sm font-medium'>
                                                        {file.name}
                                                    </span>
                                                    <span className='text-xs text-muted-foreground'>
                                                        (
                                                        {(
                                                            file.size /
                                                            1024 /
                                                            1024
                                                        ).toFixed(1)}{' '}
                                                        MB)
                                                    </span>
                                                </div>
                                                <button
                                                    type='button'
                                                    onClick={() =>
                                                        removeFile(index)
                                                    }
                                                    className='text-destructive hover:text-destructive/80'
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Budget et délai */}
                            <div className='grid md:grid-cols-2 gap-4'>
                                <div>
                                    <label
                                        htmlFor='budget'
                                        className='block text-sm font-medium mb-2'
                                    >
                                        Budget approximatif
                                    </label>
                                    <select
                                        id='budget'
                                        value={formData.budget || ''}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                budget: e.target.value,
                                            }))
                                        }
                                        className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
                                    >
                                        <option value=''>Non défini</option>
                                        <option value='0-50'>
                                            Moins de 50€
                                        </option>
                                        <option value='50-100'>
                                            50€ - 100€
                                        </option>
                                        <option value='100-200'>
                                            100€ - 200€
                                        </option>
                                        <option value='200-500'>
                                            200€ - 500€
                                        </option>
                                        <option value='500+'>
                                            Plus de 500€
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label
                                        htmlFor='deadline'
                                        className='block text-sm font-medium mb-2'
                                    >
                                        Délai souhaité
                                    </label>
                                    <select
                                        id='deadline'
                                        value={formData.deadline || ''}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                deadline: e.target.value,
                                            }))
                                        }
                                        className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
                                    >
                                        <option value=''>Non défini</option>
                                        <option value='urgent'>
                                            Urgent (48h)
                                        </option>
                                        <option value='1-semaine'>
                                            Sous 1 semaine
                                        </option>
                                        <option value='2-semaines'>
                                            Sous 2 semaines
                                        </option>
                                        <option value='1-mois'>
                                            Sous 1 mois
                                        </option>
                                        <option value='flexible'>
                                            Flexible
                                        </option>
                                    </select>
                                </div>
                            </div>

                            {/* Note informative */}
                            <div className='p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg'>
                                <div className='flex items-start space-x-3'>
                                    <AlertCircleIcon className='w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5' />
                                    <div className='text-sm'>
                                        <p className='font-medium text-blue-900 dark:text-blue-100 mb-1'>
                                            Conseils pour votre demande
                                        </p>
                                        <ul className='text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside'>
                                            <li>
                                                Plus votre description est
                                                détaillée, plus notre devis sera
                                                précis
                                            </li>
                                            <li>
                                                N&apos;hésitez pas à joindre des
                                                photos ou croquis de référence
                                            </li>
                                            <li>
                                                Précisez les contraintes
                                                techniques (résistance,
                                                température, etc.)
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Bouton d'envoi */}
                            <div className='pt-4'>
                                <Button
                                    type='submit'
                                    disabled={isSubmitting}
                                    className='w-full md:w-auto px-8 py-3 text-base font-semibold'
                                    size='lg'
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2' />
                                            Envoi en cours...
                                        </>
                                    ) : (
                                        <>
                                            <SendIcon className='w-4 h-4 mr-2' />
                                            Envoyer ma demande de devis
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
