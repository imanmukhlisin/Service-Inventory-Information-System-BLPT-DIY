<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Login;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthorizerController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $login = Login::with('user')->where('username', $request->username)->first();

        if (!$login || !Hash::check($request->password, $login->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials',
                'debug_found' => $login !== null,
                'debug_req_user' => "'" . $request->username . "'",
                'debug_req_pass' => "'" . $request->password . "'",
                'debug_db_pass' => $login ? $login->password : 'none',
                'debug_hash_check' => $login ? Hash::check($request->password, $login->password) : false,
            ], 401);
        }

        if ($login->user->status->value !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'User is inactive',
            ], 403);
        }

        Auth::login($login);
        $request->session()->regenerate();

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'token' => 'SPA-cookie-session',
                'role' => $login->user->role->value,
                'user' => $login->user,
            ],
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'message' => 'Data berhasil diambil',
            'data' => $request->user()->load('user'),
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);
    }
}
