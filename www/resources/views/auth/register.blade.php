@extends('layouts.guest')

@section('content')
    <div class="">
        <div class="">
            <div class="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-3 col-xs-8 col-xs-offset-2 col-xxs">
                <div class="signup_block">
                    <h2>Signup</h2>

                    <div class="signup_form">
                        <form class="form-horizontal" role="form" method="POST" action="{{ url('/register') }}">
                            {!! csrf_field() !!}

                            <div class="form-group{{ $errors->has('name') ? ' has-error' : '' }}">
                                <label class="col-xs-12">Name*</label>

                                <div class="input-group col-xs-12">
                                    <span class="input-group-addon" id="basic-addon1"><i class="fa fa-user fa-2x"></i></span>
                                    <input type="text" class="form-control" name="name" aria-describedby="basic-addon1" value="{{ old('name') }}">
                                </div>

                                @if ($errors->has('name'))
                                    <span class="help-block">
                                        <strong>{{ $errors->first('name') }}</strong>
                                    </span>
                                @endif
                            </div>

                            <div class="form-group{{ $errors->has('email') ? ' has-error' : '' }}">
                                <label class="col-xs-12">Email*</label>

                                <div class="input-group col-xs-12">
                                    <span class="input-group-addon" id="basic-addon1"><i class="fa fa-envelope fa-2x"></i></span>
                                    <input type="email" class="form-control" name="email" aria-describedby="basic-addon1" value="{{ old('email') }}">
                                </div>

                                @if ($errors->has('email'))
                                    <span class="help-block">
                                        <strong>{{ $errors->first('email') }}</strong>
                                    </span>
                                @endif
                            </div>


                            <div class="form-group{{ $errors->has('password') ? ' has-error' : '' }}">
                                <label class="col-xs-12">Enter your password*</label>

                                <div class="input-group col-xs-12">
                                    <span class="input-group-addon" id="basic-addon1"><i class="fa fa-lock fa-2x"></i></span>
                                    <input type="password" class="form-control" name="password" aria-describedby="basic-addon1">
                                </div>

                                @if ($errors->has('password'))
                                    <span class="help-block">
                                        <strong>{{ $errors->first('password') }}</strong>
                                    </span>
                                @endif
                            </div>

                            <div class="form-group{{ $errors->has('password_confirmation') ? ' has-error' : '' }}">
                                <label class="col-xs-12">Repeat your password*</label>

                                <div class="input-group col-xs-12">
                                    <span class="input-group-addon" id="basic-addon1"><i class="fa fa-lock fa-2x"></i></span>
                                    <input type="password" class="form-control" name="password_confirmation" aria-describedby="basic-addon1">
                                </div>

                                @if ($errors->has('password_confirmation'))
                                    <span class="help-block">
                                        <strong>{{ $errors->first('password_confirmation') }}</strong>
                                    </span>
                                @endif
                            </div>

                            <div class="form-group">
                                <div class="col-xs-12">
                                    <button type="submit" class="btn btn-login">Signup</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
