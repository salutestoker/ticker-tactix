import { IconRenderer } from '@/Components/Icons/IconRenderer';
import { AccessBadge, TaxonomyBadge } from '@/Components/UI/Hud';
import { formatVersion } from '@/lib/format';
import type { Module } from '@/types';
import { useGSAP } from '@gsap/react';
import { Link } from '@inertiajs/react';
import gsap from 'gsap';
import { forwardRef, useRef } from 'react';

gsap.registerPlugin(useGSAP);

const moduleImageBase = '/design/assets/images/modules';
const autoScrollPixelsPerSecond = 28;
const dragActivationDistance = 8;
const dragDirectionLockDistance = 6;
const dragHorizontalIntentRatio = 0.85;
const dragVelocitySmoothing = 0.48;
const momentumReleaseMultiplier = 1.35;
const maxMomentumPixelsPerSecond = 3800;
const minMomentumPixelsPerSecond = 22;
const momentumDecayPerFrame = 0.955;

const imageSlugs = new Set([
    'crypto-info-box',
    'crypto-info-line',
    'crypto-velocity-stats',
    'info-box',
    'info-line',
    'range-rails',
    'sequence-pressure',
    'trend-tracer',
]);

const bannerSlugs = new Set([
    'crypto-info-box',
    'crypto-info-line',
    'crypto-velocity-stats',
    'info-box',
    'info-line',
    'sequence-pressure',
    'trend-tracer',
    'range-rails',
]);

