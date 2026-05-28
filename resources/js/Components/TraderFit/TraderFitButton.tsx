import { HudButton } from '@/Components/UI/Hud';
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

import { useTraderFitModal } from './TraderFitProvider';

type TraderFitButtonProps = PropsWithChildren<
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>
> & {
    className?: string;
};

export default function TraderFitButton({
    children = 'What type of trader are you?',
    className = '',
    onClick,
    ...props
}: TraderFitButtonProps) {
    const { openTraderFitModal } = useTraderFitModal();

    return (
        <HudButton
            className={className}
            onClick={(event) => {
                onClick?.(event);

                if (!event.defaultPrevented) {
                    openTraderFitModal();
                }
            }}
            type="button"
            variant="solid"
            {...props}
        >
            {children}
        </HudButton>
    );
}
