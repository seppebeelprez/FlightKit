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
            $flightId = $request->input('flightId');
            $departure = $request->input('departure');
            $arrival = $request->input('arrival');


            //Check if flight is already in database
            $exists = DB::table('flights')
                ->where('airline', $airline)
                ->where('number', $number)
                ->where('day', $date)
                ->where('flightId', $flightId)
                ->where('departure', $departure)
                ->where('arrival', $arrival)
                ->first();

            //If no, create new flight
            if ( $exists == null ) {

                $flight = Flight::create(array(
                    'airline'   => $airline,
                    'number'    => $number,
                    'day'       => $date,
                    'flightId'  => $flightId,
                    'departure'  => $departure,
                    'arrival'  => $arrival,
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

    /**
     * Delete flight
     *
     * @param \Illuminate\Http\Response
     */
    public function destroy($flight_id){

        $user_id = Auth::id();

        $deleteFlight = DB::table('flight_user')
          ->where('flight_id', $flight_id)
          ->where('user_id', $user_id);

        $deleteFlight->delete();

        $pivotFlights = DB::table('flight_user')->where('flight_id', $flight_id)->get();

//        return $pivotFlights;

        //CHECK IF PIVOT TABLE STILL CONTAINS FLIGHTS
        if ($pivotFlights == NULL) {

            //DELETE RECORD ALSO FROM TABLE FLIGHTS
            $getFlight = DB::table('flights')->where('id', $flight_id);
            $getFlight->delete();
        }

    }

    /**
     * Delete outdated flight
     *
     * @param \Illuminate\Http\Response
     */
    public function deleteOutdated($flight_id){

        $pivotOutdatedFlights = DB::table('flight_user')
          ->where('flight_id', $flight_id)->get();
        

        foreach ($pivotOutdatedFlights as $pivotOutdatedFlight)
        {
            $flight = DB::table('flight_user')->where('flight_id', $pivotOutdatedFlight->flight_id);
            $flight->delete();
        }

        $outdatedFlight = DB::table('flights')->where('id', $flight_id);
        $outdatedFlight->delete();
        

    }
}
