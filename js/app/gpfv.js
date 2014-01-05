define(["jquery", 'd3'], function generalProgram($, d3) {
	"use strict";
		/*
		This makes an area graph out of general program grants and applications
		the data is somewhat pre-calculated using general_program.py so that
		we have to keys of data for all grants 
		 */

	return {
		init: function(selector,path){
			this.selector = selector;
			this.doWork(path);

		},
		doWork: function(path){
			var margin = {top: 0, right: 0, bottom: 0, left: 0},
				width =  document.body.clientWidth,
				height = $(this.selector).height(),
				ratio = height/$(window).height();  //get the ratio we should use for svg transformation


			// console.log(height, width);

			var maxHeight = 300;

			var parseDate = d3.time.format("%Y").parse;

			var x = d3.time.scale()
				.range([0, width]);

			var y = d3.scale.linear()
				.range([maxHeight, 0]);

			var stack = d3.layout.stack()
				.offset("zero")
				.values(function(d) { return d.values; })
				.x(function(d) { return d.date; })
				.y(function(d) { return d.number; });

			var nest = d3.nest()
				.key(function(d) { return d.key; });
			 
			var area = d3.svg.area()
				.interpolate("cardinal")
				.x(function(d) { return x(d.year); })
				.y0(function(d) { return y(d.y0); })
				.y1(function(d) { return y(d.y0 + d.y); });

			var svg = d3.select(this.selector).append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom);

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
					.attr("transform", "rotate(90), translate(0,-"+maxHeight+"), scale("+ratio+",1)");


			});
		}

	};
});