export function ModuleCardsCarousel({ modules }: { modules: Module[] }) {
    const scope = useRef<HTMLDivElement>(null);
    const viewport = useRef<HTMLDivElement>(null);
    const track = useRef<HTMLDivElement>(null);
    const firstSet = useRef<HTMLDivElement>(null);
    const moduleKey = modules.map((module) => module.id).join('-');

    useGSAP(
        () => {
            const viewportElement = viewport.current;
            const trackElement = track.current;
            const firstSetElement = firstSet.current;

            if (
                !viewportElement ||
                !trackElement ||
                !firstSetElement ||
                modules.length < 2
            ) {
                return;
            }

            let setWidth = firstSetElement.offsetWidth;

            if (!setWidth) {
                return;
            }

            let currentX = -setWidth;

            gsap.set(trackElement, {
                x: currentX,
                force3D: true,
            });

            const reducedMotion = window.matchMedia(
                '(prefers-reduced-motion: reduce)',
            ).matches;

            let hoverPaused = false;
            let manualPaused = false;
            let manualResumeTimeout: number | undefined;
            let resizeFrame: number | undefined;
            let pointerDown = false;
            let dragStarted = false;
            let suppressNextClick = false;
            let dragStartX = 0;
            let dragStartY = 0;
            let dragAxis: 'x' | 'y' | null = null;
            let dragStartTrackX = currentX;
            let dragVelocity = 0;
            let lastPointerX = 0;
            let lastPointerTime = 0;
            let momentumVelocity = 0;
            let activePointerId: number | null = null;

            const wrapTrackX = (value: number) => {
                while (value <= setWidth * -2) {
                    value += setWidth;
                }

                while (value > -setWidth) {
                    value -= setWidth;
                }

                return value;
            };

            const setTrackX = (value: number) => {
                currentX = wrapTrackX(value);
                gsap.set(trackElement, {
                    x: currentX,
                    force3D: true,
                });
            };

            const clampMomentumVelocity = (value: number) => {
                return Math.max(
                    maxMomentumPixelsPerSecond * -1,
                    Math.min(maxMomentumPixelsPerSecond, value),
                );
            };

            const syncSetWidth = () => {
                const nextWidth = firstSetElement.offsetWidth;

                if (!nextWidth) {
                    return;
                }

                setWidth = nextWidth;
                setTrackX(currentX);
            };

            const releaseManualPause = (delay = 700) => {
                window.clearTimeout(manualResumeTimeout);
                manualResumeTimeout = window.setTimeout(() => {
                    manualPaused = false;
                }, delay);
            };

            const releasePointerCapture = (pointerId: number) => {
                if (viewportElement.hasPointerCapture(pointerId)) {
                    viewportElement.releasePointerCapture(pointerId);
                }
            };

            const cancelPointerDrag = (event: PointerEvent) => {
                pointerDown = false;
                activePointerId = null;
                dragStarted = false;
                dragAxis = null;
                dragVelocity = 0;
                viewportElement.classList.remove('cursor-grabbing');
                releasePointerCapture(event.pointerId);
                releaseManualPause(200);
            };

            const isInteractiveTarget = (target: EventTarget | null) => {
                return (
                    target instanceof Element &&
                    Boolean(
                        target.closest(
                            'a, button, input, textarea, select, label, [role="button"]',
                        ),
                    )
                );
            };

            const handlePointerEnter = (event: PointerEvent) => {
                if (event.pointerType === 'mouse') {
                    hoverPaused = true;
                }
            };

            const handlePointerLeave = (event: PointerEvent) => {
                if (event.pointerType === 'mouse') {
                    hoverPaused = false;
                }
            };

            const handlePointerDown = (event: PointerEvent) => {
                if (event.pointerType === 'mouse' && event.button !== 0) {
                    return;
                }

                if (isInteractiveTarget(event.target)) {
                    suppressNextClick = false;
                    return;
                }

                pointerDown = true;
                dragStarted = false;
                manualPaused = true;
                suppressNextClick = false;
                activePointerId = event.pointerId;
                dragStartX = event.clientX;
                dragStartY = event.clientY;
                dragAxis = null;
                dragStartTrackX = currentX;
                dragVelocity = 0;
                lastPointerX = event.clientX;
                lastPointerTime = event.timeStamp;
                momentumVelocity = 0;
                window.clearTimeout(manualResumeTimeout);
                viewportElement.classList.add('cursor-grabbing');

                if (!viewportElement.hasPointerCapture(event.pointerId)) {
                    viewportElement.setPointerCapture(event.pointerId);
                }
            };

            const handlePointerMove = (event: PointerEvent) => {
                if (!pointerDown || activePointerId !== event.pointerId) {
                    return;
                }

                const deltaX = event.clientX - dragStartX;
                const deltaY = event.clientY - dragStartY;
                const absoluteDeltaX = Math.abs(deltaX);
                const absoluteDeltaY = Math.abs(deltaY);

                if (
                    !dragAxis &&
                    Math.max(absoluteDeltaX, absoluteDeltaY) >=
                        dragDirectionLockDistance
                ) {
                    dragAxis =
                        absoluteDeltaX >=
                        absoluteDeltaY * dragHorizontalIntentRatio
                            ? 'x'
                            : 'y';

                    if (dragAxis === 'y') {
                        cancelPointerDrag(event);
                        return;
                    }
                }

                if (dragAxis !== 'x') {
                    return;
                }

                event.preventDefault();

                const elapsedTime = Math.max(
                    16,
                    event.timeStamp - lastPointerTime,
                );
                const pointerDelta = event.clientX - lastPointerX;
                const instantVelocity = (pointerDelta / elapsedTime) * 1000;

                if (Number.isFinite(instantVelocity)) {
                    dragVelocity +=
                        (instantVelocity - dragVelocity) *
                        dragVelocitySmoothing;
                }

                lastPointerX = event.clientX;
                lastPointerTime = event.timeStamp;

                if (!dragStarted && absoluteDeltaX < dragActivationDistance) {
                    return;
                }

                dragStarted = true;
                suppressNextClick = true;
                setTrackX(dragStartTrackX + deltaX);
            };

            const handlePointerUp = (event: PointerEvent) => {
                if (activePointerId !== event.pointerId) {
                    return;
                }

                pointerDown = false;
                activePointerId = null;
                dragAxis = null;
                viewportElement.classList.remove('cursor-grabbing');

                releasePointerCapture(event.pointerId);

                momentumVelocity =
                    dragStarted && !reducedMotion
                        ? clampMomentumVelocity(
                              dragVelocity * momentumReleaseMultiplier,
                          )
                        : 0;
                dragVelocity = 0;

                if (Math.abs(momentumVelocity) >= minMomentumPixelsPerSecond) {
                    manualPaused = true;
                    return;
                }

                momentumVelocity = 0;
                releaseManualPause(dragStarted ? 350 : 200);
            };

            const handleClickCapture = (event: MouseEvent) => {
                if (!suppressNextClick) {
                    return;
                }

                event.preventDefault();
                event.stopPropagation();
                suppressNextClick = false;
            };

            const handleResize = () => {
                window.cancelAnimationFrame(resizeFrame ?? 0);
                resizeFrame = window.requestAnimationFrame(syncSetWidth);
            };

            const tick = (_time: number, deltaTime: number) => {
                if (pointerDown || reducedMotion) {
                    return;
                }

                if (Math.abs(momentumVelocity) >= minMomentumPixelsPerSecond) {
                    setTrackX(currentX + (momentumVelocity * deltaTime) / 1000);
                    momentumVelocity *= Math.pow(
                        momentumDecayPerFrame,
                        deltaTime / 16.6667,
                    );

                    if (
                        Math.abs(momentumVelocity) < minMomentumPixelsPerSecond
                    ) {
                        momentumVelocity = 0;
                        releaseManualPause(180);
                    }

                    return;
                }

                if (hoverPaused || manualPaused) {
                    return;
                }

                setTrackX(
                    currentX - (autoScrollPixelsPerSecond * deltaTime) / 1000,
                );
            };

            setTrackX(currentX);

            const resizeObserver = new ResizeObserver(handleResize);
            resizeObserver.observe(firstSetElement);
            resizeObserver.observe(viewportElement);

            gsap.ticker.add(tick);

            viewportElement.addEventListener(
                'pointerenter',
                handlePointerEnter,
            );
            viewportElement.addEventListener(
                'pointerleave',
                handlePointerLeave,
            );
            viewportElement.addEventListener('pointerdown', handlePointerDown, {
                passive: false,
            });
            viewportElement.addEventListener('pointermove', handlePointerMove, {
                passive: false,
            });
            viewportElement.addEventListener('pointerup', handlePointerUp);
            viewportElement.addEventListener('pointercancel', handlePointerUp);
            viewportElement.addEventListener(
                'lostpointercapture',
                handlePointerUp,
            );
            viewportElement.addEventListener('click', handleClickCapture, true);

            return () => {
                gsap.ticker.remove(tick);
                resizeObserver.disconnect();
                window.cancelAnimationFrame(resizeFrame ?? 0);
                window.clearTimeout(manualResumeTimeout);
                viewportElement.removeEventListener(
                    'pointerenter',
                    handlePointerEnter,
                );
                viewportElement.removeEventListener(
                    'pointerleave',
                    handlePointerLeave,
                );
                viewportElement.removeEventListener(
                    'pointerdown',
                    handlePointerDown,
                );
                viewportElement.removeEventListener(
                    'pointermove',
                    handlePointerMove,
                );
                viewportElement.removeEventListener(
                    'pointerup',
                    handlePointerUp,
                );
                viewportElement.removeEventListener(
                    'pointercancel',
                    handlePointerUp,
                );
                viewportElement.removeEventListener(
                    'lostpointercapture',
                    handlePointerUp,
                );
                viewportElement.removeEventListener(
                    'click',
                    handleClickCapture,
                    true,
                );
            };
        },
        {
            dependencies: [moduleKey, modules.length],
            scope,
            revertOnUpdate: true,
        },
    );

    if (!modules.length) {
        return null;
    }

    return (
        <div
            ref={scope}
            className="relative [margin-right:calc(50%_-_50vw)] [margin-left:calc(50%_-_50vw)] w-screen max-w-none overflow-hidden py-4"
        >
            <div
                ref={viewport}
                aria-label="Drag to browse modules"
                className="w-full max-w-full cursor-grab touch-pan-y overflow-hidden py-10 select-none"
            >
                <div ref={track} className="flex w-max">
                    <ModuleCardSet modules={modules} ariaHidden />
                    <ModuleCardSet ref={firstSet} modules={modules} />
                    <ModuleCardSet modules={modules} ariaHidden />
                </div>
            </div>
        </div>
    );
}

