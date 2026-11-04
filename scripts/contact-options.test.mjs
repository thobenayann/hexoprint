import assert from 'node:assert/strict';
import test from 'node:test';
import { BUDGETS, DEADLINES, PROJECT_TYPES, getOptionLabel } from '../src/lib/contact-options.mjs';

test('closed lists match the form values', () => {
  assert.deepEqual(PROJECT_TYPES.map((o) => o.value), ['prototypage', 'reparation', 'modelisme', 'decoration', 'piece-technique', 'petite-serie', 'autre']);
  assert.deepEqual(BUDGETS.map((o) => o.value), ['0-50', '50-100', '100-200', '200-500', '500+']);
  assert.deepEqual(DEADLINES.map((o) => o.value), ['urgent', '1-semaine', '2-semaines', '1-mois', 'flexible']);
});

test('labels are returned only for known values', () => {
  assert.equal(getOptionLabel(PROJECT_TYPES, 'reparation'), 'Réparation de pièce');
  assert.equal(getOptionLabel(PROJECT_TYPES, 'https://partagepro.online/x'), null);
  assert.equal(getOptionLabel(BUDGETS, undefined), null);
});
