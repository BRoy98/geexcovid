$(document).ready(function () {
    $(".owl-carousel").owlCarousel({
        loop: true,
        responsive: {
            0: {
                items: 2,
                nav: true
            },
            600: {
                items: 3,
                nav: false
            },
            1000: {
                items: 3,
                nav: true,
                loop: false
            }
        }
    });

    var x = 295 / 324 * 100 // calculate percentage

    console.log(x);
});