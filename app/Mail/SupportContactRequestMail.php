<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SupportContactRequestMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @param  array{
     *     checkout_name: string,
     *     subscription_email: string,
     *     tradingview_username: string,
     *     subscription_date: string,
     *     issue: string
     * }  $data
     */
    public function __construct(public readonly array $data) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Ticker-Tactix support request from '.$this->data['checkout_name'],
            replyTo: [$this->data['subscription_email']],
            tags: ['support-contact'],
            metadata: [
                'subscription_email' => $this->data['subscription_email'],
                'tradingview_username' => $this->data['tradingview_username'],
            ],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.support.contact-request',
            with: [
                'data' => $this->data,
            ],
        );
    }
}
