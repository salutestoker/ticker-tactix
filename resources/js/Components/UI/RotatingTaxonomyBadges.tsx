import { TaxonomyBadge } from '@/Components/UI/Hud';
import type { TraderType } from '@/types';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

gsap.registerPlugin(useGSAP);

export function RotatingTaxonomyBadges({
    types,
    className = '',
}: {
    types: TraderType[];
    className?: string;
}) {
    const scope = useRef<HTMLDivElement>(null);
    const dependencyKey = types.map((type) => type.id).join('-');
    const timingSeed = types.reduce(
        (total, type, index) => total + type.id * (index + 1),
        0,
    );

    useGSAP(
        () => {
            const items = gsap.utils.toArray<HTMLElement>(
                '[data-taxonomy-rotator-item]',
            );

            if (items.length <= 1) {
                gsap.set(items, { opacity: 1 });
                return;
            }

            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                gsap.set(items, { opacity: 0 });
                gsap.set(items[0], { opacity: 1 });
                return;
            }

            gsap.set(items, { opacity: 0 });
            gsap.set(items[0], { opacity: 1 });

            const holdDuration = 2.0 + (timingSeed % 5) * 0.16;
            const fadeDuration = 0.55 + (timingSeed % 3) * 0.06;
            const initialDelay = (timingSeed % 7) * 0.2;

            const timeline = gsap.timeline({
                repeat: -1,
                defaults: { ease: 'sine.inOut' },
                delay: initialDelay,
            });

            items.forEach((item, index) => {
                const nextItem = items[(index + 1) % items.length];
                const swapLabel = `swap-${index}`;

                timeline
                    .addLabel(swapLabel, `+=${holdDuration}`)
                    .to(
                        nextItem,
                        { opacity: 1, duration: fadeDuration },
                        swapLabel,
                    )
                    .to(
                        item,
                        { opacity: 0, duration: fadeDuration },
                        swapLabel,
                    );
            });

            return () => timeline.kill();
        },
        {
            dependencies: [dependencyKey, timingSeed],
            scope,
            revertOnUpdate: true,
        },
    );

    if (!types.length) {
        return <span className="text-white/45">—</span>;
    }

    return (
        <div
            ref={scope}
            className={`relative flex min-h-8 min-w-40 items-center justify-center ${className}`}
        >
            {types.map((type) => (
                <span
                    key={type.id}
                    data-taxonomy-rotator-item
                    className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
                >
                    <TaxonomyBadge label={type.name} color={type.color} />
                </span>
            ))}
        </div>
    );
}
