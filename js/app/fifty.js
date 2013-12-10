/**
 * Checks if the browser is capabile of doing geolocation, and if so loads up nav geolocation code 
 */
define(["jquery"], function navWeatherCheck($) {
    "use strict";
    return {
        step: 0,
        start: 1965,
        end: 2013,
        numyears: null,
        $sec: $('section'),
        yeartick: null,
        $sec_offset: null,
        year: 1965,
        scrollTimer: null,

        init: function(){
            var self = this;

            this.numyears = this.end - this.start;
            this.yeartick = ( this.$sec.height() - $(window).height() ) / this.numyears;
            this.$sec_offset = this.$sec.offset().top;


            $('#prev').on('click', function(){
                self.step--;
                //console.log(step);
                if (self.step < 0) { self.step = 0; }
                $('#wrap').removeClass().addClass('step-'+self.step);
                self.updateSteps();
                //$.scrollTo( $('.s5'), 800 );
                return false;
            });
            $('#next').on('click', function(){
                self.step++;
                //console.log(step);
                if (self.step > 5) { self.step = 5; }
                $('#wrap').removeClass().addClass('step-'+self.step);
                self.updateSteps();
                //$.scrollTo( $('.s1'), 800 );
                return false;
            });

            $('#wrap').on('scroll touchmove', function(){
                var thinger = this;
                self.calcYears(this);
                //timer for callling scroll after scroll stops
                clearTimeout(self.scrollTimer);
                self.scrollTimer = setTimeout( function(){ self.calcYears(thinger); } , 100 );
            });


        },

        updateSteps: function(){
            //var self = this;
            if (this.step === 0){
                $('#prev').addClass('inactive');
            } else if (this.step === 6){
                $('#next').addClass('inactive');
            } else {
                $('#next, #prev').removeClass('inactive');
            }
        },

        calcYears: function (el){
            var pos_in_window = $(el).scrollTop() - this.$sec_offset;
            var year_supplement = Math.round(pos_in_window/this.yeartick);
            this.year = this.start + year_supplement;
            //console.log(year);
            $('#year').text( this.year );
            //console.log(this.step);
        }


    };
});

