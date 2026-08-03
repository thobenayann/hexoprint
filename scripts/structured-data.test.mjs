import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const seoUtilsSource = fs.readFileSync('src/lib/seo-utils.ts', 'utf8');
const compiledSeoUtils = ts.transpileModule(seoUtilsSource, {
    compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2017,
    },
}).outputText;

function getSeoUtils() {
    const testModule = { exports: {} };
    vm.runInNewContext(compiledSeoUtils, {
        module: testModule,
        exports: testModule.exports,
        require: (specifier) => {
            if (specifier === '@/lib/company-info') {
                return {
                    COMPANY_INFO: {
                        name: "Hexo'print",
                        legalName: "Hexo'print",
                        founder: 'Yann RAVARY',
                        siteUrl: 'https://www.hexoprint.fr',
                        contact: {
                            phone: '07 84 58 54 25',
                            email: 'hexoprint3d@gmail.com',
                            address: {
                                street: 'Impasse Porthos',
                                city: 'Seysses',
                                department: 'Haute-Garonne',
                                postalCode: '31600',
                                country: 'France',
                            },
                        },
                        social: {
                            instagram: 'https://www.instagram.com/hexoprint3d',
                        },
                        schedule: {
                            weekdays: { hours: '9h00 - 18h00' },
                            saturday: { hours: '9h00 - 12h00' },
                        },
                        serviceArea: {
                            localDelivery: { areas: ['Seysses'] },
                            extendedDelivery: { areas: ['Haute-Garonne'] },
                            shipping: { national: true },
                        },
                    },
                };
            }
            throw new Error(`Unexpected module: ${specifier}`);
        },
    });
    return testModule.exports;
}

test('connects the root business and website entities through stable identifiers', () => {
    const seoUtils = getSeoUtils();
    const business = seoUtils.generateLocalBusinessStructuredData();
    const website = seoUtils.generateWebSiteStructuredData();

    assert.equal(business['@id'], 'https://www.hexoprint.fr/#business');
    assert.equal(business.url, 'https://www.hexoprint.fr');
    assert.equal(website['@id'], 'https://www.hexoprint.fr/#website');
    assert.equal(
        website.publisher['@id'],
        'https://www.hexoprint.fr/#business'
    );
    assert.equal(website.inLanguage, 'fr-FR');
});

test('uses entity references and ordered absolute breadcrumb URLs', () => {
    const seoUtils = getSeoUtils();
    const service = seoUtils.generateServiceStructuredData({
        name: 'Impression 3D',
        description: 'Fabrication additive sur mesure',
        url: 'https://www.hexoprint.fr/prestations',
        serviceType: 'Impression 3D',
    });
    const breadcrumbs = seoUtils.generateBreadcrumbStructuredData([
        { name: 'Accueil', url: 'https://www.hexoprint.fr/' },
        { name: 'Prestations', url: 'https://www.hexoprint.fr/prestations' },
    ]);

    assert.equal(service.provider['@id'], 'https://www.hexoprint.fr/#business');
    assert.equal(breadcrumbs.itemListElement.length, 2);
    assert.equal(breadcrumbs.itemListElement[0]['@type'], 'ListItem');
    assert.equal(breadcrumbs.itemListElement[0].position, 1);
    assert.equal(breadcrumbs.itemListElement[0].name, 'Accueil');
    assert.equal(breadcrumbs.itemListElement[0].item, 'https://www.hexoprint.fr/');
    assert.equal(breadcrumbs.itemListElement[1]['@type'], 'ListItem');
    assert.equal(breadcrumbs.itemListElement[1].position, 2);
    assert.equal(breadcrumbs.itemListElement[1].name, 'Prestations');
    assert.equal(
        breadcrumbs.itemListElement[1].item,
        'https://www.hexoprint.fr/prestations'
    );
});
