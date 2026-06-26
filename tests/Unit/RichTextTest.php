<?php

namespace Tests\Unit;

use App\Support\RichText;
use Tests\TestCase;

class RichTextTest extends TestCase
{
    public function test_it_sanitizes_rich_text_to_the_allowed_formatting_set(): void
    {
        $html = RichText::sanitize(
            '<div><h2>Setup</h2><p>Use <strong>structure</strong><script>alert(1)</script><a href="javascript:alert(1)" onclick="bad()">bad link</a><a href="https://example.com" onclick="bad()">safe link</a></p></div>',
        );

        $this->assertIsString($html);
        $this->assertStringContainsString('<h2>Setup</h2>', $html);
        $this->assertStringContainsString('<strong>structure</strong>', $html);
        $this->assertStringContainsString('<a>bad link</a>', $html);
        $this->assertStringContainsString('<a href="https://example.com">safe link</a>', $html);
        $this->assertStringNotContainsString('script', $html);
        $this->assertStringNotContainsString('alert(1)', $html);
        $this->assertStringNotContainsString('onclick', $html);
        $this->assertStringNotContainsString('javascript:', $html);
    }

    public function test_it_treats_empty_editor_html_as_blank(): void
    {
        $this->assertNull(RichText::sanitize('<p></p>'));
        $this->assertNull(RichText::sanitize('<p><br></p>'));
        $this->assertTrue(RichText::isBlank('<p>&nbsp;</p>'));
    }

    public function test_it_renders_legacy_plain_text_as_safe_html(): void
    {
        $html = RichText::render("Open Discord.\nRequest access for 2 < 3 setups.")->toHtml();

        $this->assertStringContainsString('<p>Open Discord.<br>', $html);
        $this->assertStringContainsString('Request access for 2 &lt; 3 setups.</p>', $html);
    }
}
