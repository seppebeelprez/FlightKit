@extends('layouts.frontoffice')

@section('content')
<div class="container">
    <div class="row">
        <md-content ng-app="app">
            <div ui-view="main"></div>
        </md-content>
    </div>
</div>
@endsection
