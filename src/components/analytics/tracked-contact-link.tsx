'use client';

import { trackClientEvent } from '@/lib/analytics-client';
import type { ComponentPropsWithoutRef } from 'react';

type TrackedContactLinkProps = ComponentPropsWithoutRef<'a'> & {
    channel: 'phone' | 'email';
    source: 'footer' | 'contact_page';
};

export function TrackedContactLink({
    channel,
    source,
    onClick,
    ...props
}: TrackedContactLinkProps) {
    return (
        <a
            {...props}
            onClick={(event) => {
                trackClientEvent('contact_link_clicked', { channel, source });
                onClick?.(event);
            }}
        />
    );
}
