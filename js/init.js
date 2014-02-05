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
        "handlebars": "../vendor/handlebars/handlebars"
        //"handlebars": "../vendor/handlebars/handlebars.amd"
        //"propertyParser":  "../vendor/requirejs-plugins/src/propertyParser"
    },
    'shim': {
        'handlebars': {
            exports: 'Handlebars'
        }
    }
});

/* --------------------------
 Load modules below
 ---------------------------- */
//handles what happens when someone clicks on the share icons in a story
requirejs(["app/fifty"], function(fifty) {
    fifty.init();
});


requirejs(['app/yearsofsupport'], function(YearsOfSupport) {
    new YearsOfSupport(2);
});

requirejs(["app/gpfv"], function(GpFv) {

    var fv = new GpFv(4, 'fv', true);

    var gp = new GpFv(5, 'gp', false);

    //console.log(fv, gp);

});

//at some point this should be updated to not automatically draw the map until it gets on screen
requirejs(["app/travelStudy"]);