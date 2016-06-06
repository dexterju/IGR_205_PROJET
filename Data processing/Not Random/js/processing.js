// Vars to set with the GUI
var w = 80; //Width available for 1 column
var h = 20; //Height of 1 line
var file = "data/flowers_numbers.csv"; //Path of the file to process
//////////////////////////////

var svg;
var dataset = [];
var datasetMV = [];
var keysArray = [];
var columnAverage = 0;
var baseColumn = "";
var modifiedColumn = "";

d3.csv(file, function(data) {
	
	data.forEach(function (data, accessor) {
		var row;
		row = {
			id: accessor
		};
		for(var attr in data) {
			if(data.hasOwnProperty (attr)) {
				row[attr] = +data[attr]; //On cast en float
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
			generateMissingValueNotRandomly(dataset);
			console.log(datasetMV);
			display(datasetMV);
		}
	
});

	
function generateMissingValueNotRandomly(data) {
	
	datasetMV = data;
	baseColumn = keysArray[Math.floor(Math.random() * (keysArray.length - 1)) + 1]; //On choisit la colonne aléatoirement
	
	modifiedColumn = baseColumn;
	
	while (modifiedColumn == baseColumn) {
		modifiedColumn = keysArray[Math.floor(Math.random() * (keysArray.length - 1)) + 1];
	}
	
	console.log("Base column : " + baseColumn);
	console.log("Modified column : " + modifiedColumn);
	
	for (var x = 0; x < data.length; x++) {
		columnAverage += data[x][baseColumn];
	}
	
	columnAverage /= data.length;
	console.log(columnAverage);
	
	for (var y = 0; y < data.length; y++) { //Si la valeur de la colonne de base est inférieure à sa moyenne, on passe à NaN la valeur correspondante dans la colonne à modifier
		if (data[y][baseColumn] < columnAverage) {
			datasetMV[y][modifiedColumn] = "NaN";
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