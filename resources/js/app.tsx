import '../css/app.css';

import {
    createInertiaApp,
    router,
    type ResolvedComponent,
} from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Ticker Tactix';
const defaultPageTitle = 'Ticker-Tactix';
const pages = import.meta.glob('./Pages/**/*.tsx') as Record<
    string,
    () => Promise<{ default: ResolvedComponent }>
>;

function trackGoogleAnalyticsPageView(url: string) {
    if (
        !window.googleAnalyticsMeasurementId ||
        typeof window.gtag !== 'function'
    ) {
        return;
    }

    const pageUrl = new URL(url, window.location.origin);

    window.gtag('config', window.googleAnalyticsMeasurementId, {
        page_location: pageUrl.href,
        page_path: `${pageUrl.pathname}${pageUrl.search}${pageUrl.hash}`,
        page_title: document.title,
    });
}

createInertiaApp({
    title: (title) =>
        title === defaultPageTitle ? defaultPageTitle : `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent<{ default: ResolvedComponent }>(
            `./Pages/${name}.tsx`,
            pages,
        ).then((page) => page.default),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                {/*<PageLoader />*/}
                <App {...props} />
            </>,
        );

        trackGoogleAnalyticsPageView(window.location.href);

        router.on('navigate', (event) => {
            window.requestAnimationFrame(() => {
                trackGoogleAnalyticsPageView(event.detail.page.url);
            });
        });
    },
    progress: {
        color: '#00fa92',
    },
});
