
var step = 0;

$('#prev').on('click', function(){
    step--;
    //console.log(step);
    if (step < 0) { step = 0 };
    $('#wrap').removeClass().addClass('step-'+step);

    //$.scrollTo( $('.s5'), 800 );
    return false;
});
 $('#next').on('click', function(){
    step++;
    //console.log(step);
    if (step > 6) { step = 6 };
    $('#wrap').removeClass().addClass('step-'+step);

    //$.scrollTo( $('.s1'), 800 );
    return false;
});


var start = 1965;
var end = 2013;
var numyears = end-start;
var $sec = $('section');
var yeartick = ( $sec.height() - $(window).height() ) / numyears;
var $sec_offset = $sec.offset().top;
var year = 1965;

var scrollTimer;
$('#wrap').on('scroll touchmove', function(){
    var self = this;
    calcYears(this);
    //timer for callling scroll after scroll stops
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout( function(){ calcYears(self) } , 100 );
});


var calcYears = function (el){
    pos_in_window = $(el).scrollTop() - $sec_offset;
    year_supplement = Math.round(pos_in_window/yeartick);
    year = start + year_supplement;
    //console.log(year);
    $('#year').text( year );
}