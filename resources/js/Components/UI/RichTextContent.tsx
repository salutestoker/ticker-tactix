type RichTextContentProps = {
    html?: string | null;
    className?: string;
    compact?: boolean;
};

export function RichTextContent({
    html,
    className = '',
    compact = false,
}: RichTextContentProps) {
    if (! hasContent(html)) {
        return null;
    }

    return (
        <div
            className={`${compact ? compactRichTextClass : richTextClass} ${className}`}
            dangerouslySetInnerHTML={{ __html: html ?? '' }}
        />
    );
}

const richTextClass =
    '[&_a]:text-seafoam-green space-y-4 text-white/78 [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-violet-light/50 [&_blockquote]:pl-4 [&_h2]:font-heading [&_h2]:text-base [&_h2]:tracking-[0.1em] [&_h2]:text-white [&_h2]:uppercase [&_h3]:font-heading [&_h3]:text-sm [&_h3]:tracking-[0.1em] [&_h3]:text-white/90 [&_h3]:uppercase [&_li]:mt-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:m-0 [&_strong]:text-white [&_ul]:list-disc [&_ul]:pl-5';

const compactRichTextClass =
    '[&_a]:text-seafoam-green text-white/75 [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-violet-light/50 [&_blockquote]:pl-3 [&_h2]:font-heading [&_h2]:text-sm [&_h2]:tracking-[0.08em] [&_h2]:text-white [&_h2]:uppercase [&_h3]:font-heading [&_h3]:text-xs [&_h3]:tracking-[0.08em] [&_h3]:text-white/90 [&_h3]:uppercase [&_li]:mt-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:m-0 [&_p+p]:mt-2 [&_strong]:text-white [&_ul]:list-disc [&_ul]:pl-5';

function hasContent(value?: string | null) {
    if (! value) {
        return false;
    }

    const text = value.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();

    return text !== '';
}
