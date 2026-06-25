<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Ticker-Tactix support request</title>
</head>
<body style="margin: 0; padding: 0; background-color: #020831;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; margin: 0; padding: 24px 12px; background-color: #020831; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <tr>
            <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; max-width: 570px; background-color: #ffffff; border: 1px solid #e8e5ef;">
                    <tr>
                        <td style="padding: 32px; color: #26313d;">
                            <h1 style="margin: 0 0 18px; font-size: 20px; line-height: 1.35; color: #26313d;">
                                Support Request
                            </h1>

                            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e3e9f4; color: #657181; font-size: 13px;">Full name used at checkout</td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e3e9f4; color: #26313d; font-size: 14px; text-align: right;">{{ $data['checkout_name'] }}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e3e9f4; color: #657181; font-size: 13px;">Subscription email address</td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e3e9f4; color: #26313d; font-size: 14px; text-align: right;">{{ $data['subscription_email'] }}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e3e9f4; color: #657181; font-size: 13px;">TradingView username</td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e3e9f4; color: #26313d; font-size: 14px; text-align: right;">{{ $data['tradingview_username'] }}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e3e9f4; color: #657181; font-size: 13px;">Date of subscription</td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e3e9f4; color: #26313d; font-size: 14px; text-align: right;">{{ $data['subscription_date'] }}</td>
                                </tr>
                            </table>

                            <h2 style="margin: 24px 0 10px; font-size: 15px; color: #26313d;">
                                Issue
                            </h2>
                            <div style="padding: 16px; background-color: #f5f7fb; border: 1px solid #e3e9f4; color: #26313d; font-size: 15px; line-height: 1.6;">
                                {!! nl2br(e($data['issue'])) !!}
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
