import { tickerTactixIcons, type TickerTactixIconName } from '@/Design/Icons';
import { CommandCube } from '@/Design/Icons/command-cube';

interface Props {
    name?: string | null;
    className?: string;
}

export function IconRenderer({ name, className = 'h-6 w-6' }: Props) {
    const Icon =
        name && name in tickerTactixIcons
            ? tickerTactixIcons[name as TickerTactixIconName]
            : CommandCube;

    return <Icon className={className} aria-hidden="true" />;
}
