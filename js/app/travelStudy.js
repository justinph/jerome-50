require(["jquery", "async!http://maps.google.com/maps/api/js?key=AIzaSyAHHC2slaWMzd-bp3TbzYl-QTf_Fq-5-yE&sensor=false!callback", "jquery-mousewheel"], function travelStudy($) {
    "use strict";


    // function detectMobile() { 
    //  if( navigator.userAgent.match(/Android/i)
    //  || navigator.userAgent.match(/webOS/i)
    //  || navigator.userAgent.match(/iPhone/i)
    //  || navigator.userAgent.match(/iPad/i)
    //  || navigator.userAgent.match(/iPod/i)
    //  || navigator.userAgent.match(/BlackBerry/i)
    //  || navigator.userAgent.match(/Windows Phone/i)
    //  ){
    //     return true;
    //   }
    //  else {
    //     return false;
    //   }
    // }
    
    // $('#map-canvas').css({
    //     height: $(window).height(),
    //     top:  ($(window).height() )
    // });

    // var mapPosition = $(window).height(); //$("#map-canvas").offset().top;


    // $('#wrap').scroll(function(){
    //     var topOffset = $('.s3').offset().top * -1;
        
    //     //console.log(topOffset, mapPosition);

    //     if (topOffset >= mapPosition ){
    //         $("#map-canvas").addClass("fixed_map");
    //     }

    // }).scroll();


    var map, mapData;
    var mn = new google.maps.LatLng(46.4, -93.790039);
    var MY_MAPTYPE_ID = 'custom_style';
    var tableId = '1ZG7LLuMPO3NDMpwOZZ9WBV3613MpM2gDzvDeQog';
    var featureOpts = [{
            stylers: [{
                hue: '#343434'
            }, {
                visibility: 'simplified'
            }, {
                gamma: 1.0
            }, {
                weight: 1.0
            }]
        },
        // {
        //   elementType: 'labels',
        //   stylers: [
        //     { visibility: 'off' }
        //   ]
        // },
        {
            featureType: 'water',
            stylers: [{
                color: '#343434'
            }]
        }
    ];

    var mapOptions = {
        zoom: 4,
        center: mn,
        // mapTypeControlOptions: {
        //   mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
        // },
        scrollwheel: false,
        disableDefaultUI: true,
        zoomControl: true,
        panControl: false,
        streetViewControl: false,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.DEFAULT,
            position: google.maps.ControlPosition.LEFT_BOTTOM
        },
        mapTypeId: MY_MAPTYPE_ID
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var styledMapOptions = {
        name: 'Custom Style'
    };

    var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);

    map.mapTypes.set(MY_MAPTYPE_ID, customMapType);

    mapData = new google.maps.FusionTablesLayer({
        query: {
            select: "Destination",
            from: tableId, //old demo data: "1JtXOo6Fbfkrd_rY00pcAOg90dH92vqNaACqM5_A",
            where: "year <= " + window.year
        },
        map: map,
        styleId: 2,
        templateId: 2
    });

    $(window).on("updateYear:3", function() {
        //console.log('receiving update 3');
        updateYear();
    });

    var updateYear = function updateYear() {

        if (window.year === 1963) {
            $('#year').addClass('faded');
            $('#year-down').addClass('inactive');
            $('.s3 .textDisplay').show();
        } else {
            $('.s3 .textDisplay').hide();
            $('#year-down, #year-up').removeClass();
            $('#year').removeClass().text(window.year);
        }

        mapData.setOptions({
            query: {
                select: "Destination",
                from: tableId,
                where: "year <= " + window.year
            }
        });
        //console.log("attempting to update map to year", window.year);
    };


    $("body").mousewheel(function(event, delta) {
        if (window.step === 3) {
            var myDelta = parseInt((delta / 10) * -1, 10);
            //console.log(myDelta);

            window.year = window.year + myDelta;
            if (window.year < 1963) {
                window.year = 1963;
            }
            if (window.year > 2013) {
                window.year = 2013;
            }


            // //when we hit 1970, scroll up
            // if (window.year < 1968 && $("#map-canvas").hasClass('fixed_map') ){
            //     $("#map-canvas").removeClass("fixed_map");
            //     $('#wrap').scrollTop(100);
            //     //console.log(parseInt((delta * 5), 10));
                
            //     $('#wrap').animate({
            //         scrollTop: ($(window).height()-100)
            //     }, 0);

            // }

            updateYear();
        }

    });

    updateYear();

});