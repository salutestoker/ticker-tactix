type YoutubeEmbedProps = {
    url?: string | null;
    title?: string;
    className?: string;
};

export function YoutubeEmbed({ url, title, className = '' }: YoutubeEmbedProps) {
    const videoId = getYoutubeVideoId(url);

    if (! videoId) {
        return null;
    }

    return (
        <section
            className={`border-main-blue/35 bg-panel-deep overflow-hidden rounded-[14px] border shadow-[0_0_42px_rgba(55,100,245,0.18)] ${className}`}
        >
            <div className="aspect-video w-full">
                <iframe
                    className="h-full w-full"
                    src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
                    title={title ?? 'YouTube video'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    loading="lazy"
                />
            </div>
        </section>
    );
}

export function getYoutubeVideoId(url?: string | null): string | null {
    const value = url?.trim();

    if (! value) {
        return null;
    }

    let parsed: URL;

    try {
        parsed = new URL(value);
    } catch {
        return null;
    }

    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
    const pathSegments = parsed.pathname.split('/').filter(Boolean);

    if (host === 'youtu.be') {
        return validVideoId(pathSegments[0]);
    }

    if (! isYoutubeHost(host)) {
        return null;
    }

    const watchId = parsed.searchParams.get('v');

    if (validVideoId(watchId)) {
        return watchId;
    }

    if (['embed', 'shorts', 'live', 'v'].includes(pathSegments[0] ?? '')) {
        return validVideoId(pathSegments[1]);
    }

    return null;
}

function isYoutubeHost(host: string): boolean {
    return (
        host === 'youtube.com' ||
        host.endsWith('.youtube.com') ||
        host === 'youtube-nocookie.com' ||
        host.endsWith('.youtube-nocookie.com')
    );
}

function validVideoId(value?: string | null): string | null {
    if (! value) {
        return null;
    }

    return /^[A-Za-z0-9_-]{6,32}$/.test(value) ? value : null;
}
