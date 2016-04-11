/* =================================
 ===  NAV IS VISIBLE            ====
 =================================== */
var topNav = $('.navbar-toggle');
var mobileButtonOpen = $('#mobile_button_open');
var mobileButtonClose = $('#mobile_button_close');
var mobileNavigation = $('#myNav');

topNav.on('click', function(event){
    event.preventDefault();
    $([topNav]).toggleClass('nav-is-visible');
    $('.navbar-collapse').toggleClass('menu_style');
    $('body').toggleClass('fixedPosition');
    $('html').toggleClass('fixedPosition');
});

mobileButtonOpen.on('click', function(event){
    event.preventDefault();
    mobileNavigation.addClass("overlay-open");
});

mobileButtonClose.on('click', function(event){
    event.preventDefault();
    mobileNavigation.removeClass("overlay-open");
});

/* =================================
 LOADER
 =================================== */
// makes sure the whole site is loaded
jQuery(window).load(function() {
    // will first fade out the loading animation
    jQuery(".status").fadeOut();
    // will fade out the whole DIV that covers the website.
    jQuery(".preloader").fadeOut("fast");
})

/* =================================
 ===  STICKY NAV                 ====
 =================================== */

/* COLLAPSE NAVIGATION ON MOBILE AFTER CLICKING ON LINK - ADDED ON V1.5*/

if (matchMedia('(max-width: 768px)').matches) {
    $('.main-navigation li a').on('click', function () {
        $(".navbar-toggle").click();
    });
}


/* =================================
 ===  FULL SCREEN HEADER         ====
 =================================== */
function alturaMaxima() {
    var altura = $(window).height();
    $(".full-screen").css('min-height',altura);

}

$(document).ready(function() {
    alturaMaxima();
    $(window).bind('resize', alturaMaxima);
});

/* =================================
 ===  Bootstrap Internet Explorer 10 in Windows 8 and Windows Phone 8 FIX
 =================================== */
if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
    var msViewportStyle = document.createElement('style')
    msViewportStyle.appendChild(
        document.createTextNode(
            '@-ms-viewport{width:auto!important}'
        )
    )
    document.querySelector('head').appendChild(msViewportStyle)
}

$(document).ready(function() {
    if (window.location.hash && window.location.hash == '#_=_') {
        if (window.history && history.pushState) {
            window.history.pushState("", document.title, window.location.pathname);
        } else {
            // Prevent scrolling by storing the page's current scroll offset
            var scroll = {
                top: document.body.scrollTop,
                left: document.body.scrollLeft
            };
            window.location.hash = '';
            // Restore the scroll offset, should be flicker free
            document.body.scrollTop = scroll.top;
            document.body.scrollLeft = scroll.left;
        }
    }
});


window.fbAsyncInit = function() {
    FB.init({
        appId      : '1692779330963372',
        xfbml      : true,
        version    : 'v2.5'
    });
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));