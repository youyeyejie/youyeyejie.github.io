jQuery(document).ready(function() {

    var b, c, a = document.title;
    var welcomeTimer = null;

    function d() {
        if (document[b]) {
            document.title = " (๑•́ ₃ •̀๑) ";
            if (welcomeTimer) {
                clearTimeout(welcomeTimer);
                welcomeTimer = null;
            }
        } else {
            document.title = " (*^▽^*) ";
            welcomeTimer = setTimeout(function() {
                document.title = a;
            }, 2000);
        }
    }

    if (typeof document.hidden !== "undefined") {
        b = "hidden";
        c = "visibilitychange";
    } else if (typeof document.mozHidden !== "undefined") {
        b = "mozHidden";
        c = "mozvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        b = "webkitHidden";
        c = "webkitvisibilitychange";
    }

    if ((typeof document.addEventListener !== "undefined" || typeof document[b] !== "undefined") && c) {
        document.addEventListener(c, d, false);
    }

});