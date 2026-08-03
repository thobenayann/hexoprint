import 'server-only';

import { track } from '@vercel/analytics/server';
import {
  createAnalyticsEvent,
  type ExactAnalyticsProperties,
  type AnalyticsEventMap,
  type AnalyticsEventName,
} from './analytics-contract';

export async function trackServerEvent<
  Name extends AnalyticsEventName,
  Data extends AnalyticsEventMap[NoInfer<Name>],
>(
  name: Name,
  data: ExactAnalyticsProperties<AnalyticsEventMap[NoInfer<Name>], Data>
) {
  const event = createAnalyticsEvent(name, data);
  await track(event.name, event.data);
}
