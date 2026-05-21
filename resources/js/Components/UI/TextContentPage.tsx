import { Eyebrow, GradientHeading, HudPanel } from '@/Components/UI/Hud';
import { PublicHeroFrame } from '@/Components/UI/PublicHero';

type TextContentPageProps = {
    eyebrow?: string;
    title: string;
    html: string;
};

export function TextContentPage({
    eyebrow = 'Legal',
    title,
    html,
}: TextContentPageProps) {
    return (
        <PublicHeroFrame className="px-4 pt-32 pb-20 sm:px-6">
            <div className="mx-auto max-w-3xl">
                <Eyebrow>{eyebrow}</Eyebrow>
                <GradientHeading className="text-center">
                    {title}
                </GradientHeading>
                <HudPanel className="mt-10 p-6 text-left sm:p-9">
                    <div
                        className="[&_a]:text-seafoam-green [&_h5]:font-heading space-y-5 text-sm leading-7 text-white/72 sm:text-base sm:leading-8 [&_a]:underline [&_br]:leading-8 [&_h5]:mt-9 [&_h5]:mb-3 [&_h5]:text-sm [&_h5]:leading-6 [&_h5]:tracking-[0.12em] [&_h5]:text-white/90 [&_h5]:uppercase [&_h5:first-child]:mt-0 [&_li]:mt-2 [&_p]:m-0 [&_strong]:text-white/90 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6"
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                </HudPanel>
            </div>
        </PublicHeroFrame>
    );
}
