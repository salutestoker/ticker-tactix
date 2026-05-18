<?php

namespace App\Enums;

enum AccessLevel: string
{
    case InviteOnlyIndicatorDiscord = 'Invite-Only Indicator + Discord';
    case DailyNewsletterDiscord = 'Daily Newsletter + Discord';
    case PartnerCommunityAccess = 'Partner Community Access';
    case AlertsGuidedDiscord = 'Alerts + Guided Discord';

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * @return list<array{label: string, value: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $access): array => [
                'label' => $access->value,
                'value' => $access->value,
            ],
            self::cases(),
        );
    }
}
