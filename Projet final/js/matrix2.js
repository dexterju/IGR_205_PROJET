function matrix2() {
    d3.selectAll("svg").remove();
    var formatCount = d3.format(",.0f");

    var width = 460,
        size = 110
    padding = 19.5;
    console.log(width);

    var x = d3.scale.linear()
        .range([padding / 2, size - padding / 2]);

    var y = d3.scale.linear()
        .range([size - padding / 2, padding / 2]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(5);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(5);

    var color = d3.scale.category10();

    d3.csv("flowers2.csv", function(error, data) {
        if (error) throw error;


        data.forEach(function(d) {
            d.sepallength = +d["sepallength"];
            d.sepalwidth = +d["sepalwidth"];
            d.petallength = +d["petallength"];
            d.petalwidth = +d["petalwidth"];
        });
        /************************************   Imputation  ********************************/
        // simple overall midian and mean

        function median(name) {
            return d3.median(data, function(d) {
                return d[name]
            })
        }

        function mean(name) {
            return d3.mean(data, function(d) {
                return d[name]
            })
        }

        // Mean of Neighnoor
        function neighbor(name, number) {
            for (var i = 0; i < data.length; i++) {
                mean = 0
                if (isNaN(data[i][name])) {
                    for (var j = 0; j < number / 2; j++) {
                        mean += data[i - j][name];
                        mean += data[i + j][name];
                    }
                    data[i][name] = mean;
                }
            }
            return data[name];
        }
        // data.petallength=neigh("petallength",2);

        // average
        function avg(name) {
            sum = 0;
            for (var i = 0; i < data.length; i++) {
                if (isNaN(data[i][name]) === false) {
                    sum += data[i][name];
                }
            }
            return sum / 150;
        };



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

        // xAxis.tickSize(size * n);
        // yAxis.tickSize(-size * n);


        var element = document.getElementById("matrix")
        element2 = document.getElementById("overview");

        var formatCount = d3.format(",.0f");

        // if (div_g == true) {
        //     d3.select(element).selectAll("svg").remove()
        // }

        brush = d3.svg.brush()
            .x(x)
            .y(y)
            .on("brushstart", brushstart)
            .on("brush", brushmove)
            .on("brushend", brushend);


        var div = d3.select(element).append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        var svg = d3.select(element).append("svg")
            .attr("width", size * n + padding)
            .attr("height", size * n + padding)
            .append("g")
            .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

        var svg_zoom = d3.select(element2).append("svg")
            .attr("id", "zone_zoom")
            .attr("width", size * n + padding)
            .attr("height", size * n + padding)
            .append("use").attr("xlink:href", "#toZoom")
            .attr("transform", "scale(" + 3 + ")");

        // svg.selectAll(".x.axis")
        //     .data(traits)
        //     .enter().append("g")
        //     .attr("class", "x axis")
        //     .attr("transform", function(d, i) {
        //         return "translate(" + (n - i - 1) * size + ",0)";
        //     })
        //     .each(function(d) {
        //         x.domain(domainByTrait[d]);
        //         d3.select(this).call(xAxis);
        //     });

        // svg.selectAll(".y.axis")
        //     .data(traits)
        //     .enter().append("g")
        //     .attr("class", "y axis")
        //     .attr("transform", function(d, i) {
        //         return "translate(0," + i * size + ")";
        //     })
        //     .each(function(d) {
        //         y.domain(domainByTrait[d]);
        //         d3.select(this).call(yAxis);
        //     });


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


        /*           draw scatterplot                           ****          */
        function plot(p) {
            var cell = d3.select(this);

            x.domain(domainByTrait[p.x]);
            y.domain(domainByTrait[p.y]);

            //end
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


            // x.domain(domainByTrait[p.x]);
            // y.domain(domainByTrait[p.y]);
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

            var bin_num = 10;
            var histogram = d3.layout.histogram()
                .bins(bin_num)
                .frequency(false);

            var values = []
            for (var i = 0; i < data.length; i++) {
                values.push(data[i][p.x])
            }

            var datah = histogram(values),
                kde = kernelDensityEstimator(epanechnikovKernel(0.4), x.ticks(7));

            var yh = d3.scale.linear()
                .domain([0, d3.max(datah, function(d) {
                    return d.y;
                })])
                .range([size - padding / 2, padding / 2]);

            var bar = cell.filter(function(d) {
                    return d.i === d.j;
                }).selectAll(".bar")
                .data(datah)
                .enter()
                .insert("rect", ".axis")
                .attr("class", "bar")
                .attr("x", function(d) {
                    return x(d.x);
                })
                .attr("y", function(d) {
                    return yh(d.y) - 10;
                })
                .attr("width", x(datah[0].dx + datah[0].x) - x(datah[0].x) - 1)
                .attr("height", function(d) {
                    return size - yh(d.y);
                })
                .style("fill", "pink")
                .on("mouseover", function(d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", .7);
                    div.html(Math.floor(d.y * 150))
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                });
            cell.selectAll(".bar").append("text")
                .attr("dy", ".75em")
                .attr("y", 10)
                .attr("x", x(datah[0].dx) / 2)
                .attr("text-anchor", "middle")
                .text(function(d) {
                    return formatCount(d.y);
                });

            var line = d3.svg.line()
                .x(function(d) {
                    return x(d[0]);
                })
                .y(function(d) {
                    return yl(d[1]);
                })

            var yl = d3.scale.linear()
                .domain([0, d3.max(kde(values), function(d) {
                    return d.y
                })])
                .range([size - padding / 2, padding / 2])

            //  cell.filter(function(d){return d.i===d.j;}).append("path")
            //      .datum(kde(values))
            //      .attr("class", "line")
            //      .attr("d", line);


            cell.selectAll("circle")
                .data(data)
                .enter().append("circle")
                .attr("cx", function(d) {
                    if (isNaN(d[p.x]) === false) {
                        return x(d[p.x]);
                    } else {
                        return x(median(p.x));
                    }
                })

            .attr("cy", function(d) {
                    if (isNaN(d[p.y]) === false) {
                        return y(d[p.y]);
                    } else {
                        return y(median(p.y));
                    }
                })
                .attr("r", function(d) {
                    if (isNaN(d[p.y]) === true) {
                        return 5;
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

        }

        function cross(a, b) {
            var c = [],
                n = a.length,
                m = b.length,
                i, j;
            for (i = -1; ++i < n;)
                for (j = -1; ++j < m;) c.push({ x: a[i], i: i, y: b[j], j: j });
            return c;
        }

        d3.select(self.frameElement).style("height", size * n + padding + 20 + "px");
    });


    function kernelDensityEstimator(kernel, x) {
        return function(sample) {
            return x.map(function(x) {
                return [x, d3.mean(sample, function(v) {
                    return kernel(x - v);
                })];
            });
        };
    }

    function epanechnikovKernel(scale) {
        return function(u) {
            return Math.abs(u /= scale) <= 1 ? .75 * (1 - u * u) / scale : 0;
        };
    }
    div_g = true;

}
