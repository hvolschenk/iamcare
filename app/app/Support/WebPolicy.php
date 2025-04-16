<?php

namespace App\Support;

use Spatie\Csp\Directive;
use Spatie\Csp\Keyword;
use Spatie\Csp\Scheme;
use Spatie\Csp\Policy;
use Spatie\Csp\Preset;

class WebPolicy implements Preset
{
    public function configure(Policy $policy): void
    {
        $policy
            ->add(Directive::CONNECT, [
                Keyword::SELF,
                'https://*.analytics.google.com',
                'https://*.google-analytics.com',
                'https://*.googletagmanager.com',
                'https://accounts.google.com/gsi/',
                'https://maps.googleapis.com',
                'https://places.googleapis.com',
            ])
            ->add(Directive::FONT, [Keyword::SELF, 'https://fonts.gstatic.com'])
            ->add(Directive::FRAME, [Keyword::SELF, 'https://accounts.google.com/gsi/'])
            ->add(Directive::IMG, [
                Keyword::SELF,
                Scheme::BLOB,
                'https://*.google-analytics.com',
                'https://*.googletagmanager.com',
                'https://*.googleusercontent.com',
                'https://maps.gstatic.com',
            ])
            ->add(Directive::SCRIPT, [
                Keyword::SELF,
                'https://*.googletagmanager.com',
                'https://accounts.google.com/gsi/client',
                'https://unpkg.com/htmx.org@2.0.4',
            ])
            ->add(Directive::STYLE, [
                Keyword::SELF,
                'https://accounts.google.com/gsi/style',
                'https://fonts.googleapis.com',
            ])
            ->addNonce(Directive::STYLE)
            ->addNonce(Directive::SCRIPT);
    }
}
