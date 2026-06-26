@php
    $subject = $catalogItem->purchase_email_subject ?: 'Welcome to '.$catalogItem->title;
    $customerName = $event->customer_name ?: 'there';
    $accessInstructionsHtml = $accessInstructions instanceof \Illuminate\Contracts\Support\Htmlable
        ? trim($accessInstructions->toHtml())
        : trim((string) $accessInstructions);
@endphp
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="color-scheme" content="dark">
    <meta name="supported-color-schemes" content="dark">
    <title>{{ $subject }}</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=orbitron:500,600,700|source-code-pro:400,500&display=swap" rel="stylesheet">
    <style>
        body,
        table,
        td,
        p,
        a {
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
        }

        table {
            border-collapse: collapse;
            mso-table-lspace: 0;
            mso-table-rspace: 0;
        }

        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }

        .email-rich-text p {
            margin: 0 0 14px;
            color: #d9e2ff;
            font-family: Corbel, "Segoe UI", Arial, sans-serif;
            font-size: 14px;
            line-height: 1.6;
        }

        .email-rich-text p:last-child {
            margin-bottom: 0;
        }

        .email-rich-text h2,
        .email-rich-text h3 {
            margin: 18px 0 10px;
            color: #ffffff;
            font-family: Orbitron, "Segoe UI", Arial, sans-serif;
            font-size: 14px;
            font-weight: 600;
            letter-spacing: 0.08em;
            line-height: 1.35;
            text-transform: uppercase;
        }

        .email-rich-text ul,
        .email-rich-text ol {
            margin: 0 0 16px 22px;
            padding: 0;
            color: #d9e2ff;
            font-family: Corbel, "Segoe UI", Arial, sans-serif;
            font-size: 14px;
            line-height: 1.6;
        }

        .email-rich-text li {
            margin: 0 0 8px;
        }

        .email-rich-text a {
            color: #00fa92;
            text-decoration: underline;
        }

        .email-rich-text blockquote {
            margin: 0 0 16px;
            padding: 0 0 0 14px;
            border-left: 2px solid #3764f5;
            color: #b8c3ff;
            font-family: "Source Code Pro", Consolas, monospace;
            font-size: 14px;
            line-height: 1.6;
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #010929;">
    <span style="display: none; max-height: 0; overflow: hidden; opacity: 0;">
        Your Ticker-Tactix subscription onboarding is ready.
    </span>

    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; margin: 0; padding: 0; background-color: #010929; font-family: Corbel, 'Segoe UI', Arial, sans-serif;">
        <tr>
            <td align="center" style="padding: 128px 16px 14px; background-color: #010929; background-image: url(https://ticker-tactix.com/design/assets/images/bg-hero.jpg); background-size: cover; background-position: bottom;">
                <a href="{{ route('home') }}" target="_blank" style="display: inline-block; text-decoration: none;">
                    <img src="https://ticker-tactix.com/design/assets/images/logo-ticker-tactix-2026--smaller.png" alt="Ticker-Tactix homepage" width="176" style="display: block; width: 176px; max-width: 176px; height: auto;">
                </a>
            </td>
        </tr>

        <tr>
            <td align="center" style="padding: 0 14px 18px;">
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; max-width: 650px; margin: 0 auto; background-color: #050b2f; border-radius: 8px;">
                    <tr>
                        <td style="padding: 0;">
                            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                                <tr>
                                    <td width="100%" style="height: 3px; background-color: #6c42be; opacity: .2; font-size: 0; line-height: 0;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 34px 30px 30px; color: #ffffff;">
                            <p style="margin: 0 0 12px; color: #00fa92; font-family: Orbitron, 'Segoe UI', Arial, sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.24em; line-height: 1.3; text-align: left; text-transform: uppercase;">
                                Subscription Confirmed
                            </p>

                            <h1 style="margin: 0 0 38px; color: #ffffff; font-family: Orbitron, 'Segoe UI', Arial, sans-serif; font-size: 22px; letter-spacing: 0.06em; line-height: 1.15; text-align: left; text-transform: uppercase;">
                                You've subscribed to the {{ $catalogItem->title }}
                            </h1>

                            <p style="margin: 0 0 16px; color: #d9e2ff; font-size: 14px; line-height: 1.6; text-align: left;">
                                Hi {{ $customerName }},
                            </p>

                            <p style="margin: 0 0 22px; color: #d9e2ff; font-size: 14px; line-height: 1.6; text-align: left;">
                                Your payment was received successfully and the onboarding has started. Use the welcome video and action links below while the team verifies your subscription access.
                            </p>

                            <p style="margin: 0 0 34px; color: #d9e2ff; font-size: 14px; line-height: 1.6; text-align: left;">
                                Regards,<br>
                                Ticker-Tactix
                            </p>

                            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; margin: 0 0 22px; background-color: #030720; border: 1px solid #f3bf38; border-style: solid; border-radius: 6px;">
                                <tr>
                                    <td style="padding: 20px 20px 18px;">
                                        <h2 style="margin: 0 0 12px; color: #ffffff; font-family: Orbitron, 'Segoe UI', Arial, sans-serif; font-size: 17px; font-weight: 600; letter-spacing: 0.1em; line-height: 1.35; text-align: left; text-transform: uppercase;">
                                            Please Allow Time for Verification
                                        </h2>
                                        <p style="margin: 0; color: #d9e2ff; font-size: 14px; line-height: 1.6; text-align: left;">
                                            Access is not granted instantly. Verification times may vary depending on timing, payment review needs, and member volume.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            @if ($welcomeVideoUrl && $welcomeVideoThumbnailUrl)
                                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; margin: 0 0 24px;">
                                    <tr>
                                        <td style="padding: 10px 10px 0;">
                                            <a href="{{ $welcomeVideoUrl }}" target="_blank" style="display: block; text-decoration: none;">
                                                <img src="{{ $welcomeVideoThumbnailUrl }}" alt="Watch the Ticker-Tactix welcome video" width="608" style="display: block; width: 100%; max-width: 608px; height: auto; border-radius: 4px;">
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" style="padding: 16px 16px 18px;">
                                            <a href="{{ $welcomeVideoUrl }}" target="_blank" style="box-sizing: border-box; display: inline-block; min-width: 220px; padding: 14px 20px; background-color: #00fa92; border: 1px solid #00fa92; border-style: solid; border-radius: 3px; color: #010929; font-family: Orbitron, 'Segoe UI', Arial, sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.14em; line-height: 1.2; text-align: center; text-decoration: none; text-transform: uppercase;">
                                                Watch Welcome Video
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            @endif

                            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; margin: 0 0 26px;">
                                <tr>
                                    <td style="padding: 0; text-align: center;">
                                        <a href="{{ $productUrl }}" target="_blank" style="box-sizing: border-box; display: inline-block; margin: 0 8px 10px 0; padding: 12px 16px; background-color: #00fa92; border: 1px solid #00fa92; border-style: solid; border-radius: 3px; color: #010929; font-family: Orbitron, 'Segoe UI', Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; line-height: 1.2; text-align: center; text-decoration: none; text-transform: uppercase;">
                                            View Product
                                        </a>
                                        @if ($youtubeVideoUrl)
                                            <a href="{{ $youtubeVideoUrl }}" target="_blank" style="box-sizing: border-box; display: inline-block; margin: 0 8px 10px 0; padding: 12px 16px; background-color: #8172ff; border: 1px solid #8172ff; border-style: solid; border-radius: 3px; color: #ffffff; font-family: Orbitron, 'Segoe UI', Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; line-height: 1.2; text-align: center; text-decoration: none; text-transform: uppercase;">
                                                Product Overview Video
                                            </a>
                                        @endif
                                        <a href="https://discord.gg/HEkSTdxWjW" target="_blank" style="box-sizing: border-box; display: inline-block; margin: 0 0 10px; padding: 12px 16px; background-color: #0b1954; border: 1px solid #3764f5; border-style: solid; border-radius: 3px; color: #ffffff; font-family: Orbitron, 'Segoe UI', Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; line-height: 1.2; text-align: center; text-decoration: none; text-transform: uppercase;">
                                            Join Discord
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            @if ($accessInstructionsHtml !== '')
                                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; margin: 0 0 24px; background-color: #030720; border: 1px solid #3764f5; border-style: solid; border-radius: 6px;">
                                    <tr>
                                        <td style="padding: 20px;">
                                            <h2 style="margin: 0 0 14px; color: #ffffff; font-family: Orbitron, 'Segoe UI', Arial, sans-serif; font-size: 17px; font-weight: 600; letter-spacing: 0.1em; line-height: 1.35; text-align: left; text-transform: uppercase;">
                                                {{ $catalogItem->title }} Specific Information
                                            </h2>
                                            <div class="email-rich-text" style="color: #d9e2ff; font-family: Corbel, 'Segoe UI', Arial, sans-serif; font-size: 14px; line-height: 1.6; text-align: left;">
                                                {!! $accessInstructionsHtml !!}
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            @endif

                            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; margin: 0; border-top: 1px solid #173b82; border-top-style: solid;">
                                <tr>
                                    <td style="padding-top: 22px;">
                                        <p style="margin: 0 0 12px; color: #8fa1d8; font-size: 12px; line-height: 1.6; text-align: center;">
                                            <a target="_blank" href="https://ticker-tactix.com/contact" style="color: #00fa92; text-decoration: underline;">Contact</a>
                                            |
                                            <a target="_blank" href="https://ticker-tactix.com/faq" style="color: #00fa92; text-decoration: underline;">FAQ</a>
                                            @if ($manageUrl)
                                                |
                                            <a href="{{ $manageUrl }}" target="_blank" style="color: #00fa92; text-decoration: underline;">Manage your subscription</a>
                                            @endif
                                        </p>
                                        <p style="margin: 0 0 12px; color: #8fa1d8; font-size: 12px; line-height: 1.6; text-align: center;">
                                            Ticker-Tactix LLC provides educational software tools for financial market analysis. Nothing in this email constitutes financial advice. Trading involves risk and users are responsible for their own decisions.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <tr>
            <td align="center" style="padding: 10px 14px 32px;">
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; max-width: 650px; margin: 0 auto; text-align: center;">
                    <tr>
                        <td align="center">
                            <p style="margin: 0; color: #7e8bbf; font-size: 12px; line-height: 1.5; text-align: center;">
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
