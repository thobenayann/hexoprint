import 'server-only';

import { track } from '@vercel/analytics/server';
import {
  createAnalyticsEvent,
  type AnalyticsEventMap,
  type AnalyticsEventName,
} from './analytics-contract';

export async function trackServerEvent<Name extends AnalyticsEventName>(
  name: Name,
  data: AnalyticsEventMap[Name]
) {
  const event = createAnalyticsEvent(name, data);
  await track(event.name, event.data);
}
