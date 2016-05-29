// Vars to set with the GUI
var w = 80; //Width available for 1 column
var h = 20; //Height of 1 line
var rate = 20; //Rate of missing values. Ex : 20 for 20%
var file = "data/flowers.csv"; //Path of the file to process
//////////////////////////////

var svg;
var dataset = [];
var datasetMV = [];
var keysArray = [];

d3.csv(file, function(data) {
	
	data.forEach(function (data, accessor) {
		var row;
		row = {
			id: accessor
		};
		for(var attr in data) {
			if(data.hasOwnProperty (attr)) {
				row[attr] = data[attr];
			}
		}
		dataset.push(row);
	});
	
	for (var attr in dataset[0]) {
		keysArray.push(attr);
	}
	
	console.log("Loaded " + dataset.length + " rows");
	
	if (dataset.length > 0) {
			svg = d3.select("body")
					.append("svg")
					.attr("width", Object.keys(dataset[0]).length * w)
					.attr("height", (dataset.length * h) + 40);
			generateMissingValue(dataset);
			console.log(datasetMV);
			display(datasetMV);
		}
	
});

	
function generateMissingValue(data) {
	
	datasetMV = data;
	
	for (var x = 0; x < data.length; x++) {
		
		if ((Math.floor(Math.random() * 100) + 1)  > (100 - rate)) {

			datasetMV[x][keysArray[Math.floor(Math.random() * (keysArray.length - 1)) + 1]] = "NaN";
			
		}
	}
}
	
function display(data) {
	svg.selectAll("p")                 
        .data(data)
        .enter()
        .append("text")
        .text( function(d,i,j) {
			var textResult = "| ";
			for (var k = 1; k < keysArray.length; k++) { //On n'affiche pas l'id
				textResult += d[keysArray[k]] + " | ";
			}
			return (textResult);
		})
        .attr("x", 0)
        .attr("y", function(d,i,j) { return (i * 20) + 40; })
        .attr("font-family", "sans-serif")
        .attr("font-size", "15px")
        .attr("fill", "black");
}