@if (Auth::guest())

{{--@elseif(Auth::admin())--}}

@else
    <header class="header">
        <div class="color_overlay_black">
            <div class="navbar navbar-inverse bs-docs-nav navbar-fixed-top sticky-navigation">
                <div class="container">
                    <div class="navbar-header">
                        <button id="mobile_button_open" type="button" class="navbar-toggle">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar icon-bar-2"></span>
                            <span class="icon-bar"></span>
                        </button>
                        <a class="navbar-brand" href="{{ url('/') }}"><img
                                    src="{{ URL::asset('img/assets/logo_white_final.svg') }}" alt=""></a>
                    </div>

                    <div class="navbar-collapse collapse" id="kane-navigation">
                        <ul class="nav navbar-nav navbar-right main-navigation">
                            <li class="scrollToInsideLink">
                                <a {{ (Request::is('/') ? 'class=active' : '') }} href="{{ url('/') }}">home</a>
                            </li>
                            <li class="scrollToInsideLink">
                                <a {{ (Request::is('flights*') ? 'class=active' : '') }} href="{{ url('/flights') }}">flights</a>
                            </li>
                            <li class="scrollToInsideLink">
                                <a {{ (Request::is('trips*') ? 'class=active' : '') }} href="{{ url('/trips') }}">trips</a>
                            </li>
                            <li class="scrollToInsideLink">
                                <a {{ (Request::is('account') ? 'class=active' : '') }} href="{{ url('/account') }}">account</a>
                            </li>
                            @if ( $user->isAdmin() )
                                <li class="scrollToInsideLink">
                                    <a {{ (Request::is('account') ? 'class=active' : '') }} href="{{ url('/admin/flights') }}">admin</a>
                                </li>
                            @endif
                            <li class="scrollToInsideLink">
                                <a href="{{ url('/logout') }}">logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <div id="myNav" class="overlay overlay-data">
        <div class="container_mynav">
            <div class="closebutton_div">
                <a href="" id="mobile_button_close" class="closebtn"><img src="{{ URL::asset('img/assets/close2.svg') }}" alt=""></a>
            </div>
            <div class="overlay-content">
                <a {{ (Request::is('home') ? 'class=active' : '') }} href="{{ url('/') }}">home</a>
                <a {{ (Request::is('flights') ? 'class=active' : '') }} href="{{ url('/flights') }}">flights</a>
                <a {{ (Request::is('trips') ? 'class=active' : '') }} href="{{ url('/trips') }}">trips</a>
                <a {{ (Request::is('account') ? 'class=active' : '') }} href="{{ url('/account') }}">account</a>
                @if ( $user->isAdmin() )
                    <a {{ (Request::is('account') ? 'class=active' : '') }} href="{{ url('/admin/flights') }}">admin</a>
                @endif
                <a href="{{ url('/logout') }}">logout</a>
            </div>
        </div>
    </div>
@endif

