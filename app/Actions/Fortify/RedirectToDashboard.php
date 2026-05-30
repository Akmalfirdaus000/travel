<?php

namespace App\Actions\Fortify;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class RedirectToDashboard implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  Request  $request
     * @return RedirectResponse
     */
    public function toResponse($request)
    {
        $user = $request->user();

        return match ($user->role) {
            'pelanggan' => redirect()->route('pelanggan.dashboard'),
            'admin' => redirect()->route('admin.dashboard'),
            'super_admin' => redirect()->route('admin.dashboard'),
            default => redirect()->route('home'),
        };
    }
}
