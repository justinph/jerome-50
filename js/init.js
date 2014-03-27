"use strict";
requirejs.config({
    "baseUrl": "/js/",
    "paths": {
        "app": "app",
        "jquery": "../vendor/jquery/jquery",
        "d3": "../vendor/d3/d3",
        "hammer": "../vendor/dist/hammer",
        "async": "../vendor/requirejs-plugins/src/async",
        "goog": "../vendor/requirejs-plugins/src/async", //,
        "handlebars": "../vendor/handlebars/handlebars",
        'jquery-mousewheel': "../vendor/jquery-mousewheel/jquery.mousewheel",
    },
    'shim': {
        'handlebars': {
            exports: 'Handlebars'
        },
    }
});

/* --------------------------
 Load modules below
 ---------------------------- */
//handles what happens when someone clicks on the share icons in a story
requirejs(["app/fifty"], function(fifty) {
    fifty.init();
});

// requirejs(["app/intro"], function(intro) {
//     intro.init();
// });

requirejs(["app/overall"], function(Overall) {
    new Overall(1);
});


requirejs(['app/yearsofsupport'], function(YearsOfSupport) {
    new YearsOfSupport(3);
});
requirejs(["app/gpfv"], function(GpFv) {

    var gp = new GpFv(2, 'gp', false, true);

    var fv = new GpFv(5, 'fv', true, false);

    //console.log(fv, gp);

});

//at some point this should be updated to not automatically draw the map until it gets on screen
requirejs(["app/travelStudy"]);