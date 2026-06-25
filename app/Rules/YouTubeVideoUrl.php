<?php

namespace App\Rules;

use App\Support\YouTubeVideo;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

final class YouTubeVideoUrl implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) || YouTubeVideo::videoId($value) === null) {
            $fail('The :attribute must be a valid YouTube video URL.');
        }
    }
}
