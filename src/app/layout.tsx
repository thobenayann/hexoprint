import { Footer } from '@/components/layout/Footer';
import { Navigation } from '@/components/layout/navigation';
import type { Metadata } from 'next';
import { Open_Sans, Orbitron, Playfair_Display } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '700'],
    variable: '--font-playfair',
    display: 'swap',
    preload: true,
});

const openSans = Open_Sans({
    subsets: ['latin'],
    weight: ['400', '600', '700'],
    variable: '--font-open-sans',
    display: 'swap',
    preload: true,
});

const orbitron = Orbitron({
    subsets: ['latin'],
    weight: ['400', '700', '900'],
    variable: '--font-orbitron',
    display: 'swap',
    preload: true,
});

export const metadata: Metadata = {
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_SITE_URL || 'https://hexoprint.fr'
    ),
    title: {
        default: "Hexo'print - Impression 3D artisanale à Seysses (31)",
        template: "%s | Hexo'print",
    },
    description:
        "Spécialiste de l'impression 3D pour professionnels et particuliers en Haute-Garonne. Prototypage rapide, modélisme, pièces sur-mesure.",
    keywords: [
        'impression 3D',
        'Haute-Garonne',
        'Seysses',
        'prototypage rapide',
        'modélisme',
        'fabrication additive',
    ],
    authors: [{ name: 'Yann RAVARY', url: 'https://hexoprint.fr' }],
    creator: "Hexo'print",
    publisher: "Hexo'print",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'fr_FR',
        siteName: "Hexo'print",
        title: "Hexo'print - Impression 3D artisanale à Seysses (31)",
        description:
            "Spécialiste de l'impression 3D pour professionnels et particuliers en Haute-Garonne.",
        images: [
            {
                url: '/logos/hexoprint-logo-impression-3d-with-text-1200x628.png',
                width: 1200,
                height: 628,
                alt: "Hexo'print - Spécialiste impression 3D",
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Hexo'print - Impression 3D artisanale à Seysses (31)",
        description:
            "Spécialiste de l'impression 3D pour professionnels et particuliers en Haute-Garonne.",
        images: ['/logos/hexoprint-logo-impression-3d-with-text-1200x628.png'],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='fr' suppressHydrationWarning className='dark'>
            <body
                className={`${playfair.variable} ${openSans.variable} ${orbitron.variable} antialiased dark`}
            >
                <Navigation />
                {children}
                <Footer />
            </body>
        </html>
    );
}
