<?php

namespace App\Enums;

enum AuthenticationProvider: string
{
    case Facebook = 'facebook';
    case Google = 'google';
}
