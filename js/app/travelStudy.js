require(["jquery", "async!http://maps.google.com/maps/api/js?key=AIzaSyAHHC2slaWMzd-bp3TbzYl-QTf_Fq-5-yE&sensor=false!callback", "jquery-mousewheel"], function travelStudy($) {
    "use strict";

    var mySelector = '.s4';

    var map, mapData;
    var mn = new google.maps.LatLng(46.4, -93.790039);
    var MY_MAPTYPE_ID = 'custom_style';
    var tableId = '1ZG7LLuMPO3NDMpwOZZ9WBV3613MpM2gDzvDeQog';
    var featureOpts = [{
            stylers: [{
                hue: '#646361'
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
                color: '#646361'
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

    $(window).on("updateYear:4", function() {
        //console.log('receiving update 4');
        updateYear();
    });

    var updateYear = function updateYear() {
        //console.log('update year called', window.year);
        if (window.year >= 1965) {
            //we want to show the map and arrows!

            $('#year').removeClass('faded');
            $('#year-down, #year-up').removeClass();

            //this is the opposite of what it seems like, because we want to have it overlay
            $(mySelector+' .textDisplay').addClass('show');


            
        } else {

            //not show map and arrows, show intro
            $('#year').addClass('faded');
            $('#year-down').addClass('inactive');

            //this is the opposite of what it seems like, because we want to have it overlay
            $(mySelector+' .textDisplay').removeClass('show');




            //$('#year').removeClass().text(window.year);
        }

        //hide show the element (not just transition) so we can click
        if (window.year >= 1975){
            $(mySelector+' .textDisplay').hide();
        } else  {
            $(mySelector+' .textDisplay').show();
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
        if (window.step === 4) {
            var myDelta = parseInt((delta / 10) * -1, 10);
            //console.log(myDelta);

            window.year = window.year + myDelta;
            if (window.year < 1963) {
                window.year = 1963;
            }
            if (window.year > 2014) {
                window.year = 2014;
            }

            updateYear();
        }

    });

    updateYear();

});