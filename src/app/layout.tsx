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
    title: "Hexo'print - Impression 3D artisanale à Seysses (31)",
    description:
        "Spécialiste de l'impression 3D pour professionnels et particuliers en Haute-Garonne. Prototypage rapide, modélisme, pièces sur-mesure.",
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
            </body>
        </html>
    );
}
