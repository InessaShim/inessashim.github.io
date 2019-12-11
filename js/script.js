const lpApp = angular.module('lpApp', []);

lpApp.controller('lpPriceCtrl', function ($scope, $http) {

    $http.get('price.json').then(function (res) {
        $scope.prices = res.data;
        $scope.calc();
        $scope.sortGet();
    }).catch(function (err) {
        $scope.reqStatus = err.status;
        $scope.reqStatusText = err.statusText;
    });


    $scope.sortSet = function (propertyName) {
        if ($scope.sortBy == propertyName) {
            $scope.sortRev = !$scope.sortRev;
        }
        $scope.sortBy = propertyName;


        localStorage.sortBy = $scope.sortBy;
        localStorage.sortRev = $scope.sortRev;
    };

    $scope.sortGet = function () {
        if (localStorage.sortBy && localStorage.sortRev) {
            $scope.sortBy = localStorage.sortBy;
            $scope.sortRev = (localStorage.sortRev == 'true');

        } else {
            $scope.sortBy = 'name';
            $scope.sortRev = false;
        }
    }

    $scope.calc = function () {
        $scope.prices.forEach(function (price) {
            price.price2 = price.price * (1 - price.discount);
        });
    }
});

(function ($) {
    $(document).ready(function () {

        /* Стартовый экран */

        let lpReady = false;

        function lpGoToActive() {

            let lpPath = window.location.pathname.replace('/', ''),
                lpTrgt;

            if (lpPath != '') {
                lpTrgt = $('#' + lpPath);
                if (lpTrgt.length > 0) {
                    $('body, html').scrollTop(lpTrgt.offset().top - 44);
                }
            }

            setTimeout(function () {
                lpReady = true;
            }, 500);
        }

        lpGoToActive();
        $(window).on('load', lpGoToActive);

        /* Панель навигации */

        function lpHeader() {
            if ($(window).scrollTop() == 0) {
                $('header').addClass('top');
            } else {
                $('header.top').removeClass('top');
            }
        }

        lpHeader();
        $(window).on('load scroll', lpHeader);

        /* Плавный скролл */

        let lpNav = $('header ul');

        lpNav.find('li a').on('click', function (e) {

            let trgtSelector = $(this).attr('href'),
                linkTrgt = $(trgtSelector);

            if (linkTrgt.length > 0) {
                e.preventDefault();

                let offset = linkTrgt.offset().top - 44;

                $('body, html').animate({
                    scrollTop: offset
                }, 750);
            }
        });

        /* Активный пункт меню */

        function lpSetNavActive() {
            let curItem = '';

            $('section').each(function () {
                if ($(window).scrollTop() > $(this).offset().top - 200) {
                    curItem = $(this).attr('id');
                }
            });

            let noActiveItem = lpNav.find('li.active').length == 0,
                newActiveRequired = lpNav.find('li.active a').attr('href') != '#' + curItem;

            if (noActiveItem || newActiveRequired) {
                lpNav.find('li.active').removeClass('active');
                lpNav.find('li a[href="#' + curItem + '"]').parent().addClass('active');

                if (lpReady) {
                    window.history.pushState({
                        curItemName: curItem
                    }, curItem, '/' + curItem);
                }
            }
        }

        lpSetNavActive();
        $(window).on('load scroll', lpSetNavActive);

        /* Слайдшоу */

        $('.lp-slider1').owlCarousel({
            items: 1,
            nav: true,
            autoplay: true,
            autoplayTimeout: 5000,
            loop: true,
            navText: ['<i class="fas fa-arrow-left"></i>', '<i class="fas fa-arrow-right"></i>']
        });

        $('.lp-slider2').owlCarousel({
            items: 3,
            margin: 5,
            stagePadding: 5,
            nav: true,
            navText: ['<i class="fas fa-arrow-left"></i>', '<i class="fas fa-arrow-right"></i>']
        });

        /* Табулятор */

        $('.lp-services').lpTabs();

        /* Всплывающие окна */


        $('.lp-gallery').each(function () {
            $(this).magnificPopup({
                type: 'image',
                delegate: 'a',
                gallery: {
                    enabled: true
                }
            });
        });

        /* Обратная связь */

        $('#lp-fb1').wiFeedBack({
            fbScript: 'blocks/wi-feedback.php',
            fbLink: '.lp-fb1-link',
            fbColor: '#80bd61'
        });

        $('#lp-fb2').wiFeedBack({
            fbScript: 'blocks/wi-feedback.php',
            fbLink: false,
            fbColor: '#80bd61'
        });

        /* Карта */

        $.fn.lpMapInit = function () {

            let lpMapOptions = {
                center: [53.910473, 27.573141],
                zoom: 16,
                controls: ['fullscreenControl', 'zoomControl']
            }

            if (window.innerWidth < 768) {
                lpMapOptions.behaviors = ['multiTouch'];
            } else {
                lpMapOptions.behaviors = ['drag'];
            }

            let lpMap = new ymaps.Map('lp-map', lpMapOptions);

            let lpPlacemark = new ymaps.Placemark(lpMapOptions.center, {
                hintContent: 'Воздушные шарики',
                balloonContentHeader: 'Воздушные шарики',
                balloonContentBody: 'салон-магазин',
                balloonContentFooter: 'ул. Киселёва, 4'
            });

            lpMap.geoObjects.add(lpPlacemark);
        }





    });
})(jQuery);
