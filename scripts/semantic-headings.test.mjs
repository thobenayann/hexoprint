import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const routeHeadingSources = [
    ['/', 'src/components/sections/HeroSection.tsx'],
    ['/prestations', 'src/app/(client)/prestations/page.tsx'],
    ['/contact', 'src/components/sections/ContactHero.tsx'],
    ['/a-propos', 'src/components/sections/AboutHero.tsx'],
    ['/galerie', 'src/components/sections/GalleryHero.tsx'],
    ['/blog', 'src/components/sections/BlogHeroClient.tsx'],
    ['/mentions-legales', 'src/app/(client)/mentions-legales/page.tsx'],
    [
        '/politique-confidentialite',
        'src/app/(client)/politique-confidentialite/page.tsx',
    ],
    ['/blog/[slug]', 'src/app/(client)/blog/[slug]/page.tsx'],
];

for (const [route, sourcePath] of routeHeadingSources) {
    test(`${route} has exactly one visible source h1`, () => {
        const source = fs.readFileSync(path.resolve(sourcePath), 'utf8');
        const h1Count = (source.match(/<h1\b/gi) || []).length;

        assert.equal(h1Count, 1);
    });
}
