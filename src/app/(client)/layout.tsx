import { Footer } from '@/components/layout/Footer';
import { Navigation } from '@/components/layout/navigation';

export default function ClientLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navigation />
            {children}
            <Footer />
        </>
    );
}
