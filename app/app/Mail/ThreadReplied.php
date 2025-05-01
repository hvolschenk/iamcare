<?php

namespace App\Mail;

use App\Models\Thread;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ThreadReplied extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(protected Thread $thread) {
        //
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: __('mail.thread-replied__title')
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $thread = $this->thread;
        $item = $thread->item;
        $message = $thread->messages[count($thread->messages) - 1];
        $user = $item->user;
        return new Content(
            text: 'emails.thread.replied',
            with: [
                'fromName' => $message->user->name,
                'itemName' => $item->name,
                'messageText' => $message->message,
                'name' => $user->name,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
