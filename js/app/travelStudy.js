require(["jquery", "async!http://maps.google.com/maps/api/js?sensor=false!callback"], function travelStudy($) {
	"use strict";

	var map, mapData;
	var mn = new google.maps.LatLng(46.4, -93.790039);
	var MY_MAPTYPE_ID = 'custom_style';
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
	    scrollwheel: false,
		disableDefaultUI: true,
		zoomControl: true,
		panControl: false,
		streetViewControl: false,
		zoomControlOptions: {
		    style: google.maps.ZoomControlStyle.LARGE,
		    position: google.maps.ControlPosition.LEFT_CENTER
		},
		mapTypeId: MY_MAPTYPE_ID
	};

	map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

	var styledMapOptions = {
		name: 'Custom Style'
	};

	var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);

	map.mapTypes.set(MY_MAPTYPE_ID, customMapType);

	mapData = new google.maps.FusionTablesLayer({
		    query: {
		      select: "col4",
		      from: "1JtXOo6Fbfkrd_rY00pcAOg90dH92vqNaACqM5_A"
		    },
		    map: map,
		    styleId: 2,
		    templateId: 2
		});

});
