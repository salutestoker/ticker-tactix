import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {
    Bold,
    Eraser,
    Heading2,
    Heading3,
    Italic,
    Link as LinkIcon,
    Link2Off,
    List,
    ListOrdered,
    Quote,
    Redo2,
    Underline,
    Undo2,
} from 'lucide-react';
import { useEffect, type ComponentType, type SVGProps } from 'react';

type RichTextEditorProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
};

type ToolbarButtonProps = {
    label: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    active?: boolean;
    disabled?: boolean;
    onClick: () => void;
};

export function RichTextEditor({
    value,
    onChange,
    placeholder,
}: RichTextEditorProps) {
    const editor = useEditor(
        {
            extensions: [
                StarterKit.configure({
                    code: false,
                    codeBlock: false,
                    heading: {
                        levels: [2, 3],
                    },
                    horizontalRule: false,
                    link: {
                        autolink: true,
                        defaultProtocol: 'https',
                        openOnClick: false,
                        HTMLAttributes: {
                            rel: 'noopener noreferrer nofollow',
                            target: '_blank',
                        },
                    },
                }),
                Placeholder.configure({
                    placeholder,
                }),
            ],
            content: toEditorHtml(value),
            editorProps: {
                attributes: {
                    class: 'min-h-40 px-4 py-3 text-sm leading-7 text-white/82 outline-none',
                },
            },
            immediatelyRender: false,
            onUpdate: ({ editor }) => onChange(editor.getHTML()),
        },
        [placeholder],
    );

    useEffect(() => {
        if (! editor) {
            return;
        }

        const nextValue = toEditorHtml(value);

        if (nextValue !== editor.getHTML()) {
            editor.commands.setContent(nextValue, { emitUpdate: false });
        }
    }, [editor, value]);

    return (
        <div className="border-main-blue/35 bg-panel-deep mt-2 rounded-sm border transition focus-within:border-seafoam-green">
            <div className="border-main-blue/20 flex flex-wrap gap-1 border-b px-2 py-2">
                <ToolbarButton
                    label="Bold"
                    icon={Bold}
                    active={editor?.isActive('bold')}
                    disabled={! editor}
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                />
                <ToolbarButton
                    label="Italic"
                    icon={Italic}
                    active={editor?.isActive('italic')}
                    disabled={! editor}
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                />
                <ToolbarButton
                    label="Underline"
                    icon={Underline}
                    active={editor?.isActive('underline')}
                    disabled={! editor}
                    onClick={() =>
                        editor?.chain().focus().toggleUnderline().run()
                    }
                />
                <ToolbarDivider />
                <ToolbarButton
                    label="Heading 2"
                    icon={Heading2}
                    active={editor?.isActive('heading', { level: 2 })}
                    disabled={! editor}
                    onClick={() =>
                        editor
                            ?.chain()
                            .focus()
                            .toggleHeading({ level: 2 })
                            .run()
                    }
                />
                <ToolbarButton
                    label="Heading 3"
                    icon={Heading3}
                    active={editor?.isActive('heading', { level: 3 })}
                    disabled={! editor}
                    onClick={() =>
                        editor
                            ?.chain()
                            .focus()
                            .toggleHeading({ level: 3 })
                            .run()
                    }
                />
                <ToolbarButton
                    label="Bullet list"
                    icon={List}
                    active={editor?.isActive('bulletList')}
                    disabled={! editor}
                    onClick={() =>
                        editor?.chain().focus().toggleBulletList().run()
                    }
                />
                <ToolbarButton
                    label="Ordered list"
                    icon={ListOrdered}
                    active={editor?.isActive('orderedList')}
                    disabled={! editor}
                    onClick={() =>
                        editor?.chain().focus().toggleOrderedList().run()
                    }
                />
                <ToolbarButton
                    label="Blockquote"
                    icon={Quote}
                    active={editor?.isActive('blockquote')}
                    disabled={! editor}
                    onClick={() =>
                        editor?.chain().focus().toggleBlockquote().run()
                    }
                />
                <ToolbarDivider />
                <ToolbarButton
                    label="Link"
                    icon={LinkIcon}
                    active={editor?.isActive('link')}
                    disabled={! editor}
                    onClick={() => setLink(editor)}
                />
                <ToolbarButton
                    label="Remove link"
                    icon={Link2Off}
                    disabled={! editor || ! editor.isActive('link')}
                    onClick={() => editor?.chain().focus().unsetLink().run()}
                />
                <ToolbarButton
                    label="Clear formatting"
                    icon={Eraser}
                    disabled={! editor}
                    onClick={() =>
                        editor
                            ?.chain()
                            .focus()
                            .unsetAllMarks()
                            .clearNodes()
                            .run()
                    }
                />
                <ToolbarDivider />
                <ToolbarButton
                    label="Undo"
                    icon={Undo2}
                    disabled={! editor?.can().undo()}
                    onClick={() => editor?.chain().focus().undo().run()}
                />
                <ToolbarButton
                    label="Redo"
                    icon={Redo2}
                    disabled={! editor?.can().redo()}
                    onClick={() => editor?.chain().focus().redo().run()}
                />
            </div>
            <EditorContent
                editor={editor}
                className="[&_.ProseMirror-placeholder:first-child::before]:pointer-events-none [&_.ProseMirror-placeholder:first-child::before]:float-left [&_.ProseMirror-placeholder:first-child::before]:h-0 [&_.ProseMirror-placeholder:first-child::before]:text-white/35 [&_.ProseMirror-placeholder:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_a]:text-seafoam-green [&_.ProseMirror_a]:underline [&_.ProseMirror_blockquote]:border-l-2 [&_.ProseMirror_blockquote]:border-violet-light/55 [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_h2]:font-heading [&_.ProseMirror_h2]:text-base [&_.ProseMirror_h2]:tracking-[0.08em] [&_.ProseMirror_h2]:text-white [&_.ProseMirror_h2]:uppercase [&_.ProseMirror_h3]:font-heading [&_.ProseMirror_h3]:text-sm [&_.ProseMirror_h3]:tracking-[0.08em] [&_.ProseMirror_h3]:text-white/90 [&_.ProseMirror_h3]:uppercase [&_.ProseMirror_li]:ml-4 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_p]:my-2 [&_.ProseMirror_strong]:text-white [&_.ProseMirror_ul]:list-disc"
            />
        </div>
    );
}

