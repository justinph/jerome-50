"use strict";
requirejs.config({
    "baseUrl": "/js/",
    "paths": {
        "app": "app",
        "jquery": "../vendor/jquery/jquery",
        "d3": "../vendor/d3/d3",
        "hammer": "../vendor/dist/hammer",
        "async": "../vendor/requirejs-plugins/src/async",
        "goog":  "../vendor/requirejs-plugins/src/async" //,
        //"propertyParser":  "../vendor/requirejs-plugins/src/propertyParser"
    },
    "shim": {
        "d3": {
            exports: 'd3'
        },
    }
});

/* --------------------------
 Load modules below
 ---------------------------- */
//handles what happens when someone clicks on the share icons in a story
requirejs(["app/fifty"], function (fifty) {
    fifty.init();
});

requirejs(["app/gpfv","app/travelStudy"], function(gpfv, travelStudy){
    //generalProgram.init('section.s1');
    // gpfv.init('section.s2');  // overall
    // gpfv.init('section.s3');  // organizations

    gpfv.init('section.s5');
    //gpfv.init('section.s6');
    //travelStudy();
});