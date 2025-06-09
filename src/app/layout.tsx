import { Navigation } from '@/components/layout/navigation';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
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
                className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
            >
                <Navigation />
                {children}
            </body>
        </html>
    );
}
