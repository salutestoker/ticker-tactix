export type AccessValue =
    | 'Invite-Only Indicator + Discord'
    | 'Daily Newsletter + Discord'
    | 'Partner Community Access'
    | 'Alerts + Guided Discord';

export interface User {
    id: number;
    name: string;
    email?: string | null;
    email_verified_at?: string;
    discord_id?: string | null;
    discord_username?: string | null;
    discord_global_name?: string | null;
    discord_avatar?: string | null;
    is_admin: boolean;
    created_at?: string | null;
}

export interface Market {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    color?: string | null;
    sort_order: number;
    is_active: boolean;
    modules_count?: number;
    playbooks_count?: number;
}

export interface TraderType {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    color?: string | null;
    icon?: string | null;
    sort_order: number;
    is_active: boolean;
    modules_count?: number;
    playbooks_count?: number;
    modules?: Module[];
    playbooks?: Playbook[];
}

export interface ModuleFeature {
    label: string;
    description?: string | null;
    icon?: string | null;
    tone?: string | null;
}

export interface Module {
    id: number;
    market_id: number;
    icon?: string | null;
    image_path?: string | null;
    image_url?: string | null;
    banner_image?: string | null;
    banner_image_url?: string | null;
    title: string;
    slug: string;
    description?: string | null;
    purpose?: string | null;
    layer?: string | null;
    key_output?: string | null;
    trading_pace?: string | null;
    short_name?: string | null;
    price?: string | null;
    module_overview?: string | null;
    core_features?: ModuleFeature[] | null;
    customization_options?: string[] | null;
    best_used_for?: string[] | null;
    summary?: string | null;
    version?: number | string | null;
    access: AccessValue;
    action_url?: string | null;
    sort_order: number;
    is_featured: boolean;
    is_active: boolean;
    published_at?: string | null;
    meta_title?: string | null;
    meta_description?: string | null;
    market?: Market | null;
    trader_types?: TraderType[];
    traderTypes?: TraderType[];
    related_modules?: Module[];
    relatedModules?: Module[];
}

export interface Playbook {
    id: number;
    market_id: number;
    icon?: string | null;
    logo_path?: string | null;
    logo_url?: string | null;
    banner_image?: string | null;
    banner_image_url?: string | null;
    title: string;
    slug: string;
    access: AccessValue;
    best_for?: string | null;
    long_description?: string | null;
    trading_pace?: string | null;
    average_hold_time?: string | null;
    price?: string | null;
    action_url?: string | null;
    sort_order: number;
    is_featured: boolean;
    is_active: boolean;
    published_at?: string | null;
    meta_title?: string | null;
    meta_description?: string | null;
    market?: Market | null;
    trader_types?: TraderType[];
    traderTypes?: TraderType[];
}

export interface SelectOption {
    label: string;
    value: string;
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
        warning?: string | null;
        info?: string | null;
    };
    traderFitTraderTypes?: TraderType[];
};
