"use strict";
requirejs.config({
    "baseUrl": "/js/",
    "paths": {
        "app": "app",
        "jquery": "../vendor/jquery/jquery",
        "d3": "../vendor/d3/d3",
        "hammer": "../vendor/dist/hammer"
        //,
        //"jquery-pjax": "../vendor/jquery-pjax/jquery.pjax",
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

requirejs(["app/generalProgram"], function(generalProgram){
    generalProgram.init('section.s1');
    generalProgram.init('section.s2');
    generalProgram.init('section.s3');
    generalProgram.init('section.s4');
    generalProgram.init('section.s5');
    generalProgram.init('section.s6');
    generalProgram.init('section.s7');

});