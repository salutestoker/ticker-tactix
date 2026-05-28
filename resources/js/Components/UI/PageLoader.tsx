import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

const minimumVisibleDuration = 240;
const assetWaitTimeout = 12000;

export default function PageLoader() {
    const [isVisible, setIsVisible] = useState(true);
    const visibleSinceRef = useRef<number>(performance.now());
    const runIdRef = useRef(0);
    const hideTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        const clearHideTimeout = () => {
            if (hideTimeoutRef.current !== null) {
                window.clearTimeout(hideTimeoutRef.current);
                hideTimeoutRef.current = null;
            }
        };

        const showLoader = () => {
            clearHideTimeout();
            visibleSinceRef.current = performance.now();
            setIsVisible(true);
        };

        const hideLoader = () => {
            const elapsed = performance.now() - visibleSinceRef.current;
            const delay = Math.max(0, minimumVisibleDuration - elapsed);

            clearHideTimeout();
            hideTimeoutRef.current = window.setTimeout(() => {
                setIsVisible(false);
                hideTimeoutRef.current = null;
            }, delay);
        };

        const waitForWindowLoad = () => {
            if (document.readyState === 'complete') {
                return Promise.resolve();
            }

            return new Promise<void>((resolve) => {
                window.addEventListener('load', () => resolve(), {
                    once: true,
                });
            });
        };

        const waitForDocumentFonts = () => {
            if (!document.fonts?.ready) {
                return Promise.resolve();
            }

            return document.fonts.ready.catch(() => undefined);
        };

        const getVisibleAssets = () => {
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;

            return Array.from(document.querySelectorAll('img, video'))
                .filter(
                    (element) => !element.closest('[data-page-loader="true"]'),
                )
                .filter((element) => {
                    const rect = element.getBoundingClientRect();
                    const styles = window.getComputedStyle(element);

                    if (
                        styles.display === 'none' ||
                        styles.visibility === 'hidden' ||
                        styles.opacity === '0'
                    ) {
                        return false;
                    }

                    return (
                        rect.width > 0 &&
                        rect.height > 0 &&
                        rect.bottom >= 0 &&
                        rect.right >= 0 &&
                        rect.top <= viewportHeight &&
                        rect.left <= viewportWidth
                    );
                }) as Array<HTMLImageElement | HTMLVideoElement>;
        };

        const waitForVisibleAssets = () => {
            const assets = getVisibleAssets();

            if (!assets.length) {
                return Promise.resolve();
            }

            const pending = assets.flatMap((asset) => {
                if (asset instanceof HTMLImageElement) {
                    if (asset.complete) {
                        return [];
                    }

                    return [
                        new Promise<void>((resolve) => {
                            const finish = () => {
                                asset.removeEventListener('load', finish);
                                asset.removeEventListener('error', finish);
                                resolve();
                            };

                            asset.addEventListener('load', finish, {
                                once: true,
                            });
                            asset.addEventListener('error', finish, {
                                once: true,
                            });
                        }),
                    ];
                }

                if (
                    asset.error ||
                    asset.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA
                ) {
                    return [];
                }

                return [
                    new Promise<void>((resolve) => {
                        const finish = () => {
                            asset.removeEventListener('loadeddata', finish);
                            asset.removeEventListener('canplay', finish);
                            asset.removeEventListener('error', finish);
                            resolve();
                        };

                        asset.addEventListener('loadeddata', finish, {
                            once: true,
                        });
                        asset.addEventListener('canplay', finish, {
                            once: true,
                        });
                        asset.addEventListener('error', finish, {
                            once: true,
                        });
                    }),
                ];
            });

            if (!pending.length) {
                return Promise.resolve();
            }

            return Promise.race([
                Promise.all(pending).then(() => undefined),
                new Promise<void>((resolve) => {
                    window.setTimeout(() => resolve(), assetWaitTimeout);
                }),
            ]);
        };

        const waitForCurrentPage = async () => {
            const runId = ++runIdRef.current;

            await new Promise<void>((resolve) => {
                window.requestAnimationFrame(() => {
                    window.requestAnimationFrame(() => resolve());
                });
            });

            await Promise.all([
                waitForWindowLoad(),
                waitForDocumentFonts(),
                waitForVisibleAssets(),
            ]);

            if (runIdRef.current !== runId) {
                return;
            }

            hideLoader();
        };

        const handleStart = () => {
            showLoader();
            void waitForCurrentPage();
        };

        const handleFinish = () => {
            void waitForCurrentPage();
        };

        const removeStartListener = router.on('start', handleStart);
        const removeFinishListener = router.on('finish', handleFinish);

        showLoader();
        void waitForCurrentPage();

        return () => {
            clearHideTimeout();
            removeStartListener();
            removeFinishListener();
            runIdRef.current += 1;
        };
    }, []);

    return (
        <div
            data-page-loader="true"
            aria-hidden={!isVisible}
            className={`bg-midnight-blue fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-300 ${isVisible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(55,100,245,0.18),transparent_60%)]" />
            <video
                className="border-main-blue-bright relative h-24 w-24 rounded-full border mix-blend-lighten drop-shadow-[0_0_24px_rgba(0,250,146,0.18)]"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                aria-hidden="true"
            >
                <source
                    src="/design/assets/videos/compressed/loading-video.mp4"
                    type="video/mp4"
                />
            </video>
            <div className="font-heading mt-5 text-center text-xs tracking-[0.35em] text-white/70 uppercase">
                loading
            </div>
        </div>
    );
}
