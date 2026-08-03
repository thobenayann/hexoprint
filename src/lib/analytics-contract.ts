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

export type ExactAnalyticsProperties<
  Shape,
  Actual extends Shape,
> = Actual & Record<Exclude<keyof Actual, keyof Shape>, never>;

export function createAnalyticsEvent<
  Name extends AnalyticsEventName,
  Data extends AnalyticsEventMap[NoInfer<Name>],
>(
  name: Name,
  data: ExactAnalyticsProperties<AnalyticsEventMap[NoInfer<Name>], Data>
) {
  return { name, data } as const;
}
