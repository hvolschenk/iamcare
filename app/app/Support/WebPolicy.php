<?php

namespace App\Support;

use Spatie\Csp\Directive;
use Spatie\Csp\Scheme;
use Spatie\Csp\Policies\Basic;

class WebPolicy extends Basic
{
    public function configure()
    {
        parent::configure();

        $this
            ->addDirective(Directive::CONNECT, [
                'https://accounts.google.com/gsi/',
                'https://maps.googleapis.com',
                'https://places.googleapis.com',
            ])
            ->addDirective(Directive::FONT, ['https://fonts.gstatic.com'])
            ->addDirective(Directive::FRAME, ['https://accounts.google.com/gsi/'])
            ->addDirective(Directive::IMG, [
                Scheme::BLOB,
                'https://*.googleusercontent.com',
                'https://maps.gstatic.com',
            ])
            ->addDirective(Directive::SCRIPT, [
                'https://accounts.google.com/gsi/client',
                'https://unpkg.com/htmx.org@2.0.4',
            ])
            ->addDirective(Directive::STYLE, [
                'https://accounts.google.com/gsi/style',
                'https://fonts.googleapis.com',
            ])
            ->addNonceForDirective(Directive::STYLE);
    }
}
