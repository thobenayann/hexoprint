import { createAnalyticsEvent } from './analytics-contract';

createAnalyticsEvent('contact_form_submitted', {
  customerType: 'particulier',
  hasFiles: false,
});

createAnalyticsEvent('contact_form_submitted', {
  customerType: 'professionnel',
  hasFiles: true,
  // @ts-expect-error An email address is never an allowed Analytics property.
  email: 'personne@example.com',
});
