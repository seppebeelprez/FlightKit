<?php

namespace App\Http\Controllers\Auth;

use App\User;
use App\Role;
use Validator;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Registration & Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users, as well as the
    | authentication of existing users. By default, this controller uses
    | a simple trait to add these behaviors. Why don't you explore it?
    |
    */

    use AuthenticatesAndRegistersUsers, ThrottlesLogins;

    /**
     * Where to redirect users after login / registration.
     *
     * @var string
     */
    protected $redirectTo = '/';

    /**
     * Create a new authentication controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware($this->guestMiddleware(), ['except' => 'logout']);
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => 'required|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|min:6|confirmed',
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return User
     */
    protected function create(array $data)
    {
        $create =  User::create(array(
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ));

        $user = User::find($create->id);

        $role = Role::where('name', '=', 'user')->firstOrFail();

        $user->roles()->attach($role->id);

        return $create;
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @return User
     */
    protected function createUser()
    {
        // process the form here

        // create the validation rules ------------------------
        $rules = array(
          'name'             => 'required|max:255',                        // just a normal required validation
          'email'            => 'required|email|unique:users',     // required and must be unique in the ducks table
          'password'         => 'required|min:6',
          'password_confirm' => 'same:password|required'           // required and has to match the password field
        );

        // create custom validation messages ------------------
        $messages = array(
          'required' => 'Field :attribute is required.',
          'same'  => 'Fields :others must match.',
          'unique'  => 'This email is already in use.',
        );

        // do the validation ----------------------------------
        // validate against the inputs from our form
        $validator = Validator::make(Input::all(), $rules, $messages);

        // check if the validator failed -----------------------
        if ($validator->fails()) {

            // get the error messages from the validator
            $messages = $validator->messages();

            // redirect our user back to the form with the errors from the validator
            return Redirect::to('register')
              ->withErrors($validator)
              ->withInput();

        } else {

            $create =  User::create(array(
              'name' => Input::get('name'),
              'email' => Input::get('email'),
              'password' => Hash::make(Input::get('password'))
            ));

            $user = User::find($create->id);

            $role = Role::where('name', '=', 'user')->firstOrFail();

            $user->roles()->attach($role->id);

            $credentials = array(
              'email' => Input::get('email'),
              'password' => Input::get('password')
            );

            if (Auth::attempt($credentials)) {
                return Redirect::to('/');
            }
        }
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @return User
     */
    protected function loginUser()
    {
        // process the form here

        // create the validation rules ------------------------
        $rules = array(
          'email'            => 'required|email|exists:users,email',     // required and must be unique in the ducks table
          'password'         => 'required'
        );

        // create custom validation messages ------------------
        $messages = array(
          'required' => 'Field :attribute is required.'
        );

        // do the validation ----------------------------------
        // validate against the inputs from our form
        $validator = Validator::make(Input::all(), $rules, $messages);

        // check if the validator failed -----------------------
        if ($validator->fails()) {

            // get the error messages from the validator
            $messages = $validator->messages();

            // redirect our user back to the form with the errors from the validator
            return Redirect::to('login')
              ->withErrors($validator)
              ->withInput();

        } else {
            $credentials = array(
              'email' => Input::get('email'),
              'password' => Input::get('password')
            );

            if (Auth::attempt($credentials)) {
                return Redirect::to('/');
            }else {
                return Redirect::to('login')
                  ->withErrors($validator)
                  ->withInput();
            }
        }
    }
}
