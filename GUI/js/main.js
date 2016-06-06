// loading module
var fs = require('fs');

var d3 = require("d3"),
    jsdom = require("jsdom");

var document = jsdom.jsdom(),
    p = d3.select(document.body).append("p");


// Vars to set with the GUI
var w = 80; //Width available for 1 column
var h = 20; //Height of 1 line
//////////////////////////////


var dataset = [];
var datasetMV = [];

function generate() {
    p.selectAll('p').remove();
    datasetMV = [];
    file = document.querySelector('#fileDialog').value
    random_state = document.querySelector('#randomState').value
    rate = document.querySelector('#rate').value
    load_file(file, random_state, rate)


}


function load_file(file, random_state, rate) {
    // body...

    var csvData = d3.csv.parse(fs.readFileSync(file, { encoding: 'utf-8' }).trim());
    var data = csvData.slice(0, 200).map(function(d) {
        return {
            sepalLength: +d["sepal length"],
            sepalWidth: +d["sepal width"],
            petalLength: +d["petal length"],
            petalWidth: +d["petal width"],
            species: d["species"]
        };

    })
    generateMissingValue(data, random_state, rate);
    display(datasetMV);


}

function generateMissingValue(data, random_state, rate) {
    datasetMV = data;
    for (var x = 0; x < data.length; x++) {
        if ((Math.floor(Math.random(random_state) * 100) + 1) > (100 - rate)) {
            switch (Math.floor(Math.random(random_state) * 5) + 1) { //Choose a column randomly
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
    p.selectAll("p")
        .data(data)
        .enter()
        .append("p")
        .text(function(d, i, j) {
            return (d.sepalLength + " | " + d.sepalWidth + " | " + d.petalLength + " | " + d.petalWidth + " | " + d.species + '\n');
        })
        .attr("x", 0)
        .attr("y", function(d, i, j) {
            return (i * 20) + 40;
        })

}

function saveFile(name) {
    var chooser = document.querySelector(name);
    chooser.addEventListener("change", function(evt) {
        fs.writeFile(this.value + ".csv", d3.csv.format(datasetMV), function(err) {
            alert("Export successfully");
        });
    }, false);
    ß
}

saveFile('#saveFile');
