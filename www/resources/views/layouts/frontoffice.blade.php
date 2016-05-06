<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>FlightKit</title>

    <!-- Fonts -->
    {{--<link href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.4.0/css/font-awesome.min.css" rel='stylesheet' type='text/css'>--}}
    {{--<link rel="stylesheet" href="/css/font-awesome.css">--}}
    <link href="//fonts.googleapis.com/css?family=Lato:100,300,400,700" rel='stylesheet' type='text/css'>
    <link href="//fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

    <!-- Styles -->
    <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">

    @section('head-scripts')
        {!! Html::script('js/angular.js') !!}
        {!! Html::script('js/vendor.min.js') !!}
        {!! Html::script('js/bootstrap.min.js') !!}
        {!! Html::script('js/angular-spinners.min.js') !!}
        {!! Html::script('js/angular-busy.js') !!}
        {!! Html::script('js/frontoffice.js') !!}
    @show

    {!! Html::style('css/material.min.css') !!}
    {!! Html::style('css/weather-icons.min.css') !!}
    <link rel="stylesheet" href="{{ elixir('css/main.css') }}">

    <base href="/">

    <style>
        body {
            font-family: 'Lato';
        }

        .fa-btn {
            margin-right: 6px;
        }
    </style>
</head>
<body id="app-layout">
    {{--<div class="preloader">--}}
        {{--<div class="status">&nbsp;</div>--}}
    {{--</div>--}}

    @include('partials.nav')

    <section id="main_content">
        @yield('content')
    </section>

    <!-- JavaScripts -->
    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
     {{--<script src="{{ elixir('js/frontoffice.js') }}"></script>--}}

    @section('foot-scripts')
        {!! Html::script('js/material.min.js') !!}
        {!! Html::script('js/custom.js') !!}
    @show

</body>
</html>
