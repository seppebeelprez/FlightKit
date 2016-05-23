<?php

namespace App\Http\Controllers\Api;

use App\Trip;
use App\Http\Requests;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\User;
use Illuminate\Support\Facades\Response;
use GuzzleHttp\Client;

class TripsController extends Controller
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
     * Show all trips.
     *
     * @return \Illuminate\Http\Response
     * @Request
     */
    public function index()
    {
        if (Auth::check())
        {
            $user = Auth::id();
            $trips = User::with('trips')->where('id', $user)->get();

            return $trips;
        }
        else
        {
            return redirect('/login');
        }
    }

    /**
     * Show all trips, admin.
     *
     * @return \Illuminate\Http\Response
     * @Request
     */
    public function admin()
    {
        $trips = DB::table('trips')->get();
        return [ 'trips' => $trips ];
    }

    /**
     * Show detail trip
     *
     * @param $airport
     */
    public function show($airport){
        if (Auth::check())
        {

            $appID = env('FLIGHT_APPID');
            $appKEY = env('FLIGHT_APPKEY');
            $weatherKey = env('WEATHER_KEY');


            $dbtrip = DB::table('trips')
              ->where('airport', $airport)->get();

            if($dbtrip) {

                $tripAirport = $dbtrip[0]->airport;

                $clientTripApi = new Client();
                $responseTripApi = $clientTripApi
                  ->get('https://api.flightstats.com/flex/airports/rest/v1/json/iata/'
                    .$tripAirport.'?appId='.$appID.'&appKey='.$appKEY.'')->getBody();

                $tripCity = json_decode($responseTripApi)->airports[0]->city;

                $clientWeather = new Client();
                $responseWeather = $clientWeather
                  ->get('http://api.openweathermap.org/data/2.5/weather?q='.$tripCity.'&appid='.$weatherKey.'')->getBody();


                $clientForecast = new Client();
                $responseForecast = $clientForecast
                  ->get('http://api.openweathermap.org/data/2.5/forecast/daily?q='.$tripCity.'&appid='.$weatherKey.'')->getBody();

                return [
                  'dbtrip' => $dbtrip[0],
                  'apitrip' => json_decode($responseTripApi)->airports[0],
                  'apiweather' => json_decode($responseWeather),
                  'apiforecast' => json_decode($responseForecast)
                ];
                
            }else {
                return redirect('/trips');
            }
        }
        else
        {
            return redirect('/login');
        }
    }

    /**
     * Create a new trip
     *
     * @param Request $request
     */
    public function store(Request $request)
    {
        if (Auth::check())
        {
            $user_id = Auth::id();

            $airport = $request->input('airport');

            //Check if trip is already in database
            $exists = DB::table('trips')
              ->where('airport', $airport)
              ->first();

            //If no, create new flight
            if ( $exists == null ) {

                $trip = Trip::create(array(
                  'airport'   => $airport
                ));

                //Save flight before updating the pivot table
                $trip->save();

                //Attach the flight id with the user id in the pivot table
                $trip->users()->attach($user_id);
            }

            //If yes, attach the flight id with the user id in the pivot table
            else {
                //Check if this user already added this flights
                //If yes, show notification | If no, attach id to user id in pivot table
                $user = Auth::user();
                $user->trips()->attach($exists->id);
            }
        }else{
            return redirect('/login');
        }
    }

    /**
     * Delete trip
     *
     * @param \Illuminate\Http\Response
     */
    public function destroy($trip_id){
        $user_id = Auth::id();

        $deleteTrip = DB::table('trip_user')
          ->where('trip_id', $trip_id)
          ->where('user_id', $user_id);

        $deleteTrip->delete();

        $pivotTrips = DB::table('trip_user')->where('trip_id', $trip_id)->get();
        
        //CHECK IF PIVOT TABLE STILL CONTAINS FLIGHTS
        if ($pivotTrips == NULL) {

            //DELETE RECORD ALSO FROM TABLE FLIGHTS
            $getTrip = DB::table('trips')->where('id', $trip_id);
            $getTrip->delete();
        }
    }

    /**
     * Hard Delete flight
     *
     * @param \Illuminate\Http\Response
     */
    public function harddelete($trip_id){

        $deleteTrip = DB::table('trips')
          ->where('id', $trip_id);

        $deleteTrip->delete();
    }
}
