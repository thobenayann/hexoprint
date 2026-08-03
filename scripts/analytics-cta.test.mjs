import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('DevisButton and PrimaryButton only track the approved quote CTA sources', async () => {
  const [devisButton, primaryButton, callToAction] = await Promise.all([
    source('src/components/ui/devis-button.tsx'),
    source('src/components/ui/primary-button.tsx'),
    source('src/components/sections/CallToAction.tsx'),
  ]);

  assert.match(devisButton, /'use client';/);
  assert.match(devisButton, /source\?: 'desktop_navigation' \| 'mobile_navigation'/);
  assert.match(devisButton, /trackClientEvent\('quote_cta_clicked', \{ source \}\)/);
  assert.match(primaryButton, /analyticsSource\?: 'page_cta'/);
  assert.match(primaryButton, /analyticsSource\s*&&\s*trackClientEvent\('quote_cta_clicked',\s*\{\s*source: analyticsSource,/);
  assert.match(callToAction, /analyticsSource="page_cta"/);
  assert.match(callToAction, /trackClientEvent\('quote_cta_clicked',\s*\{\s*source: 'page_cta',/);
});

test('footer contact links track only their channel and footer source while preserving hrefs', async () => {
  const [footer, trackedContactLink] = await Promise.all([
    source('src/components/layout/Footer.tsx'),
    source('src/components/analytics/tracked-contact-link.tsx'),
  ]);

  assert.match(footer, /TrackedContactLink/);
  assert.match(footer, /channel: 'phone' as const/);
  assert.match(footer, /channel: 'email' as const/);
  assert.match(footer, /channel=\{contact\.channel\}\s*source="footer"/);
  assert.match(footer, /channel="email"\s*source="footer"/);
  assert.match(footer, /href:\s*`tel:\$\{COMPANY_INFO\.contact\.phone\.replace/);
  assert.match(footer, /href=\{`mailto:\$\{COMPANY_INFO\.contact\.email\}`\}/);
  assert.match(trackedContactLink, /trackClientEvent\('contact_link_clicked', \{ channel, source \}\)/);
  assert.match(trackedContactLink, /onClick\?\.\(event\)/);
  assert.doesNotMatch(trackedContactLink, /href.*trackClientEvent/);
});
