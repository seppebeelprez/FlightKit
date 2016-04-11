@extends('layouts.guest')

@section('content')
    <div class="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-3 col-xs-8 col-xs-offset-2 col-xxs">
        <div class="login_block">
            <h2>Login</h2>

            <div class="login_form">
                <form class="form-horizontal" name="form" role="form" method="POST" action="{{ url('/login') }}" novalidate>
                    {!! csrf_field() !!}

                    <div class="form-group{{ $errors->has('email') ? ' has-error' : '' }}">
                        <label class="col-xs-12">Enter your email*</label>

                        <div class="input-group col-xs-12">
                            <span class="input-group-addon" id="basic-addon1"><i class="fa fa-envelope fa-2x"></i></span>
                            <input type="email" class="form-control" name="email" aria-describedby="basic-addon1" value="{{ old('email') }}">
                            <div ng-show="form.$submitted" class="ngShow">
                                <div ng-show="form.email.$error.required">Email required</div>
                            </div>
                        </div>

                        @if ($errors->has('email'))
                            <span class="help-block">
                                        {{ $errors->first('email') }}
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
                                        {{ $errors->first('password') }}
                                    </span>
                        @endif
                    </div>

                    <div class="form-group">
                        <div class="col-xs-12">
                            <button type="submit" class="btn btn-login">Login</button>
                        </div>
                    </div>

                    <div class="or_divider">
                        <p>or</p>
                    </div>

                    <div class="form-group">
                        <div class="col-xs-12">
                            <a href="redirect" class="btn btn-social">
                                Login with facebook
                            </a>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="col-xs-12">
                            <div class="checkbox">
                                <div class="login_extra">
                                    <div class="col-xs-6">
                                        <label>
                                            <input type="checkbox" name="remember"> Remember Me
                                        </label>
                                    </div>

                                    <div class="col-xs-6">
                                        <a class="btn-link" href="{{ url('/password/reset') }}">Forgot Your Password?</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection
