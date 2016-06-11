var width = 960,
    size = 230,
    padding = 20;

var x = d3.scale.linear()
    .range([padding / 2, size - padding / 2]);

var y = d3.scale.linear()
    .range([size - padding / 2, padding / 2]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(6);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(6);

var color = d3.scale.category10();

d3.csv("flowers3.csv", function(error, data) {
  if (error) throw error;


  data.forEach(function(d){
    d["sepal length"] = +d["sepal length"];
    d["sepal width"] = +d["sepal width"];
    d["petal length"] = +d["petal length"];
    d["petal width"] = +d["petal width"];
  });


  var domainByTrait = {},
      traits = d3.keys(data[0]).filter(function(d) { return (d !== "species"); }),
      n = traits.length;

  traits.forEach(function(trait) {
    domainByTrait[trait] = d3.extent(data, function(d) { return d[trait]; });

  });



  xAxis.tickSize(size * n);
  yAxis.tickSize(-size * n);

  var brush = d3.svg.brush()
      .x(x)
      .y(y)
      .on("brushstart", brushstart)
      .on("brush", brushmove)
      .on("brushend", brushend);

  var svg = d3.select("body").append("svg")
      .attr("width", size * n + padding)
      .attr("height", size * n + padding)
	  .append("g")
      .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

  svg.selectAll(".x.axis")
      .data(traits)
      .enter().append("g")
      .attr("class", "x axis")
      .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
      .each(function(d) { x.domain(domainByTrait[d]); d3.select(this).call(xAxis); });

  svg.selectAll(".y.axis")
      .data(traits)
      .enter().append("g")
      .attr("class", "y axis")
      .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
      .each(function(d) { y.domain(domainByTrait[d]); d3.select(this).call(yAxis); });

  var cell = svg.selectAll(".cell")
      .data(cross(traits, traits))
      .enter().append("g")
      .attr("class", "cell")
      .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
      .each(plot);

  // Titles for the diagonal.
  cell.filter(function(d) { return d.i === d.j; }).append("text")
      .attr("x", padding)
      .attr("y", padding)
      .attr("dy", ".71em")
      .text(function(d) { return d.x; });

  cell.call(brush);

  function plot(p) {
    var cell = d3.select(this);
    var tot=0, pres=0, abs=0, dispSize=3;


    x.domain(domainByTrait[p.x]);
    y.domain(domainByTrait[p.y]);

    cell.append("rect")
        .attr("class", "frame")
        .attr("x", padding / 2)
        .attr("y", padding / 2)
        .attr("width", size - padding)
        .attr("height", size - padding);

    cell.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", function(d) {
           if (isNaN(d[p.x])===false){
                        console.log(x(d[p.x]));
                        return x(d[p.x]);
           }
           else{
             return x(0);
           }
           })
        .attr("cy", function(d) { 
           if (isNaN(d[p.y])===false){
                        return y(d[p.y]);
           }
           else{
             return y(0);
           }
           })
        .attr("r", function(d){
          tot += 1;
          if (isNaN(d[p.x]) || isNaN(d[p.y])) {
              abs += 1;
              return 0;
            }
          else { return 3;}
        })
        .style("fill", function(d) { return color(d.species); });
    
    //if(tot!=0){dispSize = 3 + (abs/tot);}
    //cell.selectAll("circle[r=\"3\"]").attr("r",dispSize);
    //arrow variables
    
    /*
    circles.append("line")
            .attr("x1", function(d) {
              if (isNaN(d[p.x])===false){
                return x(d[p.x])-z(dispSize);
              } else if (isNaN(d[p.x]) || isNaN(d[p.y])){
                return 0;
              }
            })
            .attr("y1", function(d) {
              if (isNaN(d[p.x]) || isNaN(d[p.y])){
                return 0;
              } else{
                return y(d[p.y]);
              }
            })
            .attr("x2", function(d) {
              if (isNaN(d[p.x])===false){
                return x(d[p.x])-(2*z(dispSize));
              } else if (isNaN(d[p.x]) || isNaN(d[p.y])){
                return 0;
              }
            })
            .attr("y2", function(d) {
              if (isNaN(d[p.x]) || isNaN(d[p.y])){
                return 0;
              } else{
                return y(d[p.y]);
              }
            })
            .attr("stroke-width", function(d){
              if (isNaN(d[p.x]) || isNaN(d[p.y])){
                return 0;
              } else{
                return 2;
              }
            })
            .attr("stroke", function(d) { return color(d.species); });
            */
  }

  var brushCell;

  // Clear the previously-active brush, if any.
  function brushstart(p) {
    if (brushCell !== this) {
      d3.select(brushCell).call(brush.clear());
      x.domain(domainByTrait[p.x]);
      y.domain(domainByTrait[p.y]);
      brushCell = this;
    }
  }

  // Highlight the selected circles.
  function brushmove(p) {
    var e = brush.extent();
    svg.selectAll("circle").classed("hidden", function(d) {
      return e[0][0] > d[p.x] || d[p.x] > e[1][0]
          || e[0][1] > d[p.y] || d[p.y] > e[1][1];
    });
  }

  // If the brush is empty, select all circles.
  function brushend() {
    if (brush.empty()) svg.selectAll(".hidden").classed("hidden", false);
  }

  d3.select(self.frameElement).style("height", size * n + padding + 20 + "px");
});

function cross(a, b) {
  var c = [], n = a.length, m = b.length, i, j;
  for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
  return c;
}