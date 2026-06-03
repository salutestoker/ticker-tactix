import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { route as ziggyRoute } from 'ziggy-js';
import { PageProps as AppPageProps } from './';

declare global {
    /* eslint-disable no-var */
    var route: typeof ziggyRoute;

    interface Window {
        googleAnalyticsMeasurementId?: string;
        gtag?: (
            command: 'config' | 'event' | 'js',
            targetId: string | Date,
            config?: Record<string, unknown>,
        ) => void;
    }
}

declare module '@inertiajs/core' {
    interface PageProps extends InertiaPageProps, AppPageProps {}
}
