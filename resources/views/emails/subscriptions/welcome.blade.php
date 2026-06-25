<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <title>{{ $catalogItem->purchase_email_subject ?: 'Welcome to '.$catalogItem->title }}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #020831;">
    <span style="display: none; max-height: 0; overflow: hidden; opacity: 0;">
        Your Ticker-Tactix subscription access instructions are ready.
    </span>

    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; margin: 0; padding: 0; background-color: #020831; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <tr>
            <td align="center" style="padding: 25px 12px 0;">
                <a href="{{ route('home') }}" target="_blank" style="display: inline-block; text-decoration: none;">
                    <img src="https://ticker-tactix.com/design/assets/images/logo-ticker-tactix-2026.png" alt="Ticker-Tactix" width="160" style="display: block; width: 160px; max-width: 160px; height: auto; border: 0; outline: none; text-decoration: none;">
                </a>
            </td>
        </tr>

        <tr>
            <td align="center" style="padding: 0 12px; background-color: #020831;">
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; max-width: 570px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e8e5ef; border-radius: 2px;">
                    <tr>
                        <td style="padding: 32px; color: #3d4852;">
                            <h1 style="margin: 0 0 16px; color: #3d4852; font-size: 20px; font-weight: bold; line-height: 1.4; text-align: left;">
                                Welcome to {{ $catalogItem->title }}
                            </h1>

                            <p style="margin: 0 0 16px; color: #3d4852; font-size: 16px; line-height: 1.5; text-align: left;">
                                Hi {{ $event->customer_name ?: 'there' }},
                            </p>

                            <p style="margin: 0 0 16px; color: #3d4852; font-size: 16px; line-height: 1.5; text-align: left;">
                                Thanks for subscribing. Your access instructions are below.
                            </p>

                            @if ($youtubeVideoId && $youtubeVideoUrl && $youtubeThumbnailUrl)
                                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; margin: 0 0 20px;">
                                    <tr>
                                        <td style="background-color: #020831; border-radius: 2px; overflow: hidden; text-align: center;">
                                            <a href="{{ $youtubeVideoUrl }}" target="_blank" style="display: block; color: #ffffff; text-decoration: none;">
                                                <img src="{{ $youtubeThumbnailUrl }}" alt="Watch the {{ $catalogItem->title }} welcome video" width="506" style="display: block; width: 100%; max-width: 506px; height: auto; border: 0; outline: none; text-decoration: none;">
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" style="padding-top: 12px;">
                                            <a href="{{ $youtubeVideoUrl }}" target="_blank" style="display: inline-block; padding: 12px 18px; background-color: #020831; color: #ffffff; font-size: 14px; font-weight: bold; line-height: 1; text-decoration: none; border-radius: 2px;">
                                                Watch welcome video
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            @else
                                <div style="margin: 0 0 20px; background-color: #020831;">
                                    <video controls playsinline preload="metadata" width="506" style="display: block; width: 100%; max-width: 506px; height: auto; background-color: #020831;">
                                        <source src="{{ $welcomeVideoUrl }}" type="video/mp4">
                                        <a href="{{ $welcomeVideoUrl }}" target="_blank" style="color: #ffffff;">Watch the welcome video</a>
                                    </video>
                                </div>
                            @endif

                            <div style="margin: 0 0 20px; padding: 18px; background-color: #f5f7fb; border: 1px solid #e3e9f4; color: #26313d; font-size: 16px; line-height: 1.6; text-align: left;">
                                {!! nl2br(e($accessInstructions)) !!}
                            </div>

                            <table cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 0 20px;">
                                <tr>
                                    <td style="border-radius: 2px; background-color: #020831;">
                                        <a href="{{ $productUrl }}" target="_blank" style="display: inline-block; padding: 12px 18px; color: #ffffff; font-size: 14px; font-weight: bold; line-height: 1; text-decoration: none;">
                                            View product
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 0; color: #3d4852; font-size: 16px; line-height: 1.5; text-align: left;">
                                Regards,<br>
                                Ticker-Tactix
                            </p>

                            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; margin-top: 25px; padding-top: 25px; border-top: 1px solid #e8e5ef;">
                                <tr>
                                    <td style="padding-top: 25px;">
                                        <p style="margin: 0 0 12px; color: #777777; font-size: 12px; line-height: 1.5; text-align: center;">
                                            Ticker-Tactix LLC provides educational software tools for financial market analysis. Nothing in this email constitutes financial advice. Trading involves risk and users are responsible for their own decisions.
                                        </p>

                                        @if ($manageUrl)
                                            <p style="margin: 0; color: #777777; font-size: 12px; line-height: 1.5; text-align: center;">
                                                <a href="{{ $manageUrl }}" style="color: #020831; text-decoration: underline;">Manage your subscription</a>
                                            </p>
                                        @endif
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <tr>
            <td align="center" style="padding: 32px 12px;">
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; max-width: 570px; margin: 0 auto; text-align: center;">
                    <tr>
                        <td align="center">
                            <p style="margin: 0; color: #b0adc5; font-size: 12px; line-height: 1.5; text-align: center;">
                                Copyright &copy; 2026 Ticker-Tactix LLC.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
