// create variables for global usage
var brushCell;
var modeBrush = true;
var brush;

function matrix1() {
    var width = 460,
        size = 110,
        padding = 19.5;

    var x = d3.scale.linear()
        .range([padding / 2, size - padding / 2]);

    var y = d3.scale.linear()
        .range([size - padding / 2, padding / 2]);

    var z = d3.scale.linear()
        .domain([0, 1])
        .range([1, 9]);

    var color = d3.scale.category10();
    d3.csv("data_generated.csv", function(error, data) {
        if (error) throw error;
        data.forEach(function(d) {
            d.sepalLength = +d["sepalLength"];
            d.sepalWidth = +d["sepalWidth"];
            d.petalLength = +d["petalLength"];
            d.petalWidth = +d["petalWidth"];
        });

        var domainByTrait = {},
            traits = d3.keys(data[0]).filter(function(d) {
                return d !== "species";
            }),
            n = traits.length;

        traits.forEach(function(trait) {
            domainByTrait[trait] = d3.extent(data, function(d) {
                return d[trait];
            });
        });

        element = document.getElementById("matrix");
        element2 = document.getElementById("overview");

        var div = d3.select(element).append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
        d3.select(element).selectAll("svg").remove();
        // if (div_g == true) {
        //     d3.select(element).selectAll("svg").remove();
        // }

        brush = d3.svg.brush()
            .x(x)
            .y(y)
            .on("brushstart", brushstart)
            .on("brush", brushmove)
            .on("brushend", brushend);

        var svg = d3.select(element).append("svg")
            .attr("id", "zone")
            .attr("width", size * n + padding)
            .attr("height", size * n + padding)
            .append("g")
            .attr("transform", "translate(" + padding + "," + padding / 2 + ")");
        d3.select(element2).selectAll("svg").remove()

        var svg_zoom = d3.select(element2).append("svg")
            .attr("id", "zone_zoom")
            .attr("width", size * n + padding)
            .attr("height", size * n + padding)
            .append("use").attr("xlink:href", "#toZoom")
            .attr("transform", "scale(" + 3 + ")");

        var cell = svg.selectAll(".cell")
            .data(cross(traits, traits))
            .enter().append("g")
            .attr("class", "cell")
            .attr("transform", function(d) {
                return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")";
            })
            .each(plot);

        // Titles for the diagonal.
        cell.filter(function(d) {
                return d.i === d.j;
            }).append("text")
            .attr("x", padding)
            .attr("y", padding)
            .attr("dy", ".71em")
            .text(function(d) {
                return d.x;
            });


        cell.call(brush);

        function brushstart(p) {

            if (brushCell !== this) {
                // zoomed(this)
                d3.select(brushCell).call(brush.clear());
                x.domain(domainByTrait[p.x]);
                y.domain(domainByTrait[p.y]);
                brushCell = this;
            }
            zoomed(brushCell)

        }

        // Highlight the selected circles.
        function brushmove(p) {
            var e = brush.extent();
            svg.selectAll("circle").classed("hidden_circle", function(d) {
                return e[0][0] > d[p.x] || d[p.x] > e[1][0] || e[0][1] > d[p.y] || d[p.y] > e[1][1];
            });
        }

        // If the brush is empty, select all circles.
        function brushend() {
            if (brush.empty()) svg.selectAll(".hidden_circle").classed("hidden_circle", false);
        }

        function zoomed(clickedCell) {

            console.log("zommed!")
                // var clickedCell = this
            console.log("x:" + d3.transform(d3.select(clickedCell).attr("transform")).translate[0])
            var x_position = (d3.transform(d3.select(clickedCell).attr("transform")).translate[0] / size) * (size * 3) + padding / 2 // get position of this element
            var y_position = (d3.transform(d3.select(clickedCell).attr("transform")).translate[1] / size) * (size * 3)
            d3.selectAll(".cell").each(function() {
                var currCell = this;
                // var rect = this.getBoundingClientRect() // html element
                svg_zoom
                    .attr("transform", "translate(" + (-x_position + 50) + "," + (-y_position + 50) + ")scale(3.0)")
                d3.select(this).attr("id", function() {
                    return (currCell === clickedCell) ? "toZoom" : null;
                });
            });
            d3.selectAll(".x.axis").each(function() {
                var x_axis = console.log(d3.transform(d3.select(this).attr("transform")).translate[0]);
            })

        }

        function plot(p) {
            var cell = d3.select(this);
            // cell.on("click", zoomed);
            var tot = 0,
                pres = 0,
                abs = 0,
                dispSize = 3,
                absX = 0,
                absY = 0,
                cx, cy, sizeX, sizeY;


            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .innerTickSize(size - padding / 2)
                .outerTickSize(0)
                .tickPadding(0)
                .ticks(4);

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .innerTickSize(-size + padding / 2)
                .outerTickSize(0)
                .tickPadding(0)
                .ticks(4);


            x.domain(domainByTrait[p.x]);
            y.domain(domainByTrait[p.y]);
            cell.append("g")
                .attr("class", "y axis")
                // .style("fill", "steelblue")
                .call(xAxis);

            cell.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + padding / 2 + " ,0)")
                // .style("fill", "red")
                .call(yAxis);

            cell.append("rect")
                .attr("class", "frame")
                .attr("x", padding / 2)
                .attr("y", padding / 2)
                .attr("width", size - padding)
                .attr("height", size - padding);
            // .on("click", zoomed);

            // POLYLINE INIT
            var reglage = 50;

            var px = +((d3.max(domainByTrait[p.x]) - d3.min(domainByTrait[p.x])) / reglage).toFixed(12);
            var py = +((d3.max(domainByTrait[p.y]) - d3.min(domainByTrait[p.y])) / reglage).toFixed(12);
            var pxData = [],
                pyData = [];
            for (var i = d3.min(domainByTrait[p.x]); i < d3.max(domainByTrait[p.x]); i = +(i + px).toFixed(12)) {
                pxData.push(0);

            }
            for (var i = d3.min(domainByTrait[p.y]); i < d3.max(domainByTrait[p.y]); i = +(i + py).toFixed(12)) {
                pyData.push(0);
            }


            var pxPoints = [];
            var pyPoints = [];

            // END POLYLINE INIT

            var circles = cell.selectAll("circle")
                .data(data)
                .enter();

            circles.append("circle")
                .attr("cx", function(d) {
                    if (isNaN(d[p.x]) === false) {
                        return x(d[p.x]);
                    } else {

                        //FOR POLYLINE
                        for (var i = d3.min(domainByTrait[p.y]); i < d3.max(domainByTrait[p.y]); i = +(i + py).toFixed(12)) {
                            if (isNaN(d[p.y]) === false) {
                                if (i <= d[p.y] && d[p.y] < +(i + py).toFixed(12)) {
                                    var ii = Math.floor(+((i - d3.min(domainByTrait[p.y])) / py).toFixed(12));
                                    pyData[ii]++;
                                }
                            }
                        }
                        //END FOR POLYLINE
                        return x(0);
                    }
                })
                .attr("cy", function(d) {
                    if (isNaN(d[p.y]) === false) {
                        return y(d[p.y]);
                    } else {

                        //FOR POLYLINE
                        for (var i = d3.min(domainByTrait[p.x]); i < d3.max(domainByTrait[p.x]); i = +(i + px).toFixed(12)) {
                            if (isNaN(d[p.x]) === false) {
                                if (i <= d[p.x] && d[p.x] < +(i + px).toFixed(12)) {
                                    var ii = Math.floor(+((i - d3.min(domainByTrait[p.x])) / px).toFixed(12));
                                    pxData[ii]++;
                                }
                            }
                        }
                        //END FOR POLYLINE
                        return y(0);
                    }
                })
                .attr("r", function(d) {
                    tot += 1;
                    if (isNaN(d[p.x])) {
                        absX += 1;
                    }
                    if (isNaN(d[p.y])) {
                        absY += 1;
                    }
                    if (isNaN(d[p.x]) || isNaN(d[p.y])) {
                        abs += 1;
                        return 0;
                    } else {
                        return 3;
                    }
                })
                .style("fill", function(d) {
                    if (isNaN(d[p.x]) || isNaN(d[p.y])) {
                        return "red"
                    } else {
                        return color(d.species);
                    }

                })

            .on("mouseover", function(d) {
                div.transition()
                    .duration(200)
                    .style("background-color", color(d.species))
                    .style("opacity", .7);
                div.html(d.species + "\n" + d[p.x] + "\n" + d[p.y])
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })

            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
            // .style("fill", function(d) { return color(d.species); });


            if (tot != 0) {
                dispSize = abs / tot * 4;
                console.log(abs)
                    // // console.log(tot)
                    // // console.log(dispSize)
                    // console.log(z(dispSize))
                sizeX = absX / tot;

                sizeY = absY / tot;

            }

            cell.selectAll("circle[r=\"3\"]").attr("r", z(dispSize));

            //DRAW POLYLINE

            var hauteurReg = padding / 2;
            var max = [];
            max.push(d3.max(pxData));
            max.push(d3.max(pyData));

            var z1 = d3.scale.linear()
                .domain([0, d3.max(max)])
                .range([0, hauteurReg]);

            var z2 = d3.scale.linear()
                .domain([0, d3.max(pxData)])
                .range([0, hauteurReg]);

            var z3 = d3.scale.linear()
                .domain([0, d3.max(pyData)])
                .range([0, hauteurReg]);



            for (var i = d3.min(domainByTrait[p.x]); i < d3.max(domainByTrait[p.x]); i = +(i + px).toFixed(12)) {
                var j = +(i + px).toFixed(12);
                var ii = Math.floor(+((i - d3.min(domainByTrait[p.x])) / px).toFixed(12))
                pxPoints.push({
                    "x": x((i + j) / 2),
                    "y": -(z1(pxData[ii]) - padding / 2)
                });

            }
            for (var i = d3.min(domainByTrait[p.y]); i < d3.max(domainByTrait[p.y]); i = +(i + py).toFixed(12)) {
                var j = +(i + py).toFixed(12)
                var ii = Math.floor(+((i - d3.min(domainByTrait[p.y])) / py).toFixed(12))
                pyPoints.push({
                    "x": -(z1(pyData[ii]) - padding / 2),
                    "y": y((i + j) / 2)
                });

            }

            var lineFunction = d3.svg.line()
                .x(function(d) {
                    return d.x;
                })
                .y(function(d) {
                    return d.y;
                })
                .interpolate("basis");

            cell.append("path")
                .attr("d", lineFunction(pxPoints))
                .attr("stroke", "red")
                .attr("stroke-width", 2)
                .attr("fill", "none");

            cell.append("path")
                .attr("d", lineFunction(pyPoints))
                .attr("stroke", "red")
                .attr("stroke-width", 2)
                .attr("fill", "none");

            //END DRAW POLYLINE

            //  add rect to
            cell.append("rect")
                .attr("class", "overpadding")
                .attr("x", padding / 2)
                .attr("y", padding / 2)
                .attr("width", size - padding)
                .attr("height", size - padding)
                .style("opacity", 0);

        }

        function cross(a, b) {
            var c = [],
                n = a.length,
                m = b.length,
                i, j;
            for (i = -1; ++i < n;)
                for (j = -1; ++j < m;) c.push({
                    x: a[i],
                    i: i,
                    y: b[j],
                    j: j
                });
            return c;
        }

        d3.select(self.frameElement).style("height", size * n + padding + 20 + "px");
    });
    div_g = true
}

// function switchMode() {
//     modeBrush = !modeBrush;
//     d3.select("#zone_zoom").remove();
//     matrix1();
//     d3.select("#zone").remove();
//     d3.select(element).selectAll("svg").remove()

// }

// Clear the previously-active brush, if any.
function remove_brush() {
    d3.selectAll(".brush").remove();
}
