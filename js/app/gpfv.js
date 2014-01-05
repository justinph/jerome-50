define(["jquery", 'd3'], function generalProgram($, d3) {
	"use strict";
		/*
		This makes an area graph out of general program grants and applications
		the data is somewhat pre-calculated using general_program.py so that
		we have to keys of data for all grants 
		 */
		
	var parseDate = d3.time.format("%Y").parse;

	var nest = d3.nest()
		.key(function(d) { return d.key; });

	return {
		maxHeight: 300,

		init: function(selector,path){
			this.selector = selector;

			this.setupSVG();

			this.doWork(path);

		},

		setupSVG: function(){

			this.width =  document.body.clientWidth,
			this.height = $(this.selector).height(),
			this.ratio = this.height/$(window).height();  //get the ratio we should use for svg transformation


			// console.log(height, width);

			//this.maxHeight = 300;


		}, 

		doWork: function(path){
			var self = this;
			// var margin = {top: 0, right: 0, bottom: 0, left: 0},
			// 	width =  document.body.clientWidth,
			// 	height = $(this.selector).height(),
			// 	ratio = height/$(window).height();  //get the ratio we should use for svg transformation


			// console.log(height, width);

			// var maxHeight = 300;


			var x = d3.time.scale()
				.range([0, this.width]);

			var y = d3.scale.linear()
				.range([this.maxHeight, 0]);

			var stack = d3.layout.stack()
				.offset("zero")
				.values(function(d) { return d.values; })
				.x(function(d) { return d.date; })
				.y(function(d) { return d.number; });

			 
			var area = d3.svg.area()
				.interpolate("cardinal")
				.x(function(d) { return x(d.year); })
				.y0(function(d) { return y(d.y0); })
				.y1(function(d) { return y(d.y0 + d.y); });

			var svg = d3.select(this.selector).append("svg")
				.attr("width", this.width )
				.attr("height", this.height);

			d3.csv("/data/"+path+"/granted_denied.csv", function(error, data) {
				data.forEach(function(d) {
					d.year = parseDate(d.year);
					d.number = parseInt(d.number,10);
				});
				//console.log(data);

				var layers = stack(nest.entries(data));

				x.domain(d3.extent(data, function(d) { return d.year; }));
				y.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);

				svg.selectAll(".layer")
					.data(layers)
					.enter().append("path")
					.attr("class", function(d){ /*console.log(d);*/ return 'layer-'+d.key;})
					.attr("d", function(d) { return area(d.values); })
					.attr("transform", "rotate(90), translate(0,-"+self.maxHeight+"), scale("+self.ratio+",1)");


			});
		}

	};
});
