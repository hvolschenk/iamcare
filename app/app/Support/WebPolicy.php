<?php

namespace App\Support;

use Spatie\Csp\Directive;
use Spatie\Csp\Policies\Basic;

class WebPolicy extends Basic
{
    public function configure()
    {
        parent::configure();

        $this
            ->addDirective(Directive::CONNECT, ['https://accounts.google.com/gsi/'])
            ->addDirective(Directive::FONT, ['https://fonts.gstatic.com'])
            ->addDirective(Directive::FRAME, ['https://accounts.google.com/gsi/'])
            ->addDirective(Directive::IMG, ['https://*.googleusercontent.com'])
            ->addDirective(Directive::SCRIPT, [
                'https://accounts.google.com/gsi/client',
                'https://unpkg.com/htmx.org@2.0.2',
            ])
            ->addDirective(Directive::STYLE, [
                'https://accounts.google.com/gsi/style',
                'https://fonts.googleapis.com',
            ])
            ->addNonceForDirective(Directive::STYLE);
    }
}
