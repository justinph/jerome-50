define(["jquery", ], function intro($) {
    "use strict";
    return {

        init: function() {
            console.log('run init');
            var self = this;

            this.els = $('.spot').not('.no-animate');

            $('#wrap').on('scroll', function() {
                if (window.step === 0) {

                    // console.log('run scroll');
                    //console.log(self.els);
                    self.els.each(function() {
                        var el = $(this);
                        var startYear = +el.data('start');
                        var endYear = +el.data('end');

                        // only animate if we're in the right year range
                        if (window.year >= startYear && window.year <= endYear) {
                            var yPos = -($('#wrap').scrollTop() / el.data('speed'));
                            var offset = $('section.s0').height() * ((100 - el.data('offset')) / 100);
                            if (!isNaN(offset)) {
                                yPos = yPos + offset;
                            }
                            var coords = '50% ' + yPos + 'px';
                            //console.log(coords);
                            el.css({
                                backgroundPosition: coords
                            });
                        }

                        //console.log(yPos);

                    });

                }
            });


        }
    };
});