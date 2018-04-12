$(document).ready(function(){

  $(window).scroll(function() {
    var scroll = $(window).scrollTop();
     //console.log(scroll);
    if (scroll >= 100) {
        //console.log('a');
        $("#menu").addClass("menu-class");
    } else {
        //console.log('a');
        $("#menu").removeClass("menu-class");
    }
 });

});
