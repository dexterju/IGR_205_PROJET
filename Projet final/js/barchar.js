function barchart(){
d3.csv("data_generated.csv", function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.sepalLength = +d["sepalLength"];
      d.sepalWidth = +d["sepalWidth"];
      d.petalLength=+d["petalLength"];
      d.petalWidth=+d["petalWidth"];
      d.species=d["species"];
    });

  var dataset=[]
  function misscal(name){
      sum=0
      if (name!="species"){
        for (var i=0;i<data.length;i++){
          if(isNaN(data[i][name])){sum+=1;}
            }
        return sum
      }
      else{
        for (var i=0;i<data.length;i++){
          console.log("ssssssssssssssssss")
          // console.log(data[i][name])
          if(data[i][name]==="NaN"){
            sum+=1
            console.log("ahhahahahahahhahaha",sum)}
            }
            return sum
      }
  }
  dataset.push(misscal("sepalLength"));
  dataset.push(misscal("sepalWidth"))
  dataset.push(misscal("petalLength"))
  dataset.push(misscal("petalWidth"))
  dataset.push(misscal("species"))
  console.log(dataset)



var width = 500;
var height = 400;
if(div_d==true){
  d3.select(document.getElementById("overview")).selectAll("svg").remove()
}

var svg = d3.select(document.getElementById("overview"))
// if(img==true){
// console.log(img)
// svg.selectAll("svg").remove()
// }
.append("svg")
.attr("width", width)
.attr("height", height+15);

var padding = {left:30, right:30, top:20, bottom:20};

var xScale = d3.scale.ordinal()
.domain(d3.range(dataset.length))
.rangeRoundBands([0, width - padding.left - padding.right]);


var yScale = d3.scale.linear()
.domain([0,d3.max(dataset)+1])
.range([height - padding.top - padding.bottom-5, 0]);


var xAxis = d3.svg.axis()
.scale(xScale)
.orient("bottom")
.tickValues([7])




var yAxis = d3.svg.axis()
.scale(yScale)
.orient("left");

var rectPadding = 4;

//添加矩形元素
var rects = svg.selectAll(".MyRect")
.data(dataset)
.enter()
.append("rect")
.attr("class","MyRect")
.attr("transform","translate(" + padding.left + "," + padding.top + ")")
.attr("x", function(d,i){
  return xScale(i) + rectPadding/2;
} )
.attr("y",function(d){
  return yScale(d);
})
.attr("width", xScale.rangeBand() - rectPadding )
.attr("height", function(d){
  return height - padding.top - padding.bottom - yScale(d);
})

//add text to the bar
var texts = svg.selectAll(".MyText")
.data(dataset)
.enter()
.append("text")
.attr("class","MyText")
.attr("transform","translate(" + padding.left + "," + padding.top + ")")
.attr("x", function(d,i){
  return xScale(i) + rectPadding/2;
} )
.attr("y",function(d){
  return yScale(d);
})
.attr("dx",function(){
  return (xScale.rangeBand() - rectPadding)/2;
})
.attr("dy",function(d){
  return 20;
})
.text(function(d){
  return d;
});

//添加x轴
for (var i=0;i<5;i++){
svg.append("text")
 .attr("x",90*i+40)
 .attr("y",400)
 .text(function(){
   if(i==0){return "sepalLength"}
   if(i==1){return "sepalWidth"}
   if(i==2){return "petallength"}
   if(i==3){return "petalwidth"}
   if(i==4){return "species"}
 })
}

svg.append("g")
.attr("class","axis")
.attr("transform","translate(" + padding.left + "," + (height - padding.bottom) + ")")
.call(xAxis);


//添加y轴
svg.append("g")
.attr("class","axis")
.attr("transform","translate(" + padding.left + "," + padding.top + ")")
.call(yAxis);


svg.append("text")
 .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
 .attr("transform", "translate("+ (padding.left/2) +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
 .text("Number of Miss value ");

svg.append("text")
 .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
 .attr("transform", "translate("+ (width/2) +","+(height+20-(padding.left/5))+")")  // centre below axis
 .text("Feature");
     })
div_d=true;
}