const ModuleCardSet = forwardRef<
    HTMLDivElement,
    {
        modules: Module[];
        ariaHidden?: boolean;
    }
>(({ modules, ariaHidden = false }, ref) => {
    return (
        <div
            ref={ref}
            className="flex shrink-0 gap-5 pr-5"
            aria-hidden={ariaHidden}
        >
            {modules.map((module) => (
                <ModuleCarouselCard
                    key={`${ariaHidden ? 'copy' : 'main'}-${module.id}`}
                    module={module}
                    inert={ariaHidden}
                />
            ))}
        </div>
    );
});

ModuleCardSet.displayName = 'ModuleCardSet';

function ModuleCarouselCard({
    module,
    inert = false,
}: {
    module: Module;
    inert?: boolean;
}) {
    const assetSlug = assetSlugForModule(module);
    const iconSrc = imageSlugs.has(assetSlug)
        ? `${moduleImageBase}/module-icon--${assetSlug}.${assetSlug === 'range-rails' ? 'jpg' : 'png'}`
        : null;
    const bannerSrc = bannerSlugs.has(assetSlug)
        ? `${moduleImageBase}/module-banner--${assetSlug}.jpg`
        : null;

    return (
        <div
            draggable={false}
            tabIndex={inert ? -1 : undefined}
            className="group border-main-blue/45 to-panel-deep hover:border-seafoam-green/70 focus-visible:ring-seafoam-green/70 flex h-[30rem] w-[min(82vw,23.5rem)] shrink-0 cursor-grab flex-col overflow-hidden rounded-[14px] border bg-gradient-to-b from-[#0e1f4b] p-5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_0_24px_rgba(55,100,245,0.16)] transition hover:-translate-y-1 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_0_30px_rgba(0,250,146,0.15)] focus-visible:ring-2 focus-visible:outline-none active:cursor-grabbing"
        >
            <div className="relative flex gap-5">
                <div className="w-2/3 min-w-0">
                    <p className="font-heading text-seafoam-green text-[0.66rem] font-semibold tracking-[0.18em] uppercase">
                        Module
                    </p>
                    <h3 className="font-heading mt-3 mb-3 text-2xl leading-[1.05] font-semibold tracking-[0.01em] text-white">
                        {module.title}&nbsp;
                        <span className="font-heading text-seafoam-green ml-auto text-xs">
                            {formatVersion(module.version)}
                        </span>
                    </h3>
                    <p className="min-w-[260px] text-sm leading-6 text-white">
                        {module.description}
                    </p>
                </div>
                <div className="absolute top-[-25px] right-[-16px] h-24 w-24">
                    {iconSrc ? (
                        <img
                            className="h-full w-full object-contain mix-blend-lighten transition duration-300 group-hover:scale-105"
                            src={iconSrc}
                            alt=""
                            draggable={false}
                            loading="lazy"
                        />
                    ) : (
                        <div className="border-main-blue/45 bg-main-blue/10 text-seafoam-green flex h-18 w-18 items-center justify-center rounded-[14px] border">
                            <IconRenderer
                                name={module.icon}
                                className="h-10 w-10"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 flex gap-3">
                <div>
                    {module.market ? (
                        <TaxonomyBadge
                            label={module.market.name}
                            color={module.market.color}
                        />
                    ) : (
                        <span className="text-white/45">—</span>
                    )}
                </div>
                <AccessBadge access={module.access} showIcon />
            </div>

            <div className="mt-4 flex max-h-30 items-center rounded-lg mix-blend-lighten">
                {bannerSrc ? (
                    <img
                        className="h-full w-full object-cover"
                        src={bannerSrc}
                        alt=""
                        draggable={false}
                        loading="lazy"
                    />
                ) : (
                    <FallbackModuleVisual module={module} />
                )}
            </div>

            <Link
                href={route('modules.show', module.slug)}
                className="text-seafoam-green font-heading mt-auto flex items-center gap-2 pt-4 text-sm font-medium uppercase"
            >
                Explore Module
                <IconRenderer
                    name="chevron-right"
                    className="h-4 w-4 transition group-hover:translate-x-1"
                />
            </Link>
        </div>
    );
}

function FallbackModuleVisual({ module }: { module: Module }) {
    return (
        <div className="from-main-blue/18 via-violet-light/12 to-seafoam-green/12 relative flex h-full min-h-28 w-full items-center overflow-hidden bg-gradient-to-r">
            <div className="absolute inset-x-0 top-1/2 h-px bg-cyan-300/45 shadow-[0_0_20px_rgba(0,213,255,0.45)]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,250,146,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(55,100,245,0.08)_1px,transparent_1px)] bg-[size:28px_28px]" />
            <IconRenderer
                name={module.icon}
                className="text-seafoam-green relative z-10 mx-auto h-16 w-16 opacity-90"
            />
        </div>
    );
}

function assetSlugForModule(module: Module): string {
    if (module.slug === 'crypto-velocity-stats') {
        return 'crypto-velocity-stats';
    }

    return module.slug || module.icon || '';
}
