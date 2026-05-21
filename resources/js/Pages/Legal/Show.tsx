import { TextContentPage } from '@/Components/UI/TextContentPage';
import PublicLayout from '@/Layouts/PublicLayout';
import { getLegalPage } from '@/data/legalPages';
import { Head } from '@inertiajs/react';

export default function LegalShow({
    title,
    slug,
}: {
    title: string;
    slug: string;
}) {
    const page = getLegalPage(slug);
    const pageTitle = page?.title ?? title;

    return (
        <PublicLayout>
            <Head title={pageTitle} />
            <TextContentPage
                title={pageTitle}
                html={
                    page?.html ??
                    `<p>This page is reserved for final ${pageTitle.toLowerCase()} content.</p>`
                }
            />
        </PublicLayout>
    );
}
