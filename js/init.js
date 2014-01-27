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
            'exports': 'Handlebars'
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

requirejs(["app/gpfv"], function(GpFv) {
    //generalProgram.init('section.s1');
    // gpfv.init('section.s2');  // overall
    // gpfv.init('section.s3');  // organizations

    /*
TODO:
This needs to be reworked to create new instances of the gpfv module
see: http://stackoverflow.com/questions/18317569/requirejs-load-multiple-instances-of-module

 */

    var fv = new GpFv(4, 'fv');

    var gp = new GpFv(5, 'gp');

    //console.log(fv, gp);

    //gpfv.init('section.s6');
});

//at some point this should be updated to not automatically draw the map until it gets on screen
requirejs(["app/travelStudy"], function(travelStudy) {});