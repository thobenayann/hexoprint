import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('contact tracks the approved aggregate conversion only after email success', async () => {
  const contactRoute = await source('src/app/api/contact/route.ts');

  assert.match(contactRoute, /import \{ trackServerEvent \} from '@\/lib\/analytics-server';/);
  assert.match(
    contactRoute,
    /if \(!emailResult\.success\) \{[\s\S]*?return NextResponse\.json[\s\S]*?\}[\s\S]*?await trackServerEvent\('contact_form_submitted', \{\s*customerType: formData\.type,\s*hasFiles: formData\.files\.length > 0,\s*\}\);[\s\S]*?return NextResponse\.json/
  );
  const contactPayload = contactRoute.match(
    /trackServerEvent\('contact_form_submitted', \{([\s\S]*?)\}\)/
  )?.[1];
  assert.ok(contactPayload);
  assert.doesNotMatch(contactPayload, /(?:email|firstName|lastName|phone|description|filename|url)/);
});

test('upload tracks an aggregate conversion only after every upload succeeds', async () => {
  const uploadRoute = await source('src/app/api/upload/route.ts');

  assert.match(uploadRoute, /import \{ trackServerEvent \} from '@\/lib\/analytics-server';/);
  assert.match(
    uploadRoute,
    /if \(uploadResults\.some\(\(result\) => !result\.success\)\) \{[\s\S]*?return NextResponse\.json\(\{ results: uploadResults \}\);[\s\S]*?\}[\s\S]*?await trackServerEvent\('quote_file_upload_succeeded', \{\s*fileCount: files\.length,\s*\}\);[\s\S]*?return NextResponse\.json\(\{ results: uploadResults \}\)/
  );
  const uploadPayload = uploadRoute.match(
    /trackServerEvent\('quote_file_upload_succeeded', \{([\s\S]*?)\}\)/
  )?.[1];
  assert.ok(uploadPayload);
  assert.doesNotMatch(uploadPayload, /(?:filename|pathname|url|contentType|size|name|type)/);
});

test('analytics tracking failures cannot turn successful business operations into 500 responses', async () => {
  const [contactRoute, uploadRoute] = await Promise.all([
    source('src/app/api/contact/route.ts'),
    source('src/app/api/upload/route.ts'),
  ]);

  for (const route of [contactRoute, uploadRoute]) {
    assert.match(
      route,
      /try \{\s*await trackServerEvent\([\s\S]*?\);\s*\} catch \(analyticsError\) \{\s*console\.error\('Analytics tracking failed:', analyticsError\);\s*\}/
    );
  }
});
