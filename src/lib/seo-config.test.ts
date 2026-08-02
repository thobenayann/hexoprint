import { getStaticSeoPage, STATIC_SEO_PAGES } from '@/lib/seo-config';

getStaticSeoPage('/');
getStaticSeoPage('/prestations');

// @ts-expect-error Only declared static SEO paths are accepted.
getStaticSeoPage('/inexistant');

const home = getStaticSeoPage('/');

// @ts-expect-error Static SEO pages are read-only.
home.title = 'Titre modifié';

// @ts-expect-error The exposed registry is read-only.
STATIC_SEO_PAGES.push(home);
