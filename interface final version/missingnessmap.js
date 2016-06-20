
  var w = 400;
  var h = 300;
  var barPadding = 1;

  var x = d3.scale.linear()
  .domain([0, 10])
  .range([0, w]);

  var y = d3.scale.linear()
      .domain([0, ])
      .range([h, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(d3.format("%"));




  d3.csv("data_generated.csv", function(error, data) {
    if (error) throw error;


    data.forEach(function(d) {
      d.sepalLength = +d["sepalLength"];
      d.sepalWidth = +d["sepalWidth"];
      d.petalLength=+d["petalLength"];
      d.petalWidth=+d["petalWidth"];
      d.species= +d["species"];
    });
    console.log(data[0].petalWidth)

  var svg = d3.select("body")
        .append("svg")
        .attr("width", w/5)
        .attr("height", h);

  var svg2 = d3.select("body")
        .append("svg")
        .attr("width", w/5)
        .attr("height", h);
  var svg3 = d3.select("body")
        .append("svg")
        .attr("width", w/5)
        .attr("height", h);
  var svg4 = d3.select("body")
        .append("svg")
        .attr("width", w/5)
        .attr("height", h);

  svg.selectAll("rect")
     .data(data)
     .enter().append("rect")
     .attr("x", function(d) {
        return 0;
     })
     .attr("y", function(d,i) {
        return i*h/data.length;
     })
     .attr("width", w/5)
     .attr("height", function(d,i) {
        return h/data.length
     })
     .attr("fill", function(d,i) {
       if(isNaN(d.sepalLength)){
         return "#BF3030";
       }
       else{
         return"#14B0CC"
       }

     })
     .attr("label","wwwddd")


     svg2.selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("x", function(d) {
           return 0;
        })
        .attr("y", function(d,i) {
           return i*h/data.length;
        })
        .attr("width", w/5)
        .attr("height", function(d,i) {
           return h/data.length
        })
        .attr("fill", function(d,i) {
           if(isNaN(d.sepalWidth)){
             return "#BF3030";
           }
           else{
             return"#14B0CC"
           }

        })
    svg3.selectAll("rect")
       .data(data)
       .enter().append("rect")
       .attr("x", function(d) {
          return 0;
       })
       .attr("y", function(d,i) {
          return i*h/data.length;
       })
       .attr("width", w/5)
       .attr("height", function(d,i) {
          return h/data.length
       })
       .attr("fill", function(d,i) {
          if(isNaN(d.petalLength)){
            return "#BF3030";
          }
          else{
            return"#14B0CC"
          }

       })
     svg4.selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("x", function(d) {
           return 0;
        })
        .attr("y", function(d,i) {
           return i*h/data.length;
        })
        .attr("width", w/5)
        .attr("height", function(d,i) {
           return h/data.length
        })
        .attr("fill", function(d,i) {
           if(isNaN(d.petalWidth)){
             return "#BF3030";
           }
           else{
             return"#14B0CC"
           }

        })


   })
