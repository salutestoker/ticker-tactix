export function accessLabel(access: string) {
    return access;
}

export function accessTone(access: string) {
    if (access === 'Alerts + Guided Discord') {
        return 'violet';
    }

    if (access === 'Partner Community Access') {
        return 'gold';
    }

    if (access === 'Daily Newsletter + Discord') {
        return 'blue';
    }

    return 'green';
}

export function formatVersion(version?: number | string | null) {
    if (version === null || version === undefined || version === '') {
        return '—';
    }

    return `v${String(version)
        .replace(/(\.\d*?)0+$/, '$1')
        .replace(/\.$/, '')}`;
}
