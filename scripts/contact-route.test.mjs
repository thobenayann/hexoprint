import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('the route screens, logs without personal data and answers uniformly', async () => {
  const route = await source('src/app/api/contact/route.ts');
  assert.match(route, /screenContactSubmission\(formData, \{ extraAllowedHosts \}\)/);
  assert.match(route, /JSON\.stringify\(toScreeningLog\(screening\)\)/);
  assert.match(route, /console\.warn/);
  assert.match(route, /console\.info/);
  assert.doesNotMatch(route, /adminEmailId|clientEmailId/);
  assert.match(route, /if \(screening\.verdict === 'clean'\) \{\s*try \{\s*await trackServerEvent\('contact_form_submitted'/);
  assert.match(route, /'Votre demande a été envoyée avec succès\. Nous vous répondrons dans les plus brefs délais\.'/);
});
