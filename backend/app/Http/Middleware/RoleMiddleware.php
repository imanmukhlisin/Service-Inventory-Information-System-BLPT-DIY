<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request based on user roles.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (! $request->user()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // $request->user() returns the Login model (since it is Authenticatable).
        // We need to check the role on the underlying User model.
        $login = $request->user();
        $user = $login->user;

        if (! $user || ! in_array($user->role->value, $roles)) {
            return response()->json(['message' => 'Forbidden Access'], 403);
        }

        return $next($request);
    }
}
