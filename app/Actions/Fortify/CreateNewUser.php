<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use App\Models\Pelanggan;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ])->validate();

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
        ]);

        // Otomatis daftarkan user baru sebagai pelanggan dengan data awal kosong jika belum diinput
        Pelanggan::create([
            'user_id' => $user->id,
            'no_telp' => $input['no_telp'] ?? '-',
            'alamat' => $input['alamat'] ?? '-',
            'jenis_kelamin' => $input['jenis_kelamin'] ?? 'L',
        ]);

        return $user;
    }
}
