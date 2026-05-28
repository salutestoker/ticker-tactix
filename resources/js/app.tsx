import '../css/app.css';

import { createInertiaApp, type ResolvedComponent } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Ticker Tactix';
const defaultPageTitle = 'Ticker-Tactix';
const pages = import.meta.glob('./Pages/**/*.tsx') as Record<
    string,
    () => Promise<{ default: ResolvedComponent }>
>;

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
    },
    progress: {
        color: '#00fa92',
    },
});
