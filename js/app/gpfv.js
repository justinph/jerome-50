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
			this.doApprovedDenied(path);
			this.doGenres(path);
			//console.log(path);
		
			this.initDisplay(selector,path);
		},

		setupSVG: function(){

			this.width =  document.body.clientWidth; //24;
			this.height = $(this.selector).height();
			this.ratio =  this.height/this.width;  //get the ratio we should use for svg transformation
			this.offset = this.width - this.maxHeight;

			console.log(this.ratio, this.height);

			this.x = d3.time.scale().range([0, this.width]);
			this.y = d3.scale.linear().range([this.maxHeight, 0]);

			this.stack = d3.layout.stack()
				.offset("zero")
				.values(function(d) { return d.values; })
				.x(function(d) { return d.date; })
				.y(function(d) { return d.number; });


			this.area = d3.svg.area()
				.interpolate("cardinal")
				.x(function(d) { return this.x(d.year); })
				.y0(function(d) { return this.y(d.y0); })
				.y1(function(d) { return this.y(d.y0 + d.y); });


			this.svg = d3.select(this.selector).append("svg")
				.attr("width", this.width )
				.attr("height", this.height);


		},

		doApprovedDenied: function(path){
			var self = this;

			d3.csv("/data/"+path+"/granted_denied.csv", function(error, data) {
				data.forEach(function(d) {
					d.year = parseDate(d.year);
					d.number = parseInt(d.number,10);
				});
				//console.log(data);

				var layers = self.stack(nest.entries(data));

				self.x.domain(d3.extent(data, function(d) { return d.year; }));
				self.y.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);

				self.svg.selectAll(".layer")
					.data(layers)
					.enter().append("path")
					.attr("class", function(d){ /*console.log(d);*/ return 'layer-'+d.key;})
					.attr("d", function(d) { return self.area(d.values); })
					.attr("transform", "rotate(90), translate(0,-"+self.maxHeight+"), scale("+self.ratio+",1)");


			});
		},

		doGenres: function(path){
			var self = this;

			d3.csv("/data/"+path+"/genres.csv", function(error, data) {
				data.forEach(function(d) {
					d.year = parseDate(d.year);
					d.number = parseInt(d.number,10);
				});
				//console.log(data);

				var layers = self.stack(nest.entries(data));

				self.x.domain(d3.extent(data, function(d) { return d.year; }));
				self.y.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);

				self.svg.selectAll(".layer")
					.data(layers)
					.enter().append("path")
					.attr("class", function(d){ /*console.log(d);*/ return 'layer-'+d.key;})
					.attr("d", function(d) { return self.area(d.values); })
					.attr("transform", "rotate(90), translate(0,-"+self.offset+"), scale("+self.ratio+",-1)");


			});
		},

		initDisplay: function(selector,path){


			d3.csv("/data/"+path+"/base_data.csv")
				.row(function(d) {
					d.year = +d.year;  //convert year into int
					return d;
				})
				.get(function(error, rows) {
					var nested_data = d3.nest()
						.key(function(d) {return d.year;})
						.map(rows, d3.map);
					console.log(nested_data);
					console.log(nested_data.get(2011));

				});



			// d3.csv("/data/"+path+"/base_data.csv", function(d) {
						
			// 	// var nested_data = d3.nest()
			// 	// 	.key(function(d) {return d.year;})
			// 	// 	//.key(function(d) {return d.Animation;})
			// 	// 	//.sortKeys(d3.ascending)
			// 	// 	.entries(data);
			// 	// 	//.map(year, d3.map);
			// 	// console.log(nested_data);
			// 	// console.log(nested_data.key(1965));

			// }, function(error, rows) {
			//   console.log(rows);
			// });
			
			

		}

	};
});
