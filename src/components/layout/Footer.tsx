import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { COMPANY_INFO, formatPhone } from '@/lib/company-info';
import { NavigationService } from '@/lib/navigation-config';
import { Clock, CodeXml, Heart, Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { StarBorder } from '../ui/star-border';

const socialLinks = [
    {
        href: COMPANY_INFO.social.instagram,
        icon: 'instagram',
        label: 'Instagram',
        hoverColor:
            'hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600',
    },
    {
        href: `mailto:${COMPANY_INFO.contact.email}`,
        icon: Mail,
        label: 'Email',
        hoverColor: 'hover:bg-primary',
    },
];

const contactInfo = [
    {
        icon: MapPin,
        title: COMPANY_INFO.contact.address.city,
        subtitle: COMPANY_INFO.contact.address.department,
    },
    {
        icon: Phone,
        title: formatPhone(COMPANY_INFO.contact.phone),
        href: `tel:${COMPANY_INFO.contact.phone.replace(/\s/g, '')}`,
    },
    {
        icon: Mail,
        title: COMPANY_INFO.contact.email,
        href: `mailto:${COMPANY_INFO.contact.email}`,
    },
];

export function Footer() {
    const currentYear = new Date().getFullYear();
    // Récupération des routes visibles (actives + coming-soon) depuis la configuration
    const visibleRoutes = NavigationService.getVisibleRoutes();

    // Trier les routes : actives en premier, coming-soon à la fin
    const sortedRoutes = [...visibleRoutes].sort((a, b) => {
        if (a.status === 'active' && b.status === 'coming-soon') return -1;
        if (a.status === 'coming-soon' && b.status === 'active') return 1;
        return 0;
    });

    return (
        <footer className="relative bg-gradient-to-b from-background to-muted/30 border-t border-border">
            {/* Background pattern */}
            <div className='absolute inset-0 bg-[url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJkb3RzIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSIjMjQ1NTZBIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNkb3RzKSIvPgo8L3N2Zz4K")] opacity-40'></div>

            <div className="container mx-auto px-4 py-16 relative z-10">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand & Description */}
                    <div className="lg:col-span-2">
                        {/* Logo */}
                        <div className="mb-6">
                            <Image
                                src="/logos/logo-hexoprint-svg-sans-texte.svg"
                                alt="Hexoprint - Impression 3D"
                                width={200}
                                height={60}
                                className="h-12 w-auto brightness-110"
                            />
                        </div>

                        {/* Description */}
                        <p className="text-muted-foreground mb-6 leading-relaxed max-w-md">
                            Spécialiste en impression 3D basé à Seysses (31),
                            Hexoprint accompagne professionnels et particuliers
                            dans leurs projets de prototypage, réparation et
                            création sur-mesure.
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center space-x-4">
                            {socialLinks.map((social) => {
                                return (
                                    <Link
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`group relative p-3 bg-card border border-border rounded-xl ${social.hoverColor} transition-all duration-300 transform hover:scale-110 hover:shadow-lg cursor-pointer`}
                                    >
                                        {social.icon === 'instagram' ? (
                                            <Image
                                                src="/logos/instagram_dark.svg"
                                                alt="Instagram"
                                                width={20}
                                                height={20}
                                                className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors duration-300"
                                            />
                                        ) : (
                                            <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors duration-300" />
                                        )}

                                        {/* Glow effect */}
                                        <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-foreground font-semibold text-lg mb-6 relative inline-block">
                            <span className="relative z-10">Contact</span>
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-hexo-blue-light"></div>
                        </h3>
                        <div className="space-y-4">
                            {contactInfo.map((contact, index) => {
                                const IconComponent = contact.icon;
                                const content = (
                                    <div className="flex items-start space-x-3 group">
                                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                                            <IconComponent className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                        </div>
                                        <div>
                                            <p className="text-foreground group-hover:text-primary transition-colors duration-300">
                                                {contact.title}
                                            </p>
                                            {contact.subtitle && (
                                                <p className="text-muted-foreground text-sm">
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
                                        className="block"
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
                        <h3 className="text-foreground font-semibold text-lg mb-6 relative inline-block">
                            <span className="relative z-10">Navigation</span>
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-hexo-blue-light"></div>
                        </h3>
                        <nav className="space-y-3">
                            <TooltipProvider>
                                {sortedRoutes.map((route) => {
                                    const isComingSoon =
                                        route.status === 'coming-soon';

                                    const linkContent = (
                                        <div className="group flex items-center text-muted-foreground hover:text-primary transition-colors duration-300">
                                            <div className="w-1 h-1 bg-muted-foreground rounded-full mr-3 group-hover:bg-primary group-hover:scale-150 transition-all duration-300"></div>
                                            <span className="flex items-center gap-2">
                                                {route.title}
                                                {isComingSoon && (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Clock className="w-4 h-4 text-blue-400 opacity-70" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>
                                                                Bientôt
                                                                disponible
                                                            </p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                )}
                                            </span>
                                        </div>
                                    );

                                    return isComingSoon ? (
                                        <div
                                            key={route.id}
                                            className="opacity-70 cursor-default"
                                        >
                                            {linkContent}
                                        </div>
                                    ) : (
                                        <Link key={route.id} href={route.path}>
                                            {linkContent}
                                        </Link>
                                    );
                                })}
                            </TooltipProvider>
                        </nav>
                    </div>
                </div>

                {/* Divider with gradient */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border to-transparent h-px"></div>
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 mb-8">
                    {/* Copyright */}
                    <div className="text-muted-foreground text-sm max-sm:text-center">
                        © {currentYear}{' '}
                        <span className="font-mono uppercase">
                            Hexo&apos;print
                        </span>{' '}
                        - Yann RAVARY. Tous droits réservés.
                    </div>

                    {/* Legal Links */}
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6 text-sm max-sm:border-t max-sm:border-border max-sm:pt-4">
                        <Link
                            href="/mentions-legales"
                            className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                        >
                            Mentions légales
                        </Link>
                        <Link
                            href="/politique-confidentialite"
                            className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                        >
                            Politique de confidentialité
                        </Link>
                        <div className="text-muted-foreground/70">
                            SIRET : {COMPANY_INFO.legal.siret}
                        </div>
                    </div>
                </div>

                {/* Trust Badge */}
                <div className="text-center">
                    <div className="relative inline-block max-w-full">
                        {/* Glass morphism background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-card/50 via-primary/10 to-card/50 backdrop-blur-sm border border-border rounded-2xl md:rounded-full"></div>

                        {/* Content */}
                        <div className="relative z-10 px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row items-center gap-3 md:gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-xs font-mono text-muted-foreground">
                                    ACTIF
                                </span>
                            </div>
                            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-muted-foreground text-xs md:text-sm text-center md:text-left">
                                <span>🇫🇷 Artisan français</span>
                                <span className="hidden md:inline">•</span>
                                <span>Fabrication locale</span>
                                <span className="hidden md:inline">•</span>
                                <span className="flex items-center gap-1">
                                    Fait avec{' '}
                                    <Heart className="w-3 h-3 text-red-500" /> à
                                    Seysses
                                </span>
                                <span className="hidden md:inline">•</span>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button className="flex items-center gap-2 hover:text-primary transition-colors duration-300 cursor-pointer">
                                            <CodeXml className="w-3 h-3" />
                                            <span>Développeur du site</span>
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        side="top"
                                        className="w-80 p-4"
                                        sideOffset={10}
                                    >
                                        <div className="flex flex-col items-center text-center space-y-3">
                                            <Avatar className="w-16 h-16 border-2 border-hexo-blue-dark">
                                                <AvatarImage
                                                    src="/img/yanndevweb.png"
                                                    alt="Yann THOBENA"
                                                />
                                                <AvatarFallback>
                                                    YT
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-2">
                                                <p className="text-sm text-foreground leading-relaxed">
                                                    Ce site vous plaît ? Je suis{' '}
                                                    <span className="font-semibold text-primary">
                                                        Yann THOBENA
                                                    </span>
                                                    , concepteur développeur
                                                    web, contactez-moi ! 😉
                                                </p>
                                                <Link
                                                    href="https://www.yanndevweb.com/"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <StarBorder
                                                        color="#96CFE7"
                                                        speed="4s"
                                                        size="sm"
                                                        className="font-medium"
                                                    >
                                                        Voir mon portfolio
                                                    </StarBorder>
                                                </Link>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
