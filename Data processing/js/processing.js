// Vars to set with the GUI
var w = 80; //Width available for 1 column
var h = 20; //Height of 1 line
var rate = 20; //Rate of missing values. Ex : 20 for 20%
var file = "data/flowers.csv"; //Path of the file to process
//////////////////////////////

var svg;
var dataset = [];
var datasetMV = [];
			
d3.csv(file)
	.row(function (d, i) {
		return {
			sepalLength: +d["sepal length"],
			sepalWidth: +d["sepal width"],
			petalLength: +d["petal length"],
			petalWidth: +d["petal width"],
			species: d["species"]
		};
	})
	.get(function(error, rows) {
		console.log("Loaded " + rows.length + " rows");
		
		if (rows.length > 0) {
			dataset = rows; //Store the data
			svg = d3.select("body")
					.append("svg")
					.attr("width", Object.keys(rows[0]).length * w)
					.attr("height", (rows.length * h) + 40);
			generateMissingValue(dataset);
			display(datasetMV);
		}
		
	});
	
function generateMissingValue(data) {
	datasetMV = data;
	for (var x = 0; x < data.length; x++) {
		if ((Math.floor(Math.random() * 100) + 1)  > (100 - rate)) {
			switch (Math.floor(Math.random() * 5) + 1) { //Choose a column randomly
				case 1:
					datasetMV[x].sepalLength = "NaN";
					break;
				case 2:
					datasetMV[x].sepalWidth = "NaN";
					break;
				case 3:
					datasetMV[x].petalLength = "NaN";
					break;
				case 4:
					datasetMV[x].petalWidth = "NaN";
					break;
				case 5:
					datasetMV[x].species = "NaN";
					break;
			}
		}
	}
}
	
function display(data) {
	svg.selectAll("p")                 
        .data(data)
        .enter()
        .append("text")
        .text( function(d,i,j) { return (d.sepalLength + " | " + d.sepalWidth + " | " + d.petalLength + " | " + d.petalWidth + " | " + d.species); } )
        .attr("x", 0)
        .attr("y", function(d,i,j) { return (i * 20) + 40; })
        .attr("font-family", "sans-serif")
        .attr("font-size", "15px")
        .attr("fill", "black");
}