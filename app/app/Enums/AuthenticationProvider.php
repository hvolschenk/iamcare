<?php

namespace App\Enums;

enum AuthenticationProvider: string
{
    case Google = 'google';
    case Microsoft = 'microsoft';
}
