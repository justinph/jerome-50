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

        var nest = d3.nest()
            .key(function(d) {
                return d.key;
            });

        this.setupSVG = function() {
            this.width = document.body.clientWidth; //24;
            this.height = $(this.selector).height();
            this.ratio = this.height / this.width; //get the ratio we should use for svg transformation
            this.offset = this.width - this.maxHeight;


            // this.x = d3.time.scale().range([0, this.width]);
            // this.y = d3.scale.linear().range([this.maxHeight, 0]);

            // this.stack = d3.layout.stack()
            //     .offset("zero")
            //     .values(function(d) {
            //         return d.values;
            //     })
            //     .x(function(d) {
            //         return d.date;
            //     })
            //     .y(function(d) {
            //         return d.number;
            //     });


            // this.area = d3.svg.area()
            //     .interpolate("cardinal")
            //     .x(function(d) {
            //         var self = this;
            //         return self.x(d.year);
            //     })
            //     .y0(function(d) {
            //         var self = this;
            //         return self.y(d.y0);
            //     })
            //     .y1(function(d) {
            //         var self = this;
            //         //console.log(d.y0, d.y);

            //         return self.y(d.y0 + d.y);
            //     });




            this.svg = d3.select(this.selector).append("svg")
                .attr("width", this.width)
                .attr("height", this.height);

        };


        this.initData = function() {
            var self = this;

            d3.csv("/data/yearsofsupport.csv")
                .row(function(d) {
                    //goes through all the properties on the object and converts them to ints
                    for (var prop in d) {
                        if (!isNaN(d[prop])) {
                            d[prop] = +d[prop];
                        }
                    }

                    d.genres = [];
                    //loop through again and convert 'genre-Someting' into the genre sub-object
                    for (prop in d) {
                        //console.log(prop.substr(0, 6));
                        if (prop.substr(0, 6) === 'genre-') {
                            d.genres.push({
                                name: prop.substr(6, 1000),
                                value: d[prop]
                            });
                            //console.log(prop.substr(6, 1000));
                        }
                    }

                    // //calculate total dollars
                    // d['total dollars'] = commaSeparateNumber(d['dollars mn'] + d['dollars nyc'] + d['dollars other']);

                    // d['dollars mn'] = makeK(d['dollars mn']);
                    // d['dollars other'] = makeK(d['dollars other']);
                    // d['dollars nyc'] = makeK(d['dollars nyc']);


                    return d;
                })
                .get(function(error, rows) {
                    self.nested_data = d3.nest()
                        .key(function(d) {
                            return d.year;
                        })
                        .map(rows, d3.map);




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


            this.setupSVG();
            this.initData();



        };

    };

});