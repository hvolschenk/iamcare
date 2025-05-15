<?php

namespace App\Support;

use Mazedlx\FeaturePolicy\Directive;
use Mazedlx\FeaturePolicy\Policies\Policy;
use Mazedlx\FeaturePolicy\Value;

class FeaturePolicy extends Policy
{
    public function configure()
    {
        $this
            ->addDirective(Directive::ACCELEROMETER, Value::NONE)
            ->addDirective(Directive::AUTOPLAY, Value::SELF)
            ->addDirective(Directive::BATTERY, Value::SELF)
            ->addDirective(Directive::BLUETOOTH, Value::NONE)
            ->addDirective(Directive::CAMERA, Value::SELF)
            ->addDirective(Directive::DISPLAY_CAPTURE, Value::NONE)
            ->addDirective(Directive::FULLSCREEN, Value::SELF)
            ->addDirective(Directive::GEOLOCATION, Value::SELF)
            ->addDirective(Directive::GYROSCOPE, Value::NONE)
            ->addDirective(Directive::MAGNETOMETER, Value::NONE)
            ->addDirective(Directive::MICROPHONE, Value::NONE)
            ->addDirective(Directive::MIDI, Value::NONE)
            ->addDirective(Directive::NAVIGATION_OVERRIDE, Value::NONE)
            ->addDirective(Directive::PAYMENT, Value::NONE)
            ->addDirective(Directive::SCREEN_WAKE_LOCK, Value::NONE)
            ->addDirective(Directive::SERIAL, Value::NONE)
            ->addDirective(Directive::USB, Value::NONE)
            ->addDirective(Directive::WEB_SHARE, Value::SELF);
    }
}
