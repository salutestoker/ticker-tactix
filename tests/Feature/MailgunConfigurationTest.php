<?php

namespace Tests\Feature;

use Closure;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Env;
use ReflectionProperty;
use Tests\TestCase;

class MailgunConfigurationTest extends TestCase
{
    public function test_mail_from_address_env_value_overrides_mailgun_domain_fallback(): void
    {
        $config = $this->mailConfigWithEnv([
            'MAIL_FROM_ADDRESS' => 'tickertactix@ticker-tactix.com',
            'MAIL_FROM_PREFIX' => 'noreply',
            'MAILGUN_DOMAIN' => 'ticker-tactix.com',
        ]);

        $this->assertSame('tickertactix@ticker-tactix.com', $config['from']['address']);
    }

    public function test_mail_from_address_falls_back_to_prefix_at_mailgun_domain(): void
    {
        $config = $this->mailConfigWithEnv([
            'MAIL_FROM_ADDRESS' => '',
            'MAIL_FROM_PREFIX' => 'postmaster',
            'MAILGUN_DOMAIN' => 'ticker-tactix.com',
        ]);

        $this->assertSame('postmaster@ticker-tactix.com', $config['from']['address']);
    }

    public function test_mailgun_diagnostic_reports_masked_ready_configuration(): void
    {
        config([
            'mail.default' => 'mailgun',
            'mail.from.address' => 'tickertactix@ticker-tactix.com',
            'services.mailgun.domain' => 'ticker-tactix.com',
            'services.mailgun.endpoint' => 'api.mailgun.net',
            'services.mailgun.secret' => 'secret-test-key',
        ]);

        $this->withoutMockingConsoleOutput();

        $this->assertSame(0, $this->artisan('mailgun:diagnose'));

        $output = $this->app[Kernel::class]->output();

        $this->assertStringContainsString('services.mailgun.secret', $output);
        $this->assertStringContainsString('present', $output);
        $this->assertStringNotContainsString('secret-test-key', $output);
        $this->assertStringContainsString('Mailgun configuration looks ready for a production send.', $output);
    }

    public function test_mailgun_diagnostic_fails_for_unsafe_configuration(): void
    {
        config([
            'mail.default' => 'array',
            'mail.from.address' => 'tickertactix@example.com',
            'services.mailgun.domain' => 'ticker-tactix.com',
            'services.mailgun.endpoint' => 'https://api.mailgun.net',
            'services.mailgun.secret' => '',
        ]);

        $this->withoutMockingConsoleOutput();

        $this->assertSame(1, $this->artisan('mailgun:diagnose'));

        $output = $this->app[Kernel::class]->output();

        $this->assertStringContainsString('missing', $output);
        $this->assertStringContainsString('MAIL_MAILER should be set to mailgun before production sends.', $output);
        $this->assertStringContainsString('MAILGUN_SECRET is missing.', $output);
        $this->assertStringContainsString('MAILGUN_ENDPOINT should be a host only', $output);
        $this->assertStringContainsString('MAIL_FROM_ADDRESS should use the MAILGUN_DOMAIN host', $output);
    }

    /**
     * @param  array<string, string>  $values
     * @return array<string, mixed>
     */
    private function mailConfigWithEnv(array $values): array
    {
        return $this->withEnv($values, fn (): array => require base_path('config/mail.php'));
    }

    /**
     * @template TValue
     *
     * @param  array<string, string>  $values
     * @param  Closure(): TValue  $callback
     * @return TValue
     */
    private function withEnv(array $values, Closure $callback): mixed
    {
        $original = [];

        foreach ($values as $key => $value) {
            $original[$key] = [
                'getenv' => getenv($key),
                '_ENV' => $_ENV[$key] ?? null,
                '_ENV_exists' => array_key_exists($key, $_ENV),
                '_SERVER' => $_SERVER[$key] ?? null,
                '_SERVER_exists' => array_key_exists($key, $_SERVER),
            ];

            putenv("{$key}={$value}");
            $_ENV[$key] = $value;
            $_SERVER[$key] = $value;
        }

        $this->resetEnvRepository();

        try {
            return $callback();
        } finally {
            foreach ($original as $key => $state) {
                if ($state['getenv'] === false) {
                    putenv($key);
                } else {
                    putenv("{$key}={$state['getenv']}");
                }

                if ($state['_ENV_exists']) {
                    $_ENV[$key] = $state['_ENV'];
                } else {
                    unset($_ENV[$key]);
                }

                if ($state['_SERVER_exists']) {
                    $_SERVER[$key] = $state['_SERVER'];
                } else {
                    unset($_SERVER[$key]);
                }
            }

            $this->resetEnvRepository();
        }
    }

    private function resetEnvRepository(): void
    {
        $repository = new ReflectionProperty(Env::class, 'repository');
        $repository->setValue(null, null);
    }
}
