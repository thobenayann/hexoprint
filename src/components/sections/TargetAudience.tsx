'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Building2, Cpu, Heart, Home, Palette, Wrench } from 'lucide-react';

const professionalServices = [
    {
        icon: Cpu,
        title: 'Prototypage fonctionnel',
        description:
            'Validez vos concepts avec des prototypes précis et fonctionnels pour accélérer votre développement produit.',
    },
    {
        icon: Wrench,
        title: 'Réparation & dépannage',
        description:
            'Remplacez rapidement vos pièces défaillantes avec des impressions sur-mesure et retrouvez votre productivité.',
    },
    {
        icon: Building2,
        title: 'Pièces industrielles',
        description:
            'Production de pièces techniques en petite et moyenne série avec une précision industrielle.',
    },
];

const individualServices = [
    {
        icon: Heart,
        title: 'Objets personnalisés',
        description:
            'Créations uniques et sur-mesure pour vos projets personnels, cadeaux ou événements spéciaux.',
    },
    {
        icon: Palette,
        title: 'Modélisme & figurines',
        description:
            'Pièces détaillées pour passionnés de modélisme, miniatures et collections avec finition soignée.',
    },
    {
        icon: Home,
        title: 'Objets décoratifs',
        description:
            'Embellissez votre intérieur avec des créations originales adaptées à votre style et vos goûts.',
    },
];

export function TargetAudience() {
    return (
        <section className='py-20 bg-white'>
            <div className='container mx-auto px-4'>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true, margin: '-100px' }}
                    className='text-center mb-16'
                >
                    <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6'>
                        Pour qui ?
                    </h2>
                    <p className='text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
                        Nous accompagnons tous vos projets, des plus techniques
                        aux plus créatifs, avec la même passion du détail et la
                        même exigence de qualité.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true, margin: '-100px' }}
                    className='max-w-6xl mx-auto'
                >
                    <Tabs defaultValue='professionals' className='w-full'>
                        <TabsList className='grid w-full grid-cols-2 mb-12 h-auto p-2'>
                            <TabsTrigger
                                value='professionals'
                                className='text-base md:text-lg py-4 px-6 data-[state=active]:bg-blue-500 data-[state=active]:text-white'
                            >
                                <Building2 className='w-5 h-5 mr-2' />
                                Professionnels
                            </TabsTrigger>
                            <TabsTrigger
                                value='individuals'
                                className='text-base md:text-lg py-4 px-6 data-[state=active]:bg-blue-500 data-[state=active]:text-white'
                            >
                                <Home className='w-5 h-5 mr-2' />
                                Particuliers
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value='professionals' className='mt-8'>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className='mb-8 text-center'>
                                    <h3 className='text-2xl md:text-3xl font-bold text-gray-900 mb-4'>
                                        Solutions professionnelles
                                    </h3>
                                    <p className='text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed'>
                                        Pour les professionnels, Hexoprint offre
                                        des solutions d&apos;impression 3D
                                        adaptées à vos enjeux industriels avec
                                        réactivité et professionnalisme.
                                    </p>
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                                    {professionalServices.map(
                                        (service, index) => {
                                            const IconComponent = service.icon;
                                            return (
                                                <motion.div
                                                    key={index}
                                                    initial={{
                                                        opacity: 0,
                                                        y: 30,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    transition={{
                                                        duration: 0.5,
                                                        delay: index * 0.1,
                                                    }}
                                                >
                                                    <Card className='h-full hover:shadow-lg transition-shadow duration-300 border-2 hover:border-blue-100'>
                                                        <CardHeader className='text-center'>
                                                            <div className='mx-auto mb-4 p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full w-16 h-16 flex items-center justify-center'>
                                                                <IconComponent className='w-8 h-8 text-white' />
                                                            </div>
                                                            <CardTitle className='text-xl font-semibold text-gray-900'>
                                                                {service.title}
                                                            </CardTitle>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <CardDescription className='text-gray-600 text-center leading-relaxed'>
                                                                {
                                                                    service.description
                                                                }
                                                            </CardDescription>
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            );
                                        }
                                    )}
                                </div>
                            </motion.div>
                        </TabsContent>

                        <TabsContent value='individuals' className='mt-8'>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className='mb-8 text-center'>
                                    <h3 className='text-2xl md:text-3xl font-bold text-gray-900 mb-4'>
                                        Créations personnalisées
                                    </h3>
                                    <p className='text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed'>
                                        Chez Hexoprint, tous les projets sont
                                        importants. Nous accompagnons chaque
                                        client en prenant le temps nécessaire
                                        pour comprendre ses besoins et obtenir
                                        une finition impeccable.
                                    </p>
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                                    {individualServices.map(
                                        (service, index) => {
                                            const IconComponent = service.icon;
                                            return (
                                                <motion.div
                                                    key={index}
                                                    initial={{
                                                        opacity: 0,
                                                        y: 30,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    transition={{
                                                        duration: 0.5,
                                                        delay: index * 0.1,
                                                    }}
                                                >
                                                    <Card className='h-full hover:shadow-lg transition-shadow duration-300 border-2 hover:border-cyan-100'>
                                                        <CardHeader className='text-center'>
                                                            <div className='mx-auto mb-4 p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full w-16 h-16 flex items-center justify-center'>
                                                                <IconComponent className='w-8 h-8 text-white' />
                                                            </div>
                                                            <CardTitle className='text-xl font-semibold text-gray-900'>
                                                                {service.title}
                                                            </CardTitle>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <CardDescription className='text-gray-600 text-center leading-relaxed'>
                                                                {
                                                                    service.description
                                                                }
                                                            </CardDescription>
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            );
                                        }
                                    )}
                                </div>
                            </motion.div>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>
        </section>
    );
}
