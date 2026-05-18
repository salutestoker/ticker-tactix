export interface User {
    id: number;
    name: string;
    email?: string | null;
    email_verified_at?: string;
    discord_id?: string | null;
    discord_avatar?: string | null;
    is_admin: boolean;
}

export interface PlaybookCategory {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    icon?: string | null;
    color?: string | null;
    sort_order: number;
    is_active: boolean;
    modules_count?: number;
    playbooks_count?: number;
}

export interface Module {
    id: number;
    playbook_category_id?: number | null;
    icon?: string | null;
    title: string;
    slug: string;
    purpose?: string | null;
    description?: string | null;
    what_it_does?: string | null;
    key_output?: string | null;
    version?: string | null;
    access: string;
    payment_url?: string | null;
    sort_order: number;
    is_featured: boolean;
    is_active: boolean;
    published_at?: string | null;
    meta_title?: string | null;
    meta_description?: string | null;
    category?: PlaybookCategory | null;
}

export interface Playbook {
    id: number;
    playbook_category_id: number;
    framework: string;
    slug: string;
    access: string;
    market?: string | null;
    best_for?: string | null;
    average_hold_time?: string | null;
    price_cents?: number | null;
    currency: string;
    payment_url?: string | null;
    sort_order: number;
    is_featured: boolean;
    is_active: boolean;
    published_at?: string | null;
    meta_title?: string | null;
    meta_description?: string | null;
    category?: PlaybookCategory | null;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User | null;
    };
    flash?: {
        success?: string | null;
        error?: string | null;
    };
};
