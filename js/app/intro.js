define(["jquery", 'stellar'], function intro($, stellar) {
    "use strict";
    return {

        lastYearSeen: 0,

        init: function() {
            console.log('run init');
            var self = this;

            this.lastYearSeen = window.year;

            $('#wrap').stellar({
                horizontalScrolling: false,
                verticalOffset: 0
            });


            $('.blurb').each(function() {
                var b = $(this);
                var start = b.data('year-start');
                var end = b.data('year-end');
                for (var i = start; i < end; i++) {
                    b.attr('data-v-' + i, true);
                }
            });


            $('#wrap').on('scroll', function() {
                if (window.step === 0) {

                    // //for when we're scrolling down, years going up
                    // var start = self.lastYearSeen;
                    // var end = window.year;

                    // //opposite direction
                    // if (window.year < self.lastYearSeen) {
                    //     start = window.year;
                    //     end = self.lastYearSeen;
                    // }
                    // console.log('');
                    // for (var i = start; i <= end; i++) {
                    //     console.log(i);
                    //     var toShow = $('.blurb[data-year-start="' + i + '"]');
                    //     var toHide = $('.blurb[data-year-end="' + i + '"].shown');

                    //     console.log(toHide);
                    //     toHide.removeClass('shown');
                    //     toShow.addClass('shown');
                    // }
                    // self.lastYearSeen = window.year;

                    var toHide = $('.blurb.shown');
                    var toShow = $('.blurb[data-v-' + window.year + ']');

                    //console.log(toHide, toShow);
                    toHide.removeClass('shown');
                    toShow.addClass('shown');


                    //toHide.removeClass('shown');


                    // $('#wrap').on('scroll', function() {
                    //     if (window.step === 0) {

                    //         // console.log('run scroll');
                    //         //console.log(self.els);
                    //         self.els.each(function() {
                    //             var el = $(this);
                    //             var startYear = +el.data('start');
                    //             var endYear = +el.data('end');

                    //             // only animate if we're in the right year range
                    //             if (window.year >= startYear && window.year <= endYear) {
                    //                 var yPos = -($('#wrap').scrollTop() / el.data('speed'));
                    //                 var offset = $('section.s0').height() * ((100 - el.data('offset')) / 100);
                    //                 if (!isNaN(offset)) {
                    //                     yPos = yPos + offset;
                    //                 }
                    //                 var coords = '50% ' + yPos + 'px';
                    //                 //console.log(coords);
                    //                 el.css({
                    //                     backgroundPosition: coords
                    //                 });
                    //             }

                    //             //console.log(yPos);

                    //         });

                    //     }
                    // });()


                }
            });

            //this.els = $('.spot').not('.no-animate');

            // $('#wrap').on('scroll', function() {
            //     if (window.step === 0) {

            //         // console.log('run scroll');
            //         //console.log(self.els);
            //         self.els.each(function() {
            //             var el = $(this);
            //             var startYear = +el.data('start');
            //             var endYear = +el.data('end');

            //             // only animate if we're in the right year range
            //             if (window.year >= startYear && window.year <= endYear) {
            //                 var yPos = -($('#wrap').scrollTop() / el.data('speed'));
            //                 var offset = $('section.s0').height() * ((100 - el.data('offset')) / 100);
            //                 if (!isNaN(offset)) {
            //                     yPos = yPos + offset;
            //                 }
            //                 var coords = '50% ' + yPos + 'px';
            //                 //console.log(coords);
            //                 el.css({
            //                     backgroundPosition: coords
            //                 });
            //             }

            //             //console.log(yPos);

            //         });

            //     }
            // });


        }
    };
});