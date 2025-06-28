import { allGalleryQuery } from '@/lib/sanity-queries';
import { sanityFetch } from '@/sanity/lib/live';
import type { GalleryItemType } from '@/types/gallery';
import { GalleryContent } from './GalleryContent';

export async function GalleryContentWrapper() {
    const { data: items } = await sanityFetch({
        query: allGalleryQuery,
        tags: ['gallery'],
    });

    // Vérification et typage correct des données avec fallback sécurisé
    const galleryItems: GalleryItemType[] =
        (items as GalleryItemType[] | null) ?? [];

    return (
        <div data-gallery-section>
            <GalleryContent items={galleryItems} />
        </div>
    );
}
