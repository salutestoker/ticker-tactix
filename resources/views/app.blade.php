<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    @php
        $seoTitle = 'Ticker-Tactix';
        $seoDescription = 'Trade with structure not emotion. A rules-based market operating system for traders who value structure over signals.';
        $seoSiteName = 'Ticker-Tactix';
        $seoCanonicalUrl = request()->fullUrl();
        $seoImageUrl = url('/design/assets/images/open-graph/ticker-tactix-2026--compressed.jpg');
        $seoImageAlt = 'Ticker-Tactix hero artwork with the headline Trade with Structure Not Emotion.';
        $googleAnalyticsMeasurementId = config('services.google_analytics.measurement_id');
    @endphp
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="{{ $seoDescription }}">

        <title inertia>{{ $seoTitle }}</title>
        <link rel="canonical" href="{{ $seoCanonicalUrl }}">

        <meta property="og:type" content="website">
        <meta property="og:site_name" content="{{ $seoSiteName }}">
        <meta property="og:title" content="{{ $seoTitle }}">
        <meta property="og:description" content="{{ $seoDescription }}">
        <meta property="og:url" content="{{ $seoCanonicalUrl }}">
        <meta property="og:image" content="{{ $seoImageUrl }}">
        <meta property="og:image:secure_url" content="{{ $seoImageUrl }}">
        <meta property="og:image:type" content="image/png">
        <meta property="og:image:width" content="3024">
        <meta property="og:image:height" content="1722">
        <meta property="og:image:alt" content="{{ $seoImageAlt }}">

        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $seoTitle }}">
        <meta name="twitter:description" content="{{ $seoDescription }}">
        <meta name="twitter:image" content="{{ $seoImageUrl }}">
        <meta name="twitter:image:alt" content="{{ $seoImageAlt }}">

        <link rel="icon" type="image/png" href="/design/assets/favicons/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/design/assets/favicons/favicon.svg" />
        <link rel="shortcut icon" href="/design/assets/favicons/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/design/assets/favicons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Ticker-Tactix" />
        <link rel="manifest" href="/design/assets/favicons/site.webmanifest" />

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=orbitron:400,500,600,700|source-code-pro:400,500,600,700&display=swap" rel="stylesheet" />

        @if (filled($googleAnalyticsMeasurementId))
            <!-- Google tag (gtag.js) -->
            <script async src="https://www.googletagmanager.com/gtag/js?id={{ urlencode($googleAnalyticsMeasurementId) }}"></script>
            <script>
                window.dataLayer = window.dataLayer || [];
                window.googleAnalyticsMeasurementId = {{ Illuminate\Support\Js::from($googleAnalyticsMeasurementId) }};
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', window.googleAnalyticsMeasurementId, {
                    send_page_view: false,
                });
            </script>
        @endif

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