function ToolbarButton({
    label,
    icon: Icon,
    active = false,
    disabled = false,
    onClick,
}: ToolbarButtonProps) {
    return (
        <button
            type="button"
            title={label}
            aria-label={label}
            disabled={disabled}
            className={`inline-flex size-9 items-center justify-center rounded-sm border transition focus-visible:ring-2 focus-visible:ring-seafoam-green/60 focus-visible:outline-none ${
                active
                    ? 'border-seafoam-green/70 bg-seafoam-green/15 text-seafoam-green'
                    : 'border-transparent text-white/65 hover:border-main-blue/40 hover:bg-main-blue/10 hover:text-white disabled:text-white/25'
            }`}
            onClick={onClick}
        >
            <Icon className="size-4" aria-hidden />
        </button>
    );
}

function ToolbarDivider() {
    return <span className="bg-main-blue/25 mx-1 my-1 w-px" aria-hidden />;
}

function setLink(editor: Editor | null) {
    if (! editor) {
        return;
    }

    const previousHref = editor.getAttributes('link').href;
    const input = window.prompt(
        'Link URL',
        typeof previousHref === 'string' ? previousHref : '',
    );

    if (input === null) {
        return;
    }

    const href = normalizeLinkHref(input);

    if (href === '') {
        editor.chain().focus().unsetLink().run();

        return;
    }

    if (href === null) {
        window.alert('Use an http, https, or mailto link.');

        return;
    }

    editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({
            href,
            rel: 'noopener noreferrer nofollow',
            target: '_blank',
        })
        .run();
}

function normalizeLinkHref(value: string) {
    const trimmed = value.trim();

    if (trimmed === '') {
        return '';
    }

    if (/^(https?:|mailto:)/i.test(trimmed)) {
        return trimmed;
    }

    if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
        return null;
    }

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        return `mailto:${trimmed}`;
    }

    return `https://${trimmed}`;
}

function toEditorHtml(value: string) {
    const trimmed = value.trim();

    if (trimmed === '') {
        return '';
    }

    if (/<[a-z][\s\S]*>/i.test(trimmed)) {
        return trimmed;
    }

    return trimmed
        .split(/\r\n|\r|\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
        .map(
            (paragraph) =>
                `<p>${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`,
        )
        .join('');
}

function escapeHtml(value: string) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
