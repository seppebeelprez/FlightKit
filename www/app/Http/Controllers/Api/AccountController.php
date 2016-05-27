<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Auth;
use App\User;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Hash;

class AccountController extends Controller
{
    /**
     * This user.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = Auth::user();

        return [
            'user' => $user,
        ];
    }

    /**
     * All users.
     *
     * @return \Illuminate\Http\Response
     */
    public function users()
    {
        $users = DB::table('users')->get();

        foreach ($users as $user)
        {
            $id = $user->id;
            $usr = User::find($id);
            $user->flights = $usr->flights()->get();
            $user->trips = $usr->trips()->get();
        }

        return [ 'users' => $users ];
    }

    /**
     * All users.
     *
     * @return \Illuminate\Http\Response
     *
     * @param Request $request
     */
    public function update(Request $request)
    {
        if (Auth::check())
        {
            $user = Auth::user();

            $oldpassword = $request->oldpassword;
            $newpassword = $request->newpassword;
            $userpassword = $user->password;


            if (Hash::check($oldpassword, $userpassword) || $userpassword == NULL)
            {
                $user->password = Hash::make($newpassword);
                $user->save();
            }else {
                return 'koekoek';
            }
        }
    }

    /**
     * Show detail user
     *
     * @param $id
     *
     * @return \Illuminate\Http\Response
     */
    public function show($id){
        if (Auth::check())
        {
            $appID = env('FLIGHT_APPID');
            $appKEY = env('FLIGHT_APPKEY');

            $user = User::find($id);
            $flights = $user->flights()->get();
            $trips = $user->trips()->get();

            foreach ($trips as $trip)
            {
                $clientTripApi = new Client();
                $responseTripApi = $clientTripApi
                  ->get('https://api.flightstats.com/flex/airports/rest/v1/json/iata/'
                    .$trip->airport.'?appId='.$appID.'&appKey='.$appKEY.'')->getBody();

                $trip->api = json_decode($responseTripApi);
            }

            return [
                'user' => $user,
                'flights' => $flights,
                'trips' => $trips
            ];
        }
        else
        {
            return redirect('/login');
        }
    }

    /**
     * Hard Delete user
     *
     * @param \Illuminate\Http\Response
     */
    public function harddelete($id){

        $user = User::find($id);
        $flights = $user->flights()->get();
        $trips = $user->trips()->get();

        $deleteUser = DB::table('users')
          ->where('id', $id);

        $deleteUser->delete();
        
        foreach ($trips as $trip)
        {
            $pivotTrips = DB::table('trip_user')->where('trip_id', $trip->id)->get();
            //CHECK IF PIVOT TABLE STILL CONTAINS FLIGHTS
            if ($pivotTrips == NULL) {

                //DELETE RECORD ALSO FROM TABLE FLIGHTS
                $getTrip = DB::table('trips')->where('id', $trip->id);
                $getTrip->delete();
            }
        }

        foreach ($flights as $flight)
        {
            $pivotFlights = DB::table('flight_user')->where('flight_id', $flight->id)->get();
            //CHECK IF PIVOT TABLE STILL CONTAINS FLIGHTS
            if ($pivotFlights == NULL) {

                //DELETE RECORD ALSO FROM TABLE FLIGHTS
                $getFlight = DB::table('flights')->where('id', $flight->id);
                $getFlight->delete();
            }
        }
    }
}
