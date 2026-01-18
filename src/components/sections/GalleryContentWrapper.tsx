import { allGalleryQuery } from '@/lib/sanity-queries';
import { sanityFetch } from '@/sanity/lib/live';
import type { GalleryItemType } from '@/types/gallery';
import { normalizeCategory, toGalleryCategory } from '@/types/gallery';
import { GalleryContent } from './GalleryContent';

export async function GalleryContentWrapper() {
    const { data: items } = await sanityFetch({
        query: allGalleryQuery,
        tags: ['gallery'],
    });

    // Normaliser et valider les données depuis Sanity
    // Supprime les caractères invisibles qui peuvent être présents dans les données
    const galleryItems: GalleryItemType[] = (
        (items as GalleryItemType[] | null) ?? []
    ).map((item) => {
        // Normaliser la catégorie pour supprimer les caractères invisibles
        const normalizedCategory = normalizeCategory(item.category);
        return {
            ...item,
            category: toGalleryCategory(normalizedCategory),
        };
    });

    return (
        <div data-gallery-section>
            <GalleryContent items={galleryItems} />
        </div>
    );
}
