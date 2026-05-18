export function formatPrice(cents?: number | null, currency = 'USD') {
    if (cents === null || cents === undefined) {
        return 'TBD';
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(cents / 100);
}

export function accessLabel(access: string) {
    return access
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

export function accessTone(access: string) {
    if (access.includes('pro')) {
        return 'violet';
    }

    if (access.includes('licensed')) {
        return 'gold';
    }

    if (access.includes('base')) {
        return 'blue';
    }

    return 'green';
}
