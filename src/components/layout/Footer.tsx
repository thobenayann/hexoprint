'use client';

import { motion } from 'framer-motion';
import { Instagram, Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className='bg-gray-900 text-gray-300'>
            {/* Main Footer Content */}
            <div className='container mx-auto px-4 py-16'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                    {/* Brand & Description */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true, margin: '-100px' }}
                        className='lg:col-span-2'
                    >
                        {/* Logo */}
                        <div className='mb-6'>
                            <Image
                                src='/logos/logo-hexoprint-svg-avec-texte.svg'
                                alt='Hexoprint - Impression 3D'
                                width={200}
                                height={60}
                                className='h-12 w-auto'
                            />
                        </div>

                        {/* Description */}
                        <p className='text-gray-400 mb-6 leading-relaxed max-w-md'>
                            Spécialiste en impression 3D basé à Seysses (31),
                            Hexoprint accompagne professionnels et particuliers
                            dans leurs projets de prototypage, réparation et
                            création sur-mesure.
                        </p>

                        {/* Social Links */}
                        <div className='flex items-center space-x-4'>
                            <Link
                                href='https://www.instagram.com/hexoprint3d'
                                target='_blank'
                                className='group p-3 bg-gray-800 rounded-full hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 transition-all duration-300 transform hover:scale-110'
                            >
                                <Instagram className='w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300' />
                            </Link>

                            <Link
                                href='mailto:contact@hexoprint.fr'
                                className='group p-3 bg-gray-800 rounded-full hover:bg-blue-600 transition-all duration-300 transform hover:scale-110'
                            >
                                <Mail className='w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300' />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true, margin: '-100px' }}
                    >
                        <h3 className='text-white font-semibold text-lg mb-6'>
                            Contact
                        </h3>
                        <div className='space-y-4'>
                            <div className='flex items-start space-x-3'>
                                <MapPin className='w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0' />
                                <div>
                                    <p className='text-gray-300'>Seysses</p>
                                    <p className='text-gray-400 text-sm'>
                                        Haute-Garonne (31)
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-center space-x-3'>
                                <Phone className='w-5 h-5 text-cyan-400 flex-shrink-0' />
                                <Link
                                    href='tel:+33123456789'
                                    className='text-gray-300 hover:text-white transition-colors duration-200'
                                >
                                    Sur demande
                                </Link>
                            </div>

                            <div className='flex items-center space-x-3'>
                                <Mail className='w-5 h-5 text-cyan-400 flex-shrink-0' />
                                <Link
                                    href='mailto:contact@hexoprint.fr'
                                    className='text-gray-300 hover:text-white transition-colors duration-200'
                                >
                                    contact@hexoprint.fr
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true, margin: '-100px' }}
                    >
                        <h3 className='text-white font-semibold text-lg mb-6'>
                            Navigation
                        </h3>
                        <nav className='space-y-3'>
                            {[
                                { href: '/', label: 'Accueil' },
                                { href: '/a-propos', label: 'À propos' },
                                { href: '/prestations', label: 'Prestations' },
                                { href: '/galerie', label: 'Galerie' },
                                { href: '/blog', label: 'Blog' },
                                { href: '/devis', label: 'Demande de devis' },
                                { href: '/contact', label: 'Contact' },
                            ].map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className='block text-gray-400 hover:text-cyan-400 transition-colors duration-200'
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </motion.div>
                </div>

                {/* Divider */}
                <div className='border-t border-gray-800 my-12'></div>

                {/* Bottom Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true, margin: '-100px' }}
                    className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'
                >
                    {/* Copyright */}
                    <div className='text-gray-500 text-sm'>
                        © {currentYear} Hexo&apos;print - Yann RAVARY. Tous
                        droits réservés.
                    </div>

                    {/* Legal Links */}
                    <div className='flex items-center space-x-6 text-sm'>
                        <Link
                            href='/mentions-legales'
                            className='text-gray-500 hover:text-gray-300 transition-colors duration-200'
                        >
                            Mentions légales
                        </Link>
                        <Link
                            href='/politique-confidentialite'
                            className='text-gray-500 hover:text-gray-300 transition-colors duration-200'
                        >
                            Politique de confidentialité
                        </Link>
                        <div className='text-gray-600'>SIRET : À définir</div>
                    </div>
                </motion.div>

                {/* Trust Badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true, margin: '-100px' }}
                    className='mt-8 pt-8 border-t border-gray-800 text-center'
                >
                    <div className='inline-flex items-center space-x-2 bg-gray-800 rounded-full px-6 py-3'>
                        <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
                        <span className='text-gray-400 text-sm'>
                            🇫🇷 Artisan français • Fabrication locale • Livraison
                            nationale
                        </span>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}
