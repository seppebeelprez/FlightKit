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
                            <a {{ (Request::is('admin/flights*') ? 'class=active' : '') }} href="{{ url('/admin/flights') }}">flights</a>
                        </li>
                        <li class="scrollToInsideLink">
                            <a {{ (Request::is('admin/trips*') ? 'class=active' : '') }} href="{{ url('/admin/trips') }}">trips</a>
                        </li>
                        <li class="scrollToInsideLink">
                            <a {{ (Request::is('admin/users') ? 'class=active' : '') }} href="{{ url('/admin/users') }}">users</a>
                        </li>
                        <li class="scrollToInsideLink">
                            <a {{ (Request::is('exit') ? 'class=active' : '') }} href="{{ url('/') }}">exit</a>
                        </li>
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
            <a {{ (Request::is('flights') ? 'class=active' : '') }} href="{{ url('/admin/flights') }}">flights</a>
            <a {{ (Request::is('trips') ? 'class=active' : '') }} href="{{ url('/admin/trips') }}">trips</a>
            <a {{ (Request::is('account') ? 'class=active' : '') }} href="{{ url('/admin/users') }}">users</a>
            <a {{ (Request::is('account') ? 'class=active' : '') }} href="{{ url('/') }}">exit</a>
            <a href="{{ url('/logout') }}">logout</a>
        </div>
    </div>
</div>

