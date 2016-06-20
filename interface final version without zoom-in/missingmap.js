//Width and height
function missing(){
var w = 400;
var h = 400;
var barPadding = 1;
d3.csv("data_generated.csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.sepalLength = +d["sepalLength"];
    d.sepalWidth = +d["sepalWidth"];
    d.petalLength=+d["petalLength"];
    d.petalWidth=+d["petalWidth"];
    d.species= d["species"];
  });
  console.log(data[0].petalWidth)

var x = d3.scale.linear()
.domain([0, 10])
.range([0, w]);

var y = d3.scale.linear()
    .domain([0,data.length])
    .range([1, h-20]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
if(div_d==true){
  d3.select(document.getElementById("overview")).selectAll("svg").remove()
}

var svg = d3.select(document.getElementById("overview"))
      .append("svg")
      .attr("width", w/5+30)
      .attr("height", h);

var svg2 = d3.select(document.getElementById("overview"))
      .append("svg")
      .attr("width", w/5)
      .attr("height", h);
var svg3 = d3.select(document.getElementById("overview"))
      .append("svg")
      .attr("width", w/5)
      .attr("height", h);
var svg4 = d3.select(document.getElementById("overview"))
      .append("svg")
      .attr("width", w/5)
      .attr("height", h);
var svg5 = d3.select(document.getElementById("overview"))
      .append("svg")
      .attr("width", w/5)
      .attr("height", h);

  var padding = {left:10, right:30, top:20, bottom:20};
svg.selectAll("rect")
   .data(data)
   .enter().append("rect")
   .attr("x", function(d) {
      return 0+padding.left+20;
   })
   .attr("y", function(d,i) {
      return i*(h-20)/data.length;
   })
   .attr("width", w/5+50)
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
   svg.append("text")
      .attr("x",padding.left+20)
      .attr("y",h-5)
      .text("sepalLength")


   svg.append("g")
  .attr("class","axis")
  .attr("transform","translate(" + padding.left*3 + "," + (padding.top/4-5) + ")")
  .call(yAxis);

   svg2.selectAll("rect")
      .data(data)
      .enter().append("rect")
      .attr("x", function(d) {
         return 0;
      })
      .attr("y", function(d,i) {
         return i*(h-20)/data.length;
      })
      .attr("width", w/5+50)
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

  svg2.append("text")
     .attr("x",padding.left)
     .attr("y",h-5)
     .text("sepalWidth")


  svg3.selectAll("rect")
     .data(data)
     .enter().append("rect")
     .attr("x", function(d) {
        return 0;
     })
     .attr("y", function(d,i) {
        return i*(h-20)/data.length;
     })
     .attr("width", w/5+50)
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

   svg3.append("text")
      .attr("x",padding.left)
      .attr("y",h-5)
      .text("petalLength")

   svg4.selectAll("rect")
      .data(data)
      .enter().append("rect")
      .attr("x", function(d) {
         return 0;
      })
      .attr("y", function(d,i) {
         return i*(h-20)/data.length;
      })
      .attr("width", w/5+50)
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

     svg4.append("text")
        .attr("x",padding.left)
        .attr("y",h-5)
        .text("petalWidth")
      svg5.selectAll("rect")
         .data(data)
         .enter().append("rect")
         .attr("x", function(d) {
            return 0;
         })
         .attr("y", function(d,i) {
            return i*(h-20)/data.length;
         })
         .attr("width", w/5+50)
         .attr("height", function(d,i) {
            return h/data.length
         })
         .attr("fill", function(d,i) {
           console.log(d.species)
            if(d.species=="NaN"){
              return "#BF3030";
            }
            else{
              return"#14B0CC"
            }

         })


       svg5.append("text")
          .attr("x",padding.left)
          .attr("y",h-5)
          .text("species")


 })
 div_d=true;
 }
