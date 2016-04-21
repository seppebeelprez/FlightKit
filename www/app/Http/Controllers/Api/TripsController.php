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
           
        }
        else
        {
            return redirect('/login');
        }
    }

    /**
     * Show detail trip
     *
     * @param $id
     */
    public function show($id){

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
        

    }

}
