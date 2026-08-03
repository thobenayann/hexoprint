'use client';

import { track } from '@vercel/analytics';
import {
  createAnalyticsEvent,
  type AnalyticsEventMap,
  type AnalyticsEventName,
} from './analytics-contract';

export function trackClientEvent<Name extends AnalyticsEventName>(
  name: Name,
  data: AnalyticsEventMap[Name]
) {
  const event = createAnalyticsEvent(name, data);
  track(event.name, event.data);
}
