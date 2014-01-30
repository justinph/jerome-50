define(["jquery", 'd3'], function($, d3) {
    "use strict";
    /*
	This makes an area graph out of general program grants and applications
	the data is somewhat pre-calculated using general_program.py so that
	we have to keys of data for all grants 
	 */

    return function yearsOfSupport(idx) {
        this.idx = idx;
        this.selector = 'section.s' + idx;

        var colorScale = d3.scale.category10();

        var bubble;


        this.setupSVG = function() {
            this.width = document.body.clientWidth; //24;
            this.height = $(window).height(); //$(this.selector).height();

            console.log($(window).height());

            this.svg = d3.select(this.selector).append("svg")
                .attr("width", this.width)
                .attr("height", this.height);

            bubble = d3.layout.pack()
                .sort(null)
                .size([this.width, this.height])
                .padding(1.5);



            // the max margin that we let the svg element get set to
            // see bindWatchers method below
            this.scrollMax = $(this.selector).height() - this.height;
            console.log(this.scrollMax);
        };

        //create an object with props for each year with a value of 0
        //we'll use this to clone to make our support years
        var BaseYears = function() {
            for (var i = 1964; i <= 2014; i++) {
                this[i] = 0;
            }
        };


        this.initData = function() {
            var self = this;
            //console.log('doing init');

            d3.csv("/data/yearsofsupport.csv")
                .row(function(d) {
                    //goes through all the properties on the object and converts them to ints
                    for (var prop in d) {
                        if (!isNaN(d[prop])) {
                            d[prop] = +d[prop];
                        }
                    }

                    d.supportYears = new BaseYears();

                    var yearcount = 0;
                    for (var i = d.start; i <= d.end; i++) {
                        d.supportYears[i] = yearcount;
                        yearcount++;
                    }


                    return d;
                })
                .get(function(error, rows) {
                    //console.log(rows);
                    // self.nested_data = d3.nest()
                    //     .key(function(d) {
                    //         return d.year;
                    //     })
                    //     .map(rows, d3.map);



                    var circles = self.svg.selectAll("circle")
                        .data(rows)
                        .enter()
                        .append("circle");


                    var circleAttributes = circles
                        .attr('cx', function(d, i) {
                            //console.log(d, i);
                            return (i + 1) * 10 + 50;
                        })
                        .attr('cy', function(d, i) {
                            // rand = Math.random();
                            // if (rand < 0.3) {
                            //     return (100 * Math.random()) + 100;
                            // } else if (rand > 0.7) {
                            //     return (100 * Math.random()) + 500;

                            // } else {
                            //     return (100 * Math.random()) + 300;
                            // }
                            return i * 1.5 + 50;
                        })
                        .attr("r", 0)
                        .style("fill", function(d, i) {
                            return colorScale(i);
                        });



                });

            //     //load grantees from the combined csv and turn them into a nice nest
            //     if (this.showGranteeLinks) {
            //         d3.csv("/data/" + this.path + "/combined.csv")
            //             .row(function(d) {
            //                 d.year = +d.year;
            //                 return d;
            //             })
            //             .get(function(error, rows) {
            //                 self.grantees = d3.nest()
            //                     .key(function(d) {
            //                         return d.location;
            //                     })
            //                     .key(function(d) {
            //                         return d.year;
            //                     })
            //                     .map(rows, d3.map);

            //             });

            //     }
            // };




        };


        this.bindWatchers = function() {
            var self = this;
            var svg = $(self.selector + ' svg');

            /*TODO:
            make this only update when the thing is in the viewport or going to be in the viewport shortly
            */
            $('#wrap').on('scroll', function() {

                /*
                what is going on here?
                
                because of our fancy side-scrolly thingy, we can't just set the svg element to position fixed
                scrolling up/down wont work if we do that
                so instead, we have to constantly adjust the margin of the svg element relative to where it should be
                this does that by taking the offset and adding it to (or subtracting it from) the margin
                */

                //read the existing margin offset css, strip 'px', convert to int
                var oldoffset = +svg.css('marginTop').replace(/[^-\d\.]/g, '');
                var correction = (svg.offset().top * -1) + oldoffset;
                //don't let the correction get taller than the height - svg element (set somwhere above)
                if (correction > self.scrollMax) {
                    correction = this.scrollMax;
                }
                //set the margin correction on the element
                svg.css({
                    'marginTop': correction
                });



                //adjust the size of the circles as the document changes
                d3.selectAll("circle")
                    .transition()
                    .duration(200)
                    .attr("r", function(d) {
                        //console.log(d);
                        var map = d3.map(d.supportYears);
                        //console.log(map.has(year));
                        var support = map.get(window.year);
                        if (isNaN(support)) {
                            support = 0;
                        }
                        //console.log(support * 3);
                        //console.log(map.value(year));
                        //var support = d.supportYears[year.toString()];
                        //console.log(support);
                        return (support * 3);
                    });

            });
        };

        this.setupSVG();
        this.initData();
        this.bindWatchers();

    };

});