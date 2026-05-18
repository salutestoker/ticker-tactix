import { CommandCube } from '@/Design/Icons/command-cube';
import { iconRegistry, isIconName } from '@/lib/icons';

interface Props {
    name?: string | null;
    className?: string;
}

export function IconRenderer({ name, className = 'h-6 w-6' }: Props) {
    const Icon = isIconName(name) ? iconRegistry[name] : CommandCube;

    return <Icon className={className} aria-hidden="true" />;
}
