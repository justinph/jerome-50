define(["jquery", 'd3', 'handlebars'], function($, d3, Handlebars) {
    "use strict";
    /*
    This makes an area graph out of general program grants and applications
    the data is somewhat pre-calculated using general_program.py so that
    we have to keys of data for all grants 
     */

    /*
    big thanks:
    http://vallandingham.me/bubble_charts_in_d3.html
    helped me figure out how to use gravity force
     */

    return function yearsOfSupport(idx) {
        this.idx = idx;
        this.selector = 'section.s' + idx;

        var force, node;

        var damper = 0.3;

        var genres = [];

        var nodes = [];

        var correction = 0;

        var closeTooltipTimeout;

        //set up some target areas on screen
        var targets = {
            0: {
                x: 50,
                y: 50,
            },
            1: {
                x: 150,
                y: 600,
            },
            2: {
                x: 400,
                y: 400,
            },
            3: {
                x: 450,
                y: 600,
            },
            4: {
                x: 580,
                y: 300,
            },
            5: {
                x: 630,
                y: 600,
            },
            6: {
                x: 800,
                y: 300,
            },
            7: {
                x: 100,
                y: 200,
            },
            8: {
                x: 800,
                y: 800,
            },
            9: {
                x: 250,
                y: 250,
            }
        };

        //create a mapped version of where targets will go,
        //do mapping below once we load & know all the genres
        var genreTargets = d3.map();

        this.setupSVG = function() {
            this.width = document.body.clientWidth; //24;
            this.height = $(window).height(); //$(this.selector).height();
            this.svg = d3.select(this.selector).append("svg")
                .attr("width", this.width)
                .attr("height", this.height);


            // the max margin that we let the svg element get set to
            // see bindWatchers method below
            this.scrollMax = $(this.selector).height() - this.height;
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
                    d.radius = 0;
                    genres.push(d.genre);
                    return d;
                })
                .get(function(error, rows) {

                    nodes = rows; //need this to be available to ticks

                    //takes the genres array and condenses it down to unqiue values
                    genres = d3.scale.ordinal().domain(genres).domain();
                    //take the genres and map them to a target
                    genres.forEach(function(g, i) {
                        genreTargets.set(g, targets[i]);
                    });


                    force = d3.layout.force()
                        .gravity(0.08)
                        .friction(0.85)
                        .charge(function(d) {
                            //console.log(d);
                            //console.log(-Math.pow(d.radius, 2.0) / 8);
                            return -Math.pow(d.radius, 2.0) / 8;
                            //return -30;
                        })
                        .nodes(nodes)
                        .size([self.width, self.height])
                        .on("tick", self.tick)
                        .start();

                    node = self.svg.selectAll(".node")
                        .data(rows)
                        .enter().append("circle")
                        .attr("cx", function(d) {
                            return d.x;
                        })
                        .attr("cy", function(d) {
                            return d.y;
                        })
                        .attr("r", function(d) {
                            return d.radius;
                        })
                        .attr('class', function(d) {
                            //console.log(d);
                            var layerName = makeSafeForCSS(d.genre);
                            return 'node layer-' + layerName + ' node-' + d.index;
                        })
                        .on("mouseover", function(d) {

                            window.clearTimeout(closeTooltipTimeout);
                            //this is very rudimentary
                            /*
                            TODO: Make it handle taps and touch events
                            toggle on click/touchs
                             */

                            //Get this bar's x/y values, then augment for the tooltip
                            var xPosition = parseFloat(d3.select(this).attr("cx")) + 20;
                            var yPosition = parseFloat(d3.select(this).attr("cy")) + correction - 60;
                            var map = d3.map(d.supportYears);
                            var data = {
                                genre: d.genre,
                                name: d.name,
                                link: d.link,
                                yearsOfSupport: map.get(window.year),
                                start: d.start,
                                end: d.end,
                            };

                            var source = $('#orgs-tooltip').html();
                            var template = Handlebars.compile(source);
                            $(self.selector + " .tooltip")
                                .html(template(data))
                                .css({
                                    top: yPosition,
                                    left: xPosition
                                }).removeClass('hidden');


                        }).on("mouseout", function() {

                            //Hide the tooltip
                            closeTooltipTimeout = setTimeout(function() {
                                $(self.selector + " .tooltip").addClass('hidden');
                            }, 500);

                        });



                });

        };

        this.tick = function(e) {
            //console.log(e)

            nodes.forEach(function(o, i) {
                //from our targets list, figure out where these should move
                var tgt = genreTargets.get(o.genre);

                //var tgt = targets[o.index % 8];
                o.x = o.x + (tgt.x - o.x) * (damper * 0.1) * e.alpha * 1.1;
                o.y = o.y + (tgt.y - o.y) * (damper * 0.1) * e.alpha * 1.1;
            });

            node.attr("cx", function(d) {
                return d.x;
            })
                .attr("cy", function(d) {
                    return d.y;
                });

        };


        this.bindWatchers = function() {
            var self = this;
            //only update if the updateYear message has the correct window index
            $(window).on('updateYear:' + self.idx, function() {
                self.kickTicks();
                self.updateSVGPos();
            });
        };

        /**
         * what is going on here?
         * because of our fancy side-scrolly thingy, we can't just set the svg element to position fixed
         *  scrolling up/down wont work if we do that
         *  so instead, we have to constantly adjust the margin of the svg element relative to where it should be
         *  this does that by taking the offset and adding it to (or subtracting it from) the margin
         */
        this.updateSVGPos = function() {
            var self = this;
            var svg = $(self.selector + ' svg');
            //read the existing margin offset css, strip 'px', convert to int
            var oldoffset = +svg.css('marginTop').replace(/[^-\d\.]/g, '');
            correction = (svg.offset().top * -1) + oldoffset;
            //don't let the correction get taller than the height - svg element (set somwhere above)
            if (correction > self.scrollMax) {
                correction = this.scrollMax;
            }
            //set the margin correction on the element
            svg.css({
                'marginTop': correction
            });
        };
        /**
         * Recalculates the size of every node, update thems, then kicks off the tick on the d3.force
         * @return null
         */
        this.kickTicks = function() {
            var self = this;
            nodes.forEach(function(o, i) {

                //this is crazy inefficient
                var map = d3.map(o.supportYears);

                var r = map.get(window.year);
                if (!isNaN(r)) {
                    r = r * 1.2;
                    o.radius = r;
                    self.svg.selectAll(".node-" + i)
                        .attr('r', r);
                }

                map = null;

            });
            force.start();
        };

        this.setupSVG();
        this.initData();
        this.bindWatchers();



        function makeSafeForCSS(name) {
            return name.replace(/[^a-z0-9]/g, function(s) {
                var c = s.charCodeAt(0);
                if (c == 32) return '-';
                if (c >= 65 && c <= 90) return '' + s.toLowerCase();
                return '';
                return '__' + ('000' + c.toString(16)).slice(-4);
            });
        }

    };

});