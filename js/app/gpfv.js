define(["jquery", 'd3', 'handlebars'], function generalProgram($, d3, Handlebars) {
    "use strict";
    /*
		This makes an area graph out of general program grants and applications
		the data is somewhat pre-calculated using general_program.py so that
		we have to keys of data for all grants 
		 */

    var parseDate = d3.time.format("%Y").parse;

    var nest = d3.nest()
        .key(function(d) {
            return d.key;
        });

    return {
        maxHeight: 300,
        nested_data: null,
        //hbar: handlebars.compile($('#fv-template').html()),

        init: function(idx, path) {
            this.idx = idx;

            this.selector = 'section.s' + idx;
            this.setupSVG();
            this.initData(this.selector, path);

            this.addWatchers();

        },

        setupSVG: function() {

            this.width = document.body.clientWidth; //24;
            this.height = $(this.selector).height();
            this.ratio = this.height / this.width; //get the ratio we should use for svg transformation
            this.offset = this.width - this.maxHeight;

            console.log(this.ratio, this.height);

            this.x = d3.time.scale().range([0, this.width]);
            this.y = d3.scale.linear().range([this.maxHeight, 0]);

            this.stack = d3.layout.stack()
                .offset("zero")
                .values(function(d) {
                    return d.values;
                })
                .x(function(d) {
                    return d.date;
                })
                .y(function(d) {
                    return d.number;
                });


            this.area = d3.svg.area()
                .interpolate("cardinal")
                .x(function(d) {
                    return this.x(d.year);
                })
                .y0(function(d) {
                    return this.y(d.y0);
                })
                .y1(function(d) {
                    return this.y(d.y0 + d.y);
                });


            this.svg = d3.select(this.selector).append("svg")
                .attr("width", this.width)
                .attr("height", this.height);


        },

        /**
         * Takes the already generated nested_data and makes an array suitable for stacking out of it
         * Previously, this had been from a seperate file, but this is no longer necessary
         */
        doApprovedDeniedClean: function() {
            var self = this;

            var approvedDenied = [];

            self.nested_data.forEach(function(key, value) {
                //console.log(key, value[0].approved);
                var year = parseDate(key);
                approvedDenied.push({
                    'key': 'granted',
                    'year': year,
                    'number': value[0].approved
                });
                approvedDenied.push({
                    'key': 'denied',
                    'year': year,
                    'number': value[0].applications - value[0].approved
                });
            });

            //console.log(approvedDenied);

            var layers = self.stack(nest.entries(approvedDenied));

            self.x.domain(d3.extent(approvedDenied, function(d) {
                return d.year;
            }));
            self.y.domain([0, d3.max(approvedDenied, function(d) {
                return d.y0 + d.y;
            })]);


            self.svg.selectAll(".layer")
                .data(layers)
                .enter().append("path")
                .attr("class", function(d) { /*console.log(d);*/
                    return 'layer-' + d.key;
                })
                .attr("d", function(d) {
                    return self.area(d.values);
                })
                .attr("transform", "rotate(90), translate(0,-" + self.maxHeight + "), scale(" + self.ratio + ",1)");

        },

        doGenresClean: function() {
            var self = this;

            var genres = [];

            self.nested_data.forEach(function(key, value) {
                //console.log(key, value[0].genres);
                var year = parseDate(key);

                value[0].genres.forEach(function(d) {
                    //console.log(d);
                    genres.push({
                        'key': d.name,
                        'year': year,
                        'number': d.value
                    });
                });


            });

            //console.log(genres);

            var layers = self.stack(nest.entries(genres));

            self.x.domain(d3.extent(genres, function(d) {
                return d.year;
            }));
            self.y.domain([0, d3.max(genres, function(d) {
                return d.y0 + d.y;
            })]);

            self.svg.selectAll(".layer")
                .data(layers)
                .enter().append("path")
                .attr("class", function(d) { /*console.log(d);*/
                    return 'layer-' + d.key;
                })
                .attr("d", function(d) {
                    return self.area(d.values);
                })
                .attr("transform", "rotate(90), translate(0,-" + self.offset + "), scale(" + self.ratio + ",-1)");


        },


        initData: function(selector, path) {
            var self = this;

            d3.csv("/data/" + path + "/base_data.csv")
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

                    //calculate total dollars
                    d['total dollars'] = d['dollars mn'] + d['dollars nyc'] + d['dollars other'];
                    return d;
                })
                .get(function(error, rows) {
                    self.nested_data = d3.nest()
                        .key(function(d) {
                            return d.year;
                        })
                        .map(rows, d3.map);
                    //console.log(self.nested_data);
                    //console.log(self.nested_data.get(2011));

                    self.doApprovedDeniedClean();
                    self.doGenresClean();

                });
        },
        addWatchers: function() {
            var self = this;
            $(window).on('updateYear:' + self.idx, function() {
                if (window.year > 1964) {
                    if (typeof self.nested_data === 'object') {
                        var thisYearData = self.nested_data.get(window.year);
                        //console.log(thisYearData);
                        var source = $('#gpfv-template').html();
                        var template = Handlebars.compile(source);
                        //console.log(self.selector, template(thisYearData[0]));
                        //push rendered contents to dom
                        //$(self.selector).html(template(thisYearData[0]));
                        $(self.selector + " .textDisplay").html(template(thisYearData[0]));

                    } else {
                        console.error('nested data not loaded or not correct object');
                    }
                }
            });
        }

    };
});