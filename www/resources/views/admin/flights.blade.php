@extends('layouts.admin')

@section('content')
    <div class="container">
        <div class="row">
            {{--<div id="admin_flight_overview_content">--}}

                {{--<div class="admin_flight_overview_intro">--}}
                    {{--<div class="col-xs-10">--}}
                        {{--<span class="admin_flight_overview_intro_title">All flights</span>--}}
                    {{--</div>--}}

                    {{--<div class="col-xs-2">--}}
                        {{--<button id="demo-menu-lower-right" class="mdl-button mdl-js-button mdl-button--icon">--}}
                            {{--<i class="material-icons">more_vert</i>--}}
                        {{--</button>--}}

                        {{--<ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect"--}}
                            {{--for="demo-menu-lower-right">--}}
                            {{--<a ng-if="vm.checkIfTrip == true" href="" ng-click="vm.$$ix.removefavorite()"><li class="mdl-menu__item item_favorite"><i class="material-icons">favorite_border</i> Remove from trips</li></a>--}}
                            {{--<a ng-if="vm.checkIfTrip == false" href="" ng-click="vm.$$ix.favorite()"><li class="mdl-menu__item item_favorite"><i class="material-icons">favorite</i> Add to trips</li></a>--}}
                            {{--<a href="" ng-click="vm.$$ix.delete()"><li class="mdl-menu__item item_delete"><i class="material-icons">delete</i> Delete</li></a>--}}
                            {{--<a href="" ng-click="vm.$$ix.refresh()"><li class="mdl-menu__item item_refresh"><i class="material-icons">refresh</i> Refresh</li></a>--}}
                        {{--</ul>--}}
                    {{--</div>--}}
                {{--</div>--}}

                {{--@foreach ($flights->sortBy('airline') as $flight)--}}
                    {{--<div class="admin_flights_overview col-xs-12">--}}
                        {{--<a href="">--}}
                            {{--<div class="admin_flight_item col-xs-12">--}}
                                {{--<div class="fi_place col-lg-6 col-md-6 col-sm-6 col-xs-6 col-xxs-12 col-500">--}}
                                    {{--<span>{{ $flight->DepAirport->name }} ({{ $flight->DepAirport->iata }})</span>--}}
                                    {{--<span>--}}
                                        {{--<i class="material-icons">flight_takeoff</i>--}}
                                        {{--<p>{{ $flight->ArrAirport->name }} ({{ $flight->ArrAirport->iata }})</p>--}}
                                    {{--</span>--}}
                                {{--</div>--}}
                            {{--</div>--}}
                        {{--</a>--}}
                    {{--</div>--}}
                {{--@endforeach--}}
            {{--</div>--}}


        </div>
    </div>
@endsection