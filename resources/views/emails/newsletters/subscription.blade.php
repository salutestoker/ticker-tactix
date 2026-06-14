<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <title>{{ $delivery->subject }}</title>
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

        .email-container {
            max-width: 570px;
            width: 100%;
        }

        @media screen and (max-width: 620px) {
            .email-shell {
                padding-right: 12px !important;
                padding-left: 12px !important;
            }

            .email-card-content {
                padding: 24px 20px !important;
            }

            .email-heading {
                font-size: 17px !important;
            }

            .email-copy {
                font-size: 15px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #020831;">
    <span style="display: none; max-height: 0; overflow: hidden; opacity: 0;">
        {{ $delivery->preheader ?: 'Attached is your daily NYSE ETF ENVIRONMENT newsletter.' }}
    </span>

    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; margin: 0; padding: 0; background-color: #020831; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <tr>
            <td align="center" style="padding: 25px 12px 0;">
                <a href="https://ticker-tactix.com" target="_blank" style="display: inline-block; text-decoration: none;">
                    <img src="https://ticker-tactix.com/design/assets/images/logo-ticker-tactix-2026.png" alt="Ticker-Tactix" width="160" style="display: block; width: 160px; max-width: 160px; height: auto; border: 0; outline: none; text-decoration: none;">
                </a>
            </td>
        </tr>

        <tr>
            <td class="email-shell" align="center" style="padding: 0 12px; background-color: #020831;">
                <table class="email-container" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; max-width: 570px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e8e5ef; border-radius: 2px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                    <tr>
                        <td class="email-card-content" style="padding: 32px; color: #3d4852; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                            <h1 class="email-heading" style="margin: 0 0 16px; color: #3d4852; font-size: 18px; font-weight: bold; line-height: 1.4; text-align: left;">
                                Hi {{ $recipient->name ?: 'there' }},
                            </h1>

                            <p class="email-copy" style="margin: 0 0 16px; color: #3d4852; font-size: 16px; line-height: 1.5; text-align: left;">
                                Attached is your daily <strong>NYSE ETF ENVIRONMENT</strong> newsletter.
                            </p>

                            <p class="email-copy" style="margin: 0 0 16px; color: #3d4852; font-size: 16px; line-height: 1.5; text-align: left;">
                                Enjoy the rest of your day!
                            </p>

                            <p class="email-copy" style="margin: 0; color: #3d4852; font-size: 16px; line-height: 1.5; text-align: left;">
                                Regards,<br>
                                Ticker-Tactix
                            </p>

                            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; margin-top: 25px; padding-top: 25px; border-top: 1px solid #e8e5ef;">
                                <tr>
                                    <td style="padding-top: 25px;">
                                        <p style="margin: 0 0 12px; color: #777777; font-size: 12px; line-height: 1.5; text-align: center;">
                                            Ticker-Tactix LLC provides educational software tools for financial market analysis. Nothing on this website constitutes financial advice. Trading involves risk and users are responsible for their own decisions.
                                        </p>

                                        <p style="margin: 0; color: #777777; font-size: 12px; line-height: 1.5; text-align: center;">
                                            <a href="{{ $manageUrl }}" style="color: #020831; text-decoration: underline;">Manage your subscription</a>
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
            <td class="email-shell" align="center" style="padding: 32px 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                <table class="email-container" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; max-width: 570px; margin: 0 auto; text-align: center;">
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
