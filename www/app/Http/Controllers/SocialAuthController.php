<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\User;
use App\Role;
use App\Http\Requests;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\SocialAccountService;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    public function redirect()
    {
        return \Socialite::driver('facebook')->redirect();
    }

    public function callback(SocialAccountService $service)
    {
        $user = $service->createOrGetUser(Socialite::driver('facebook')->user());

        $dbUser = User::find($user->id);

        $checkIfRole = DB::table('role_user')
            ->where('user_id', $dbUser->id)->get();

        if($checkIfRole != NULL) {

        } else {
            
            $role = Role::where('name', '=', 'user')->firstOrFail();

            $dbUser->roles()->attach($role->id);
        }

        auth()->login($user);

        return redirect('/');
    }
}
