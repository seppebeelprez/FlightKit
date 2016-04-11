<?php

namespace App\Http\Controllers\Api;

use App\Flight;
use App\Http\Requests;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\User;
use Illuminate\Support\Facades\Response;

class FlightsController extends Controller
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
     * Show all flights.
     *
     * @return \Illuminate\Http\Response
     * @Request
     */
    public function index()
    {
        if (Auth::check())
        {
            $user = Auth::id();
            $flights = User::with('flights')->where('id', $user)->get();

            return $flights;
        }
        else
        {
            return redirect('/login');
        }
    }

    /**
     * Show detail flight
     *
     * @param $id
     */
    public function show($id){

    }

    /**
     * Create a new flight
     *
     * @param Request $request
     */
    public function store(Request $request)
    {
        if (Auth::check())
        {
            $user_id = Auth::id();

            $airline = $request->input('airline');
            $number = $request->input('number');
            $date = $request->input('day');


            //Check if flight is already in database
            $exists = DB::table('flights')
                ->where('airline', $airline)
                ->where('number', $number)
                ->where('day', $date)
                ->first();

            //If no, create new flight
            if ( $exists == null ) {

                $flight = Flight::create(array(
                    'airline'   => $airline,
                    'number'    => $number,
                    'day'       => $date,
                ));

                //Save flight before updating the pivot table
                $flight->save();

                //Attach the flight id with the user id in the pivot table
                $flight->users()->attach($user_id);
            }

            //If yes, attach the flight id with the user id in the pivot table
            else {
                //Check if this user already added this flights
                //If yes, show notification | If no, attach id to user id in pivot table
                $user = Auth::user();
                $user->flights()->attach($exists->id);
                //$exists = $user->flights->containt
            }
        }else{
            return redirect('/login');
        }
    }
}
