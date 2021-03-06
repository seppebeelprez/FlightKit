<?php

namespace App\Http\Controllers\Account;

use App\Http\Requests;
use App\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;

class AccountController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     * @Request
     */
    public function index()
    {
        $check = Auth::user();
        $user = User::find($check->id);
        return view('app', ['user' => $user]);
    }
}
