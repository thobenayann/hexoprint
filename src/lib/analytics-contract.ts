export type AnalyticsEventMap = {
  quote_cta_clicked: {
    source: 'desktop_navigation' | 'mobile_navigation' | 'page_cta';
  };
  contact_link_clicked: {
    source: 'footer' | 'contact_page';
    channel: 'phone' | 'email';
  };
  contact_form_submitted: {
    customerType: 'particulier' | 'professionnel';
    hasFiles: boolean;
  };
  quote_file_upload_succeeded: {
    fileCount: number;
  };
};

export type AnalyticsEventName = keyof AnalyticsEventMap;

export function createAnalyticsEvent<Name extends AnalyticsEventName>(
  name: Name,
  data: AnalyticsEventMap[Name]
) {
  return { name, data } as const;
}
