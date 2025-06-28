import { allGalleryQuery } from '@/lib/sanity-queries';
import { sanityFetch } from '@/sanity/lib/live';
import type { GalleryItemType } from '@/types/gallery';
import { GalleryContent } from './GalleryContent';

export async function GalleryContentWrapper() {
    const { data: items } = await sanityFetch({
        query: allGalleryQuery,
        tags: ['gallery'],
    });

    const galleryItems: GalleryItemType[] = items || [];

    return (
        <div data-gallery-section>
            <GalleryContent items={galleryItems} />
        </div>
    );
}
