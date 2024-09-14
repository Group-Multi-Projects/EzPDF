// SIGNUP
function openNav() {
    if ($(window).width() < 992) {
        $("#my_signup").css("width", "100%");
    } else {
        $("#my_signup").css("width", "90%");
    }
    $("#overlay").fadeIn();
}

function closeNav() {
    $("#my_signup").css("width", "0");
    $("#overlay").fadeOut();
}

// LOGIN
function openNav2() {
    if ($(window).width() < 992) {
        $("#my_login").css("width", "100%");
    } else {
        $("#my_login").css("width", "90%");
    }
    $("#overlay").fadeIn();
}

function closeNav2() {
    $("#my_login").css("width", "0");
    $("#overlay").fadeOut();
}



