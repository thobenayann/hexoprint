import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test, { after } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { render } from 'react-email';
import ts from 'typescript';
import { createContactSubmissionSchema } from '../src/lib/contact-schema.mjs';
import { screenContactSubmission } from '../src/lib/contact-screening.mjs';

/*
 * Rendu réel du mail d'administration, du schéma serveur au HTML : on vérifie
 * les attributs `href` produits, pas le source du gabarit.
 *
 * Le gabarit est en TSX : il est transpilé avec `typescript` (JSX
 * `react-jsx`) vers un module `.mjs` écrit dans le dossier temporaire du
 * système. Ses imports y sont réécrits en URL `file://` absolues : `@/...`
 * vers `src/...`, un paquet vers l'entrée que Node résout depuis ce dépôt
 * (`import.meta.resolve`, donc la même instance de React que `react-email`).
 */

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const TEMPLATE = path.join(ROOT, 'src', 'components', 'emails', 'contact-form-admin-email.tsx');

const BLOB_BASE = 'https://store.public.blob.vercel-storage.com';
const BLOB_HOST = new URL(BLOB_BASE).hostname;
const FILE_URL = `${BLOB_BASE}/figurine-abc123.stl`;
const CAMPAIGN = "Une pièce de remplacement imprimée en 3D évite d'attendre un fournisseur d'origine. Projet exposé ici : ";
const SOFT_HYPHEN = String.fromCharCode(0xad);

/** @param {string} specifier */
function toFileUrl(specifier) {
  if (specifier.startsWith('@/')) {
    const target = path.join(ROOT, 'src', ...specifier.slice(2).split('/'));
    assert.ok(fs.existsSync(target), `module introuvable : ${specifier}`);
    return pathToFileURL(target).href;
  }
  assert.ok(!specifier.startsWith('.') && !specifier.startsWith('/'), `import relatif inattendu : ${specifier}`);
  return import.meta.resolve(specifier);
}

const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hexoprint-admin-email-'));
after(() => fs.rmSync(workDir, { recursive: true, force: true }));

async function loadTemplate() {
  const { outputText } = ts.transpileModule(fs.readFileSync(TEMPLATE, 'utf8'), {
    fileName: TEMPLATE,
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
    },
  });
  // TypeScript écrit chaque déclaration d'import sur une seule ligne.
  const rewritten = outputText.replace(
    /^(import\s[^\n]*?\bfrom\s*)(['"])([^'"\n]+)\2/gm,
    (_, head, quote, specifier) => `${head}${quote}${toFileUrl(specifier)}${quote}`
  );
  const unresolved = ts
    .preProcessFile(rewritten, true, true)
    .importedFiles.map((file) => file.fileName)
    .filter((specifier) => !specifier.startsWith('file:'));
  assert.deepEqual(unresolved, [], 'tous les imports du gabarit sont réécrits');

  const modulePath = path.join(workDir, 'contact-form-admin-email.mjs');
  fs.writeFileSync(modulePath, rewritten);
  return import(pathToFileURL(modulePath).href);
}

const { ContactFormAdminEmail } = await loadTemplate();

/**
 * Rendu comme dans `email-service.ts` : données validées par le schéma serveur,
 * tri, puis gabarit.
 *
 * @param {string} description
 */
async function renderAdminEmail(description) {
  const formData = createContactSubmissionSchema(BLOB_BASE).parse({
    type: 'particulier',
    firstName: 'Camille',
    lastName: 'Martin',
    email: 'camille@example.com',
    phone: '06 00 00 00 00',
    company: '',
    projectType: 'prototypage',
    description,
    budget: '',
    deadline: '',
    files: [{ name: 'figurine.stl', size: 1048576, type: 'model/stl', url: FILE_URL }],
  });
  const extraAllowedHosts = [BLOB_HOST];
  const screening = screenContactSubmission(formData, { extraAllowedHosts });
  const html = await render(
    ContactFormAdminEmail({ formData, screening, extraAllowedHosts, submittedAt: '03/11/2026 10:00' })
  );
  // React sépare deux nœuds texte voisins par `<!-- -->` : sans intérêt ici.
  return { screening, html: html.replace(/<!-- -->/g, '') };
}

/** @param {string} html */
function hrefsOf(html) {
  return [...html.matchAll(/\shref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)].map((match) =>
    (match[1] ?? match[2] ?? match[3]).replace(/&amp;/g, '&')
  );
}

test('a suspect request renders without any href, campaign link and Blob file defanged', async () => {
  for (const description of [
    `${CAMPAIGN}https://partagepro.online/fr/b2b/hexoprint`,
    // Finding 1 : le trait d'union conditionnel est retiré par le schéma.
    `${CAMPAIGN}partagepro${SOFT_HYPHEN}.online/fr/b2b/hexoprint`,
  ]) {
    const { screening, html } = await renderAdminEmail(description);
    assert.equal(screening.verdict, 'suspect', description);
    assert.doesNotMatch(html, /href\s*=/i, description);
    assert.deepEqual(hrefsOf(html), [], description);
    assert.match(html, /partagepro\[\.\]online\/fr\/b2b\/hexoprint/, description);
    assert.doesNotMatch(html, /partagepro\.online/, description);
    // Le chemin d'un lien désamorcé est relu comme du texte : `abc123.stl` y
    // ressemble à un domaine, il est donc désamorcé lui aussi.
    assert.match(html, /hxxps:\/\/store\[\.\]public\[\.\]blob\[\.\]vercel-storage\[\.\]com\/figurine-abc123\[\.\]stl/, description);
  }
});

test('a clean request renders only the allowed link and the Blob file as hrefs', async () => {
  const { screening, html } = await renderAdminEmail('Bonjour, mon modèle est ici : https://we.tl/t-abc, merci.');
  assert.equal(screening.verdict, 'clean');
  assert.deepEqual(hrefsOf(html), ['https://we.tl/t-abc', FILE_URL]);
});
