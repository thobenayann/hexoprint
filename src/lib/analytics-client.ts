'use client';

import { track } from '@vercel/analytics';
import {
  createAnalyticsEvent,
  type ExactAnalyticsProperties,
  type AnalyticsEventMap,
  type AnalyticsEventName,
} from './analytics-contract';

export function trackClientEvent<
  Name extends AnalyticsEventName,
  Data extends AnalyticsEventMap[NoInfer<Name>],
>(
  name: Name,
  data: ExactAnalyticsProperties<AnalyticsEventMap[NoInfer<Name>], Data>
) {
  const event = createAnalyticsEvent(name, data);
  track(event.name, event.data);
}
