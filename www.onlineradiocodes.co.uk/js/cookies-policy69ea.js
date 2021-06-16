//Cookie banner

var dropCookie = true; // false disables the Cookie, allowing you to style the banner
var cookieDuration = 999; // Number of days before the cookie expires, and the banner reappears
var cookieName = 'complianceCookie'; // Name of our cookie
var cookieValue = 'on'; // Value of cookie

function createDiv() {

    var bodytag = document.getElementsByTagName('body')[0];
    var footer = document.querySelector('footer');
    var div = document.createElement('div');
    div.setAttribute('id', 'CookieInfo');
    div.innerHTML = '<div><p>We use cookies on our website. You are free to manage this via your browser setting at any time. To learn more about how we use the cookies, please see our <a href="/cookies" rel="nofollow" title="Cookies Policy">Cookies Policy</a>.</p> <div class="cookie-btn__wrap"><div><button class="close-cookie-banner btn__std btn__std--blue button" href="javascript:void(0)" onclick="removeMe()"><span>OK!</span></button></div></div></div>';
    // Be advised the Close Banner 'X' link requires jQuery

    // bodytag.appendChild(div); // Adds the Cookie Law Banner just before the closing </body> tag
    // or
    footer.insertBefore(div, footer.firstChild); // Adds the Cookie Law Banner just after the opening <body> tag

    document.getElementsByTagName('body')[0].className += ' cookiebanner'; //Adds a class to the <body> tag when the banner is visible
}

function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else var expires = "";
    if (window.dropCookie) {
        document.cookie = name + "=" + value + expires + "; path=/";
    }
}

function checkCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

window.removeMe = function removeMe() {
    var element = document.getElementById('CookieInfo');
    element.parentNode.removeChild(element);
    createCookie(window.cookieName, window.cookieValue, window.cookieDuration); // Create the cookie
};

if (checkCookie(window.cookieName) !== window.cookieValue) {
    createDiv();
}