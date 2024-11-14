function swap(image) {
    "use strict";
    var widthwindow1 = $(window).width();
    document.getElementById("image").src = image.href;
    if (widthwindow1 >= 1024) {
        $('#image').elevateZoom({
            zoomType: "inner",
            cursor: "crosshair",
            zoomWindowFadeIn: 375,
            zoomWindowFadeOut: 375
        });
    }
}
function swap1(image) {
    document.getElementById("images-select").src = image.href;
};
function slider_owl(slider_id, visible1, visible2, visible3, visible4, margin) {
    $(slider_id).owlCarousel({
        navigation: true,  
        slideSpeed: 500,
        singleItem: true,
        pagination: true,
        autoplay: false,
        margin: margin,
        autoplayTimeout: 2000,
        autoplayHoverPause: true,
        loop: true,
        responsiveClass: true,
        responsive: {
            0: {
                items: visible1
            },

            480: {
                items: visible2

            },

            767: {
                items: visible3
            },

            1025: {
                items: visible4
            }
        }
    });
}
$(document).ready(function() {
//     var menuLeft = $('.pushmenu-left');
//     var menuHome6 = $('.menu-home6');
//     var nav_list = $('.cart .icon-cart');
//     var nav_click = $('.icon-pushmenu');
//     nav_list.on("click", function(event) {
//         event.stopPropagation();
//         $(this).toggleClass('active');
//         $('body').toggleClass('pushmenu-push-toright');
//         menuLeft.toggleClass('pushmenu-open');
//         $(".container").toggleClass("canvas-container");
//     });
//     nav_click.on("click", function(event) {
//         event.stopPropagation();
//         $(this).toggleClass('active');
//         $('body').toggleClass('pushmenu-push-toleft');
//         menuHome6.toggleClass('pushmenu-open');
//     });
//     $(".wrappage").on("click", function() {
//         $(this).removeClass('active');
//         $('body').removeClass('pushmenu-push-toright').removeClass('pushmenu-push-toleft');
//         menuLeft.removeClass('pushmenu-open');
//         menuHome6.removeClass('pushmenu-open');
//     });
//     $("#close-pushmenu").on("click", function() {
//         $(this).removeClass('active');
//         $('body').removeClass('pushmenu-push-toright');
//         menuLeft.removeClass('pushmenu-open');
//     });
//     $("#close-pushmenu.close-left").on("click", function() {
//         $('body').removeClass('pushmenu-push-toleft');
//         menuHome6.removeClass('pushmenu-open');
//     });

    if ($(".tp-banner").length) {
        $('.ver1 .tp-banner').revolution({
            delay: 9000,
            startwidth: 1765,
            startheight: 840,
            hideThumbs: 10,
            fullWidth: "on",
            forceFullWidth: "on"
        });
        $('.ver2 .tp-banner').revolution({
            delay: 9000,
            startwidth: 1315,
            startheight: 860,
            hideThumbs: 10,
            fullWidth: "on",
            forceFullWidth: "on"
        });
        $('.ver3 .tp-banner').revolution({
            delay: 9000,
            startwidth: 1765,
            startheight: 850,
            hideThumbs: 10,
            fullWidth: "on",
            forceFullWidth: "on"
        });
        $('.ver4 .tp-banner').revolution({
            delay: 9000,
            startwidth: 1765,
            startheight: 910,
            hideThumbs: 10,
            fullWidth: "on",
            forceFullWidth: "on"
        });
        $(".tp-leftarrow").html("");
        $(".tp-rightarrow").html("");
    }
    if ($(".product-img-box #image-view").length) {
        var widthwindow1 = $(window).width();
        if (widthwindow1 >= 1024) {
            $('#image').elevateZoom({
                zoomType: "inner",
                cursor: "crosshair",
                zoomWindowFadeIn: 375,
                zoomWindowFadeOut: 375
            });
        }
    }
    // Tabs
    $(".tab-content").hide();
    $("ul.tabs").each(function() {
        $(this).children().first().addClass("active");
        $(this).next().children().first().show().addClass("active");
    });
    $("ul.tabs li").each(function() {
        $(this).on("click", function() {
            var tab_content = $(this).parent().next().children();
            $(this).parent().children().removeClass("active");
            $(this).addClass("active");
            tab_content.hide().removeClass("active");
            var activeTab = $(this).attr("rel");
            $("#" + activeTab).fadeIn(400).addClass("active");
        });
    });
    // End tabs
    $(".products.grid_full .product").each(function() {
        $(this).find(".product-images").wrap('<div class="wrap-product-images"></div>');
        $(this).find(".wrap-product-images").append($(this).find(".add-to-cart")).append($(this).find(".action"));
    });
    // Slider products
    var owl = $(".product-tab-content");
    var owl2 = $(".product-tab-content1");
    var owl3 = $("#secondary .sidebar-slider");
    var mason = $(".tab-product-all-mason .col-md-7 .slider-one-item");
    var menu_top_header3 = $(".header-v3 .menu-top");
    var menu_level1 = $("ul.menu-level-1");
    var mega_menu = $(".mega-menu");
    var sub_menu = $(".mega-menu .sub-menu");
    var header3_menu2 = $(".header-v3 .menu-top li.level-1 .menu-level2");
    $(window).on("orientationchange load resize", function() {
        $('#preloader').delay(1000).fadeOut('400', function() {
            $(this).fadeOut()
        });
        initialize();
        owl.css({
            "width": $(".container").width() + "px"
        });
        owl2.css({
            "width": $("#primary").width() + "px"
        });
        owl3.css({
            "width": $("#secondary").width() + "px"
        });
        mason.css({
            "width": $(".container").width() + "px"
        });
        var widthwindow = $(window).width();
        if (widthwindow > 1024) {
            menu_top_header3.insertAfter($(".header-v3 .search.dropdown"));
            sub_menu.addClass("dropdown-menu");
            header3_menu2.addClass("dropdown-menu");
            menu_level1.addClass("dropdown-menu");
            mega_menu.insertAfter($(".header-top .logo"));
        } else {
            header3_menu2.removeClass("dropdown-menu");
            sub_menu.removeClass("dropdown-menu");
            menu_top_header3.insertAfter($(".header-v3 .header-top"));
            menu_level1.removeClass("dropdown-menu");
            mega_menu.insertAfter($("#header"));
        }
        $("#googleMap").css({
            "height": $(".contact-form").innerHeight() + "px"
        });
        $(".mockup-text").css({
            "height": $(".mockup-images").innerHeight() + "px"
        });
    });
    owl.css({
        "width": $(".container").width() + "px"
    });
    owl2.css({
        "width": $("#primary").width() + "px"
    });
    owl3.css({
        "width": $("#secondary").width() + "px"
    });
    mason.css({
        "width": $(".container").width() + "px"
    });

    // Slider
    slider_owl(".product-tab-content", 1, 2, 3, 5, 20);
    slider_owl(".feature-product-bar .product-tab-content1", 1, 2, 2, 3, 20);
    slider_owl(".slider-product-3-item .products", 1, 2, 2, 3);
    slider_owl(".slider-product-2-item .blog-post-inner", 1, 2, 2, 2);
    slider_owl(".new-product-bar .product-tab-content1", 1, 2, 2, 3, 20);
    slider_owl(".blog-post-inner", 1, 2, 2, 3, 20);
    slider_owl(".blog-post-inner", 1, 2, 2, 3, 20);
    slider_owl(".brand-content", 2, 3, 4, 6, 0);

    slider_owl(".slider-one-item", 1, 1, 1, 1, 0);
    slider_owl(".slider-two-item", 1, 2, 2, 2, 0);
    slider_owl(".upsell-product", 1, 2, 3, 5, 20);

    // click to zoom
    var img_box_thum = $(".product-img-box .thumb-content li");
    img_box_thum.first().addClass("active");
    img_box_thum.on("click", function() {
        img_box_thum.removeClass("active");
        $(this).addClass("active");
    });


    $('.owl-controls .owl-prev').html('<i class="fa fa-angle-left"></i>');
    $('.owl-controls .owl-next').html('<i class="fa fa-angle-right"></i>');
    $('.brand-container .owl-controls .owl-prev').html('<i class="fa fa-angle-left"></i>');
    $('.brand-container .owl-controls .owl-next').html('<i class="fa fa-angle-right"></i>');
    $('.bottom-home1 .owl-controls .owl-prev').html('<i class="fa fa-angle-left"></i>');
    $('.bottom-home1 .owl-controls .owl-next').html('<i class="fa fa-angle-right"></i>');
    // Click to Hover
    $('.dropdown').hover(function() {
        $(this).find('.dropdown-menu').stop(true, true).fadeIn(200).toggleClass("hover");
        $(this).toggleClass("active");
    }, function() {
        $(this).find('.dropdown-menu').stop(true, true).fadeOut(200).toggleClass("hover");
        $(this).toggleClass("active");
    });

    // Click Icon Menu Mobile
    $(".icon-menu-mobile").on("click", function() {
        $(".navbar-nav").slideToggle();
        $(this).toggleClass("active");
    });
    $(".header-v3 .icon-menu-mobile").on("click", function() {
        menu_top_header3.slideToggle();
    });
    $('li:has(ul)').addClass('hassub');
    $('li:has(".sub-menu")').addClass('images');
    $(".sub-menu img").parent().addClass("images");
    $(".mega-menu ul li a").after('<i class="fa fa-plus"></i>');
    $(".nav-home6 li a").after('<i class="fa fa-plus"></i>');

    $(".ordering .list").on("click", function() {
        $(this).toggleClass("active");
        $(".products").addClass("list-item");
        $(".ordering .col").removeClass("active");
        $(".products.grid_full .product").each(function() {
            $(this).append($(this).find(".add-to-cart"));
            $(this).append($(this).find(".action"));
        });
    });
    $(".ordering .col").on("click", function() {
        $(this).toggleClass("active");
        $(".products").removeClass("list-item");
        $(".ordering .list").removeClass("active");
        $(".products.grid_full .product").each(function() {
            $(this).find(".wrap-product-images").append($(this).find(".add-to-cart")).append($(this).find(".action"));
        });
    });

    $(".close-popup").on("click", function() {
        $(".popup-content").hide();
    });
    $(".closeqv").on("click", function() {
        $(".quickview-wrapper").hide();
    });

    $("ul.product-categories li.hassub a").after('<i class="fa fa-caret-right"></i>');
    $("ul li.hassub i").on("click", function() {
        $(this).next().slideToggle();
        $(this).toggleClass("active");
        $(this).parent().toggleClass("active");
    });
    var megamenu_v2 = $(".megamenu-v2");
    $("#header .fa-bars").on("click", function() {
        megamenu_v2.addClass("show-ef");
    });

    $(".megamenu-v2 .fa-times").on("click", function() {
        megamenu_v2.removeClass("show-ef");
    });
    $(".form-check").on("click", function() {
       $(this).toggleClass("active"); 
    });
    // googleMap
    function initialize() {
        if ($("#googleMap").length) {
            // Center
            var center = new google.maps.LatLng(9.7934, 76.3160);

            // Map Options		
            var mapOptions = {
                zoom: 15,
                center: center,
                scrollwheel: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                styles: [{
                    "featureType": "landscape",
                    "stylers": [{
                        "saturation": -100
                    }, {
                        "lightness": 65
                    }, {
                        "visibility": "on"
                    }]
                }, {
                    "featureType": "poi",
                    "stylers": [{
                        "saturation": -100
                    }, {
                        "lightness": 51
                    }, {
                        "visibility": "simplified"
                    }]
                }, {
                    "featureType": "road.highway",
                    "stylers": [{
                        "saturation": -100
                    }, {
                        "visibility": "simplified"
                    }]
                }, {
                    "featureType": "road.arterial",
                    "stylers": [{
                        "saturation": -100
                    }, {
                        "lightness": 30
                    }, {
                        "visibility": "on"
                    }]
                }, {
                    "featureType": "road.local",
                    "stylers": [{
                        "saturation": -100
                    }, {
                        "lightness": 40
                    }, {
                        "visibility": "on"
                    }]
                }, {
                    "featureType": "transit",
                    "stylers": [{
                        "saturation": -100
                    }, {
                        "visibility": "simplified"
                    }]
                }, {
                    "featureType": "administrative.province",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "water",
                    "elementType": "labels",
                    "stylers": [{
                        "visibility": "on"
                    }, {
                        "lightness": -25
                    }, {
                        "saturation": -100
                    }]
                }, {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [{
                        "hue": "#ffff00"
                    }, {
                        "lightness": -25
                    }, {
                        "saturation": -97
                    }]
                }],
            };
            var map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
            var marker = new Marker({
                map: map,
                position: new google.maps.LatLng(9.7934, 76.3160),
                icon: {
                    path: SQUARE_PIN,
                    fillColor: '#55c1cb',
                    fillOpacity: 1,
                    strokeColor: '',
                    strokeWeight: 0
                },
                map_icon_label: '<span class="map-icon map-icon-point-of-interest"></span>'
            });
        }
    }
    // End google map
    /* event more-views click see big image. */
    var back_to_top = $('#back-to-top');
    if (back_to_top.length) {
        var scrollTrigger = 100, // px
            backToTop = function() {
                var scrollTop = $(window).scrollTop();
                if (scrollTop > scrollTrigger) {
                    back_to_top.addClass('show');
                } else {
                    back_to_top.removeClass('show');
                }
            };
        $(window).on('scroll', function() {
            backToTop();
        });
        back_to_top.on('click', function(e) {
            e.preventDefault();
            $('html,body').animate({
                scrollTop: 0
            }, 700);
        });
    }

    if ($('.quantity').length > 0) {
        var form_cart = $('form .quantity');
        form_cart.prepend('<span class="minus"><i class="fa fa-minus"></i></span>');
        form_cart.append('<span class="plus"><i class="fa fa-plus"></i></span>');

        var minus = form_cart.find($('.minus'));
        var plus = form_cart.find($('.plus'));

        minus.on('click', function() {
            var qty = $(this).parent().find('.qty');
            if (qty.val() <= 1) {
                qty.val(1);
            } else {
                qty.val((parseInt(qty.val()) - 1));
            }
        });
        plus.on('click', function() {
            var qty = $(this).parent().find('.qty');
            qty.val((parseInt(qty.val()) + 1));
        });
    }
    $(".calculate").on('click', function() {
        $(this).next().slideToggle();
        $(this).toggleClass("active");
    });
    var lightgallery = $('#lightgallery');
    if (lightgallery.length > 0) {
        lightgallery.lightGallery();
    }
    if ($('.wow').length > 0) {
        wow = new WOW({
            animateClass: 'animated',
            offset: 200,
            callback: function(box) {
                console.log("WOW: animating <" + box.tagName.toLowerCase() + ">")
            }
        });
        wow.init();
    }
    var slider_lookbook2 = $('.slider-loobook2');
    if (slider_lookbook2.length > 0) {
        slider_lookbook2.slick({
            infinite: true,
            centerMode: true,
            slidesToShow: 1,
            slidesToScroll: 1
        });
    }
    var slider_slick_home8 = $(".slider-slick-home8")
    if (slider_slick_home8.length > 0) {
        slider_slick_home8.slick({
            dots: true,
            infinite: true,
            centerMode: true,
            slidesToShow: 3,
            slidesToScroll: 3,
            responsive: [{
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }]
        });
    }
    if ($('.blog-masonry').length > 0) {
        $('.grid').masonry({
            itemSelector: '.grid-item',
            columnWidth: '.grid-sizer',
            percentPosition: true
        });
     }
});