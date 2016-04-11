<div class="container_navguest">
    <nav class="navbar navbar-default navbar-static-top">
        <div class="">
            <div class="navbar-header">
                <!-- Branding Image -->
                <a class="navbar-brand" href="{{ url('/') }}"><img
                            src="{{ URL::asset('img/assets/logo_white_final.svg') }}" alt=""></a>
            </div>

            <div class="" id="app-navbar-collapse">
                <!-- Right Side Of Navbar -->
                <ul class="nav navbar-nav navbar-right">
                    <!-- Authentication Links -->
                    @if (Auth::guest())
                        <li><a {{ (Request::is('login') ? 'class=active' : '') }} href="{{ url('/login') }}">login</a></li>
                        <li><a {{ (Request::is('register') ? 'class=active' : '') }} href="{{ url('/register') }}">sign up</a></li>
                    @endif
                </ul>
            </div>
        </div>
    </nav>
</div>