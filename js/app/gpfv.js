define(["jquery", 'd3', 'handlebars'], function($, d3, Handlebars) {
    "use strict";
    /*
		This makes an area graph out of general program grants and applications
		the data is somewhat pre-calculated using general_program.py so that
		we have to keys of data for all grants 
		 */



    return function GpFv(idx, path, doFVGrantees, doGPGrantees) {
        this.idx = idx;
        this.selector = 'section.s' + idx;
        this.path = path;
        this.maxHeight = 300;
        this.doFVGrantees = doFVGrantees;
        this.doGPGrantees = doGPGrantees;
        this.grantees = null;
        this.intro = $(this.selector).find('.textDisplay').html(); //select the parent of .intro


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
                    var self = this;
                    return self.x(d.year);
                })
                .y0(function(d) {
                    var self = this;
                    return self.y(d.y0);
                })
                .y1(function(d) {
                    var self = this;
                    //console.log(d.y0, d.y);

                    return self.y(d.y0 + d.y);
                });




            this.svg = d3.select(this.selector).append("svg")
                .attr("width", this.width)
                .attr("height", this.height);

        };

        /**
         * Takes the already generated nested_data and makes an array suitable for stacking out of it
         * Previously, this had been from a seperate file, but this is no longer necessary
         */
        this.doApprovedDeniedClean = function() {
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

                //make sure no negative numbers
                var deniedCount = value[0].applications - value[0].approved;
                if (deniedCount < 0) {
                    deniedCount = 0;
                }

                approvedDenied.push({
                    'key': 'denied',
                    'year': year,
                    'number': deniedCount
                });
            });


            var layers = self.stack(nest.entries(approvedDenied));

            this.x.domain(d3.extent(approvedDenied, function(d) {
                return d.year;
            }));
            this.y.domain([0, d3.max(approvedDenied, function(d) {
                return d.y0 + d.y;
            })]);

            self.svg.selectAll(".layer")
                .data(layers)
                .enter().append("path")
                .attr("class", function(d) {
                    var layerName = makeSafeForCSS(d.key); //give us cleaner css names
                    return 'layer-' + layerName;
                })
                .attr("d", function(d) {
                    //console.log(d.values);
                    return self.area(d.values);
                })
                .attr("transform", "rotate(90), translate(0,-" + self.maxHeight + "), scale(" + self.ratio + ",1)");

        };


        this.doGenresClean = function() {
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
                    var layerName = makeSafeForCSS(d.key); //give us cleaner css names
                    return 'layer-' + layerName;
                })
                .attr("d", function(d) {
                    return self.area(d.values);
                })
                .attr("transform", "rotate(90), translate(0,-" + self.offset + "), scale(" + self.ratio + ",-1)");


        };


        this.initData = function() {
            var self = this;

            d3.csv("/data/" + this.path + "/base_data.csv")
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
                    d['total dollars'] = commaSeparateNumber(d['dollars mn'] + d['dollars nyc'] + d['dollars other']);

                    d['dollars mn'] = makeK(d['dollars mn']);
                    d['dollars other'] = makeK(d['dollars other']);
                    d['dollars nyc'] = makeK(d['dollars nyc']);


                    return d;
                })
                .get(function(error, rows) {
                    self.nested_data = d3.nest()
                        .key(function(d) {
                            return d.year;
                        })
                        .map(rows, d3.map);


                    self.doApprovedDeniedClean();
                    self.doGenresClean();

                });

            //load grantees from the combined csv and turn them into a nice nest
            if (this.doFVGrantees) {
                //this is for film/video
                d3.csv("/data/" + this.path + "/combined.csv")
                    .row(function(d) {
                        d.year = +d.year;
                        return d;
                    })
                    .get(function(error, rows) {
                        self.grantees = d3.nest()
                            .key(function(d) {
                                return d.location;
                            })
                            .key(function(d) {
                                return d.year;
                            })
                            .map(rows, d3.map);

                    });

            }
            if (this.doGPGrantees) {
                //this is for general program
                d3.csv("/data/" + this.path + "/combined.csv")
                    .row(function(d) {
                        d.year = +d.year;
                        return d;
                    })
                    .get(function(error, rows) {
                        self.grantees = d3.nest()
                            .key(function(d) {
                                return d.year;
                            })
                            .map(rows, d3.map);
                    });

            }
        };

        this.addWatchers = function() {
            var self = this;
            $(window).on('updateYear:' + self.idx, function() {
                if (window.year >= 1963) {
                    if (typeof self.nested_data === 'object') {
                        var thisYearData = self.nested_data.get(window.year);
                        //console.log(thisYearData);
                        if (typeof thisYearData !== 'undefined') {
                            thisYearData[0].doFVGrantees = self.doFVGrantees;
                            thisYearData[0].doGPGrantees = self.doGPGrantees;
                            //helps us get the pluralization right on display
                            if (thisYearData[0].approved > 1){
                                thisYearData[0].approvedPlural = true;
                            } else {
                                thisYearData[0].approvedPlural = false;
                            }
                            if (thisYearData[0].applications > 1){
                                thisYearData[0].applicationsPlural = true;
                            } else {
                                thisYearData[0].applicationsPlural = false;
                            }
                        } else {
                            thisYearData = [{}];
                        }


                        if (window.year === 1963) {
                            thisYearData[0].intro = self.intro;
                        }

                        //console.log(thisYearData[0]);
                        var source = $('#gpfv-template').html();
                        var template = Handlebars.compile(source);
                        //console.log(self.selector, template(thisYearData[0]));
                        //push rendered contents to dom
                        $(self.selector + " .textDisplay").html(template(thisYearData[0]));

                        //probably not the correct spot
                        $('.view-grantees').on('click', function(e) {
                            e.preventDefault();

                            if (self.doFVGrantees) {
                                var location = $(this).data('location');
                                var grantees = self.grantees.get(location).get(window.year);
                                if (grantees) {
                                    //console.log(grantees);
                                    var data = {
                                        grantees: grantees,
                                        location: location,
                                    };
                                    var source = $('#fv-grantees-list').html();
                                    var template = Handlebars.compile(source);
                                    $(self.selector + " .textDisplay").addClass('blurred');
                                    $(self.selector + " .granteesDisplay").html(template(data));
                                    $('.granteesDisplay .close-grantees').click(function() {
                                        $(self.selector + " .granteesDisplay").empty();
                                        $(self.selector + " .textDisplay").removeClass('blurred');
                                    });
                                }

                            } else if (self.doGPGrantees) {
                                //console.log('i should do gp');
                                var grantees = self.grantees.get(window.year);
                                if (grantees) {
                                    //console.log(grantees);
                                    var data = {
                                        grantees: grantees,
                                    };
                                    var source = $('#gp-grantees-list').html();
                                    var template = Handlebars.compile(source);
                                    $(self.selector + " .textDisplay").addClass('blurred');
                                    $(self.selector + " .granteesDisplay").html(template(data));
                                    $('.granteesDisplay .close-grantees').click(function() {
                                        $(self.selector + " .granteesDisplay").empty();
                                        $(self.selector + " .textDisplay").removeClass('blurred');
                                    });
                                }
                            }


                        });

                    } else {
                        console.error('nested data not loaded or not correct object');
                    }
                }
            });
        };

        function makeSafeForCSS(name) {
            return name.replace(/[^a-z0-9]/g, function(s) {
                var c = s.charCodeAt(0);
                if (c == 32) return '-';
                if (c >= 65 && c <= 90) return '' + s.toLowerCase();
                return '';
                return '__' + ('000' + c.toString(16)).slice(-4);
            });
        }

        function commaSeparateNumber(val) {
            while (/(\d+)(\d{3})/.test(val.toString())) {
                val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
            }
            return val;
        }

        function makeK(val) {
            var num = Math.round(val / 1000);
            if (num > 0) {
                return num + "k";
            }
            return false;
        }


        this.setupSVG();
        this.initData();

        this.addWatchers();


    };

});