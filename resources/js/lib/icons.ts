import { tickerTactixIcons, type TickerTactixIconName } from '@/Design/Icons';
import { Rabbit } from '@/Design/Icons/rabbit';
import type { ComponentType, SVGProps } from 'react';

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export const iconRegistry = {
    ...tickerTactixIcons,
    bunny: Rabbit,
} as const satisfies Record<string, IconComponent>;

export type IconName = keyof typeof iconRegistry;

export const iconOptions = Object.keys(iconRegistry)
    .sort()
    .map((name) => ({
        label: name
            .split('-')
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' '),
        value: name,
    }));

export function isIconName(name?: string | null): name is IconName {
    return Boolean(name && name in iconRegistry);
}

export type LegacyTickerTactixIconName = TickerTactixIconName;
