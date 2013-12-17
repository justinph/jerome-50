require(["jquery", "async!http://maps.google.com/maps/api/js?sensor=false!callback"], function travelStudy($) {
	"use strict";

	var map, mapData;
	var mn = new google.maps.LatLng(46.4, -93.790039);
	var MY_MAPTYPE_ID = 'custom_style';
	var tableId = '1ZG7LLuMPO3NDMpwOZZ9WBV3613MpM2gDzvDeQog';
	var featureOpts = [
	{
	  stylers: [
		{ hue: '#343434' },
		{ visibility: 'simplified' },
		{ gamma: 1.0 },
		{ weight: 1.0 }
	  ]
	},
	// {
	//   elementType: 'labels',
	//   stylers: [
	//     { visibility: 'off' }
	//   ]
	// },
	{
	  featureType: 'water',
	  stylers: [
		{ color: '#343434' }
	  ]
	}
	];

	var mapOptions = {
		zoom: 4,
		center: mn,
		// mapTypeControlOptions: {
		//   mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
		// },
		//scrollwheel: false,
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

	map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

	var styledMapOptions = {
		name: 'Custom Style'
	};

	var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);

	map.mapTypes.set(MY_MAPTYPE_ID, customMapType);

	console.log(window.year);

	mapData = new google.maps.FusionTablesLayer({
			query: {
			  select: "Destination",
			  from: tableId, //old demo data: "1JtXOo6Fbfkrd_rY00pcAOg90dH92vqNaACqM5_A",
			  where: "year <= "+window.year
			},
			map: map,
			styleId: 2,
			templateId: 2
		});


	// $(window).on('updateYear:3',function(){
	// 	//if ($('#wrap').hasClass("step-3")){
	// 		updateYear();
	// 	//}
	// });

	$(window).on("updateYear:3", function(){
		console.log('receiving update 3');
		updateYear();
	});

	var updateYear = function updateYear(){
		mapData.setOptions({
			query: {
			  select: "Destination",
			  from: tableId,
			  where: "year <= "+window.year
			}
		  });
		console.log("attempting to update map to year", window.year);
	}

});
