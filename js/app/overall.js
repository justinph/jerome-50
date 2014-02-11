define(["jquery", 'd3', 'handlebars'], function($, d3, Handlebars) {
    "use strict";
    /*
		This makes an area graph out of overall data
		 */



    return function Overall(idx) {
        this.idx = idx;
        this.selector = 'section.s' + idx;
        this.maxHeight = 300;
        this.grantees = null;
        this.intro = $(this.selector).find('.textDisplay').html(); //select the parent of .intro
        //this.nested_data;

        this.nested_data = d3.nest();

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



        this.initData = function() {
            var self = this;

            d3.csv("/data/overall.csv")
                .row(function(d) {
                    //goes through all the properties on the object and converts them to ints
                    for (var prop in d) {
                        if (!isNaN(d[prop])) {
                            d[prop] = +d[prop];
                        }
                    }


                    return d;
                })
                .get(function(error, rows) {
                    self.nested_data = d3.nest()
                        .key(function(d) {
                            return d.year;
                        })
                        .map(rows, d3.map);

                    self.doApprovedDeniedClean();
                    self.doAssetBreakdown();
                    self.doAssets();

                });

            //load grantees from the combined csv and turn them into a nice nest

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
                approvedDenied.push({
                    'key': 'denied',
                    'year': year,
                    'number': value[0].applications - value[0].approved
                });
            });

            //console.log(approvedDenied);

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


        /**
         * Generates and displays the centered assets area graph
         */
        this.doAssets = function() {
            var self = this;

            var assets = [];

            self.nested_data.forEach(function(key, value) {
                //console.log(key, value[0].approved);
                var year = parseDate(key);
                assets.push({
                    'key': 'asset',
                    'year': year,
                    'number': value[0].dollars_total
                });
            });

            //console.log(approvedDenied);

            var layers = self.stack(nest.entries(assets));

            this.x.domain(d3.extent(assets, function(d) {
                return d.year;
            }));
            this.y.domain([0, d3.max(assets, function(d) {
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
                .attr("transform", "rotate(90), translate(0,-" + (this.maxHeight + (this.width / 2)) + "), scale(" + self.ratio + ",1)");
            //totally repeating myself and this is crazy dirty... but its fast and works
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
                .attr("transform", "rotate(90), translate(0,-" + ((this.width / 2) - this.maxHeight) + "), scale(" + self.ratio + ",-1)");



        };


        this.doAssetBreakdown = function() {
            var self = this;

            var assetBreakDown = [];


            self.nested_data.forEach(function(key, value) {
                //console.log(key, value[0].approved);
                var year = parseDate(key);
                assetBreakDown.push({
                    'key': 'other',
                    'year': year,
                    'number': value[0].dollars_other
                });
                assetBreakDown.push({
                    'key': 'mn',
                    'year': year,
                    'number': value[0].dollars_mn
                });
                assetBreakDown.push({
                    'key': 'nyc',
                    'year': year,
                    'number': value[0].dollars_nyc
                });

            });

            //console.log(approvedDenied);

            var layers = self.stack(nest.entries(assetBreakDown));

            this.x.domain(d3.extent(assetBreakDown, function(d) {
                return d.year;
            }));
            this.y.domain([0, d3.max(assetBreakDown, function(d) {
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
                .attr("transform", "rotate(90), translate(0,-" + self.offset + "), scale(" + self.ratio + ",-1)");

        };


        this.addWatchers = function() {
            var self = this;
            $(window).on('updateYear:' + self.idx, function() {
                if (window.year >= 1964) {
                    if (typeof self.nested_data === 'object') {
                        var thisYearData = self.nested_data.get(window.year);


                        if (window.year === 1964) {
                            thisYearData[0].intro = self.intro;
                        }

                        //console.log(thisYearData[0]);
                        var source = $('#overall-template').html();
                        var template = Handlebars.compile(source);
                        //console.log(self.selector, template(thisYearData[0]));
                        //push rendered contents to dom
                        $(self.selector + " .textDisplay").html(template(thisYearData[0]));



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

        //this.addWatchers();


    };

});