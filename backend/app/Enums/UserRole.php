<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'admin';
    case FrontOffice = 'front_office';
    case Koperasi = 'koperasi';
    case KepalaUPJ = 'kepala_upj';
}
