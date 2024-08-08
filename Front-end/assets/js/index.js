// SIGNUP
function openNav() {
    if ($(window).width() < 971) {
        $("#mySidepanel").css("width", "100%");
    } else {
        $("#mySidepanel").css("width", "90%");
    }
    $("#overlay").fadeIn();
}

function closeNav() {
    $("#mySidepanel").css("width", "0");
    $("#overlay").fadeOut();
}

// LOGIN
function openNav2() {
    if ($(window).width() < 971) {
        $("#mySidepanel2").css("width", "100%");
    } else {
        $("#mySidepanel2").css("width", "90%");
    }
    $("#overlay").fadeIn();
}

function closeNav2() {
    $("#mySidepanel2").css("width", "0");
    $("#overlay").fadeOut();
}


