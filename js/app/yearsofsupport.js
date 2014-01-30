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

        var parseDate = d3.time.format("%Y").parse;

        var colorScale = d3.scale.category10();


        var nest = d3.nest()
            .key(function(d) {
                return d.key;
            });

        this.setupSVG = function() {
            this.width = document.body.clientWidth; //24;
            this.height = $(this.selector).height();
            this.ratio = this.height / this.width; //get the ratio we should use for svg transformation
            this.offset = this.width - this.maxHeight;

            this.svg = d3.select(this.selector).append("svg")
                .attr("width", this.width)
                .attr("height", this.height);

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
            console.log('doing init');

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
                    };


                    return d;
                })
                .get(function(error, rows) {
                    console.log(rows);
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
                            console.log(d, i);
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
                        .attr("r", 20)
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


        this.setupSVG();
        this.initData();


    };

});