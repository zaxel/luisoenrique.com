$(document).ready(function(){
    $('.card_container').slick({
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        // adaptiveHeight: true
    });
  });
  
$(document).ready(function(){
    const top_nav_menu = document.querySelector('.top_nav_menu');
    const header_nav = document.querySelector('.header');
    const body = document.querySelector('body');
    const burger = document.querySelector('.burger');
    $('.burger').click(function(event){
        $('.top_nav_menu').toggleClass('top_nav_menu_active');
        $('.header').toggleClass('header_nav_stick_tothe_top');
        $(this).toggleClass('active_burger');
        $('body').toggleClass('lock');
        $('.top_nav_ul').click(function(event){
            top_nav_menu.classList.remove('top_nav_menu_active');
            header_nav.classList.remove('header_nav_stick_tothe_top');
            burger.classList.remove('active_burger');
            body.classList.remove('lock');
        });
    });
});
$(document).ready(function(){
    $(window).scroll(function(){
        if ($(this).scrollTop() != 0)
        $('#jumbBtn').fadeIn();
        else
        $('#jumbBtn').fadeOut();
    });
    $('#jumbBtn').click(function(){
        $('body,html').animate({
            scrollTop: 0
        }, 800);
    });
});
  