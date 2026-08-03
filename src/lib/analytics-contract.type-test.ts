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

const contactWithEmail = {
  customerType: 'professionnel' as const,
  hasFiles: true,
  email: 'personne@example.com',
};
// @ts-expect-error Variables with an email must be rejected too.
createAnalyticsEvent('contact_form_submitted', contactWithEmail);

const contactWithPhone = {
  customerType: 'particulier' as const,
  hasFiles: false,
  phone: '+33102030405',
};
// @ts-expect-error Variables with a phone number must be rejected too.
createAnalyticsEvent('contact_form_submitted', contactWithPhone);

const contactWithMessage = {
  customerType: 'particulier' as const,
  hasFiles: false,
  message: 'Bonjour',
};
// @ts-expect-error Variables with a free-form message must be rejected too.
createAnalyticsEvent('contact_form_submitted', contactWithMessage);

const uploadWithFilename = {
  fileCount: 2,
  filename: 'devis.stl',
};
// @ts-expect-error Variables with a filename must be rejected too.
createAnalyticsEvent('quote_file_upload_succeeded', uploadWithFilename);

const contactPayload = {
  customerType: 'particulier',
  hasFiles: false,
};
// @ts-expect-error An event name cannot be paired with another event's payload.
createAnalyticsEvent('quote_cta_clicked', contactPayload);

createAnalyticsEvent('quote_cta_clicked', { source: 'page_cta' });
createAnalyticsEvent('contact_link_clicked', {
  source: 'footer',
  channel: 'email',
});
createAnalyticsEvent('quote_file_upload_succeeded', { fileCount: 2 });
