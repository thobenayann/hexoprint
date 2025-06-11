import { Heart, Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const navigationLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/a-propos', label: 'À propos' },
    { href: '/prestations', label: 'Prestations' },
    { href: '/galerie', label: 'Galerie' },
    { href: '/blog', label: 'Blog' },
    { href: '/devis', label: 'Demande de devis' },
    { href: '/contact', label: 'Contact' },
];

const socialLinks = [
    {
        href: 'https://www.instagram.com/hexoprint3d',
        icon: 'instagram',
        label: 'Instagram',
        hoverColor:
            'hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600',
    },
    {
        href: 'mailto:contact@hexoprint.fr',
        icon: Mail,
        label: 'Email',
        hoverColor: 'hover:bg-primary',
    },
];

const contactInfo = [
    {
        icon: MapPin,
        title: 'Seysses',
        subtitle: 'Haute-Garonne (31)',
    },
    {
        icon: Phone,
        title: 'Sur demande',
        href: 'tel:+337 84 58 54 25',
    },
    {
        icon: Mail,
        title: 'contact@hexoprint.fr',
        href: 'mailto:contact@hexoprint.fr',
    },
];

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className='relative bg-gradient-to-b from-background to-muted/30 border-t border-border'>
            {/* Background pattern */}
            <div className='absolute inset-0 bg-[url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJkb3RzIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSIjMjQ1NTZBIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNkb3RzKSIvPgo8L3N2Zz4K")] opacity-40'></div>

            <div className='container mx-auto px-4 py-16 relative z-10'>
                {/* Main Footer Content */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12'>
                    {/* Brand & Description */}
                    <div className='lg:col-span-2'>
                        {/* Logo */}
                        <div className='mb-6'>
                            <Image
                                src='/logos/logo-hexoprint-svg-sans-texte.svg'
                                alt='Hexoprint - Impression 3D'
                                width={200}
                                height={60}
                                className='h-12 w-auto brightness-110'
                            />
                        </div>

                        {/* Description */}
                        <p className='text-muted-foreground mb-6 leading-relaxed max-w-md'>
                            Spécialiste en impression 3D basé à Seysses (31),
                            Hexoprint accompagne professionnels et particuliers
                            dans leurs projets de prototypage, réparation et
                            création sur-mesure.
                        </p>

                        {/* Social Links */}
                        <div className='flex items-center space-x-4'>
                            {socialLinks.map((social) => {
                                return (
                                    <Link
                                        key={social.label}
                                        href={social.href}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className={`group relative p-3 bg-card border border-border rounded-xl ${social.hoverColor} transition-all duration-300 transform hover:scale-110 hover:shadow-lg cursor-pointer`}
                                    >
                                        {social.icon === 'instagram' ? (
                                            <Image
                                                src='/logos/instagram_dark.svg'
                                                alt='Instagram'
                                                width={20}
                                                height={20}
                                                className='w-5 h-5 text-muted-foreground group-hover:text-white transition-colors duration-300'
                                            />
                                        ) : (
                                            <social.icon className='w-5 h-5 text-muted-foreground group-hover:text-white transition-colors duration-300' />
                                        )}

                                        {/* Glow effect */}
                                        <div className='absolute inset-0 bg-primary/20 rounded-xl blur-lg scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className='text-foreground font-semibold text-lg mb-6 relative inline-block'>
                            <span className='relative z-10'>Contact</span>
                            <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-hexo-blue-light'></div>
                        </h3>
                        <div className='space-y-4'>
                            {contactInfo.map((contact, index) => {
                                const IconComponent = contact.icon;
                                const content = (
                                    <div className='flex items-start space-x-3 group'>
                                        <div className='p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300'>
                                            <IconComponent className='w-4 h-4 text-primary flex-shrink-0 mt-0.5' />
                                        </div>
                                        <div>
                                            <p className='text-foreground group-hover:text-primary transition-colors duration-300'>
                                                {contact.title}
                                            </p>
                                            {contact.subtitle && (
                                                <p className='text-muted-foreground text-sm'>
                                                    {contact.subtitle}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );

                                return contact.href ? (
                                    <Link
                                        key={index}
                                        href={contact.href}
                                        className='block'
                                    >
                                        {content}
                                    </Link>
                                ) : (
                                    <div key={index}>{content}</div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className='text-foreground font-semibold text-lg mb-6 relative inline-block'>
                            <span className='relative z-10'>Navigation</span>
                            <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-hexo-blue-light'></div>
                        </h3>
                        <nav className='space-y-3'>
                            {navigationLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className='group flex items-center text-muted-foreground hover:text-primary transition-colors duration-300'
                                >
                                    <div className='w-1 h-1 bg-muted-foreground rounded-full mr-3 group-hover:bg-primary group-hover:scale-150 transition-all duration-300'></div>
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Divider with gradient */}
                <div className='relative mb-8'>
                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-border to-transparent h-px'></div>
                </div>

                {/* Bottom Section */}
                <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 mb-8'>
                    {/* Copyright */}
                    <div className='text-muted-foreground text-sm'>
                        © {currentYear} Hexo&apos;print - Yann RAVARY. Tous droits
                        réservés.
                    </div>

                    {/* Legal Links */}
                    <div className='flex items-center space-x-6 text-sm'>
                        <Link
                            href='/mentions-legales'
                            className='text-muted-foreground hover:text-foreground transition-colors duration-300'
                        >
                            Mentions légales
                        </Link>
                        <Link
                            href='/politique-confidentialite'
                            className='text-muted-foreground hover:text-foreground transition-colors duration-300'
                        >
                            Politique de confidentialité
                        </Link>
                        <div className='text-muted-foreground/70'>
                            SIRET : À définir
                        </div>
                    </div>
                </div>

                {/* Trust Badge */}
                <div className='text-center'>
                    <div className='relative inline-block max-w-full'>
                        {/* Glass morphism background */}
                        <div className='absolute inset-0 bg-gradient-to-r from-card/50 via-primary/10 to-card/50 backdrop-blur-sm border border-border rounded-2xl md:rounded-full'></div>

                        {/* Content */}
                        <div className='relative z-10 px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row items-center gap-3 md:gap-4'>
                            <div className='flex items-center gap-2'>
                                <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
                                <span className='text-xs font-mono text-muted-foreground'>
                                    ACTIF
                                </span>
                            </div>
                            <div className='flex flex-col md:flex-row items-center gap-2 md:gap-3 text-muted-foreground text-xs md:text-sm text-center md:text-left'>
                                <span>🇫🇷 Artisan français</span>
                                <span className='hidden md:inline'>•</span>
                                <span>Fabrication locale</span>
                                <span className='hidden md:inline'>•</span>
                                <span className='flex items-center gap-1'>
                                    Fait avec{' '}
                                    <Heart className='w-3 h-3 text-red-500' /> à
                                    Seysses
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
