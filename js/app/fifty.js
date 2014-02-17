/**
 * Checks if the browser is capabile of doing geolocation, and if so loads up nav geolocation code
 */
define(["jquery"], function fifty($) {
    "use strict";
    return {
        step: 0,
        start: 1964,
        end: 2014,
        numyears: null,
        $sec: $('section'),
        yeartick: null,
        $sec_offset: null,
        year: 1964,
        scrollTimer: null,

        init: function() {
            var self = this;

            this.numyears = this.end - this.start;
            this.yeartick = (this.$sec.height() - $(window).height()) / this.numyears;
            this.$sec_offset = this.$sec.offset().top;

            window.year = this.year;
            window.step = this.step;

            $('#prev').on('click', function() {
                self.step--;
                //console.log(step);
                if (self.step < 0) {
                    self.step = 0;
                }
                $('#wrap').removeClass().addClass('step-' + self.step);
                self.updateSteps();
                //$.scrollTo( $('.s5'), 800 );
                return false;
            });
            $('#next').on('click', function() {
                self.step++;
                //console.log(step);
                if (self.step > 5) {
                    self.step = 5;
                }
                $('#wrap').removeClass().addClass('step-' + self.step);
                self.updateSteps();
                //$.scrollTo( $('.s1'), 800 );
                return false;
            });

            $('#wrap').on('scroll touchmove', function() {
                var thinger = this;
                self.calcYears(this);
                //timer for callling scroll after scroll stops
                clearTimeout(self.scrollTimer);
                self.scrollTimer = setTimeout(function() {
                    self.calcYears(thinger);
                }, 100);
            });


            $('#year-down').on('click', function() {
                self.year = self.year - 1;
                if (self.year < self.start) {
                    self.year = self.start;
                }
                self.updateYear();
                return false;
            });
            $('#year-up').on('click', function() {
                self.year = self.year + 1;
                if (self.year > self.end) {
                    self.year = self.end;
                }
                self.updateYear();
                return false;
            });

            this.updateSteps();

            //to force a particular section to load...
            // this.step = 1;
            // this.updateSteps();
            // this.calcYears();
            // $('#wrap').removeClass().addClass('step-' + this.step);


        },

        updateSteps: function() {
            //var self = this;
            if (this.step === 0) {
                $('#prev').addClass('inactive');
            } else if (this.step === 5) {
                $('#next').addClass('inactive');
            } else {
                $('#next, #prev').removeClass('inactive');
            }
            window.step = this.step;

            $('body').removeClass().addClass('step-' + this.step);

            //try dealing with being previously on the map...
            if (this.step === 2 || this.step === 4) {
                //console.log('i may have been previously on the map');
                /*
                TODO: Recalculate new scroll position and scroll the new pane to where it should be here
                use $.scrollTo?
                 */
            }

            //console.log(this.step);
            $(window).trigger('updateYear:' + this.step);
        },

        calcYears: function(el) {
            var pos_in_window = $(el).scrollTop() - this.$sec_offset;
            var year_supplement = Math.round(pos_in_window / this.yeartick);
            this.year = this.start + year_supplement;
            //console.log(year);
            this.updateYear();
            //console.log(this.step);
        },
        updateYear: function() {
            $('#year').text(this.year);
            window.year = this.year;
            $(window).trigger('updateYear:' + this.step);

            //$('body').removeClass().addClass('year-' + this.year);


        }


    };
});