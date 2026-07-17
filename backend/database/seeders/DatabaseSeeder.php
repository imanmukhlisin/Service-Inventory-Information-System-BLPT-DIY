<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\Login;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['nama_user' => 'Administrator'],
            [
                'role' => UserRole::Admin,
                'status' => UserStatus::Active,
            ]
        );

        Login::updateOrCreate(
            ['username' => 'admin_dev'],
            [
                'user_id' => $admin->id,
                'password' => Hash::make('password_dev_123'),
            ]
        );
    }
}
