export const brandColorOptions = [
    {
        label: 'Brand Violet',
        value: 'violet-light',
        textClass: 'text-violet-light',
        borderClass: 'border-violet-light/55',
        backgroundClass: 'bg-violet-light/10',
        glowClass: 'shadow-[0_0_24px_rgba(181,67,215,0.18)]',
    },
    {
        label: 'Brand Seafoam Green',
        value: 'seafoam-green',
        textClass: 'text-seafoam-green',
        borderClass: 'border-seafoam-green/55',
        backgroundClass: 'bg-seafoam-green/10',
        glowClass: 'shadow-[0_0_24px_rgba(0,250,146,0.18)]',
    },
    {
        label: 'Brand Gold',
        value: 'gold',
        textClass: 'text-gold',
        borderClass: 'border-gold/55',
        backgroundClass: 'bg-gold/10',
        glowClass: 'shadow-[0_0_24px_rgba(243,191,56,0.18)]',
    },
    {
        label: 'Brand Blue',
        value: 'main-blue',
        textClass: 'text-sky-300',
        borderClass: 'border-main-blue/55',
        backgroundClass: 'bg-main-blue/10',
        glowClass: 'shadow-[0_0_24px_rgba(55,100,245,0.18)]',
    },
] as const;

export type BrandColor = (typeof brandColorOptions)[number]['value'];

export function brandColor(color?: string | null) {
    return (
        brandColorOptions.find((option) => option.value === color) ??
        brandColorOptions[3]
    );
}
