/** @typedef {{ value: string; label: string }} ContactOption */

/** @type {ReadonlyArray<ContactOption>} */
export const PROJECT_TYPES = [
  { value: 'prototypage', label: 'Prototypage rapide' },
  { value: 'reparation', label: 'Réparation de pièce' },
  { value: 'modelisme', label: 'Modélisme' },
  { value: 'decoration', label: 'Objet décoratif' },
  { value: 'piece-technique', label: 'Pièce technique sur-mesure' },
  { value: 'petite-serie', label: 'Petite série' },
  { value: 'autre', label: 'Autre projet' },
];

/** @type {ReadonlyArray<ContactOption>} */
export const BUDGETS = [
  { value: '0-50', label: 'Moins de 50€' },
  { value: '50-100', label: '50€ - 100€' },
  { value: '100-200', label: '100€ - 200€' },
  { value: '200-500', label: '200€ - 500€' },
  { value: '500+', label: 'Plus de 500€' },
];

/** @type {ReadonlyArray<ContactOption>} */
export const DEADLINES = [
  { value: 'urgent', label: 'Urgent (48h)' },
  { value: '1-semaine', label: 'Sous 1 semaine' },
  { value: '2-semaines', label: 'Sous 2 semaines' },
  { value: '1-mois', label: 'Sous 1 mois' },
  { value: 'flexible', label: 'Flexible' },
];

/**
 * Libellé d'une valeur de liste fermée, ou null si la valeur n'est pas connue.
 * Aucune valeur saisie par le visiteur n'est jamais renvoyée telle quelle.
 *
 * @param {ReadonlyArray<ContactOption>} options
 * @param {unknown} value
 * @returns {string | null}
 */
export function getOptionLabel(options, value) {
  const option = options.find((candidate) => candidate.value === value);
  return option ? option.label : null;
}
