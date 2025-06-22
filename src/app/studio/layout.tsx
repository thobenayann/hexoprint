export const metadata = {
    title: 'Sanity studio - Hexoprint',
    description: 'Espace de création de contenu pour le site Hexoprint',
};

export default function StudioLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <body>{children}</body>
        </html>
    );
}
