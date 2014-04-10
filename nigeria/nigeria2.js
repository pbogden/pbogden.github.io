
function nigeria(stuff) {

var width = 960, height = 400,
    centerLat = 8., centerLng = 13.;

var svg = d3.select("#nigeriaPlot").append("svg")
    .attr("width", width)
    .attr("height", height);

var projection = d3.geo.mercator()
    .center([centerLng, centerLat])
    .scale(2000);       // default = 150 (500 works well)

var path = d3.geo.path()
    .projection(projection);

// Read the data
d3.json("nigeria.json", function(error, data) {

  data.forEach( function(d,i) {
     if (d.properties.name == 'Federal Capital Territory') { d.properties.name = 'Abuja' };
     console.log("data: " + d.properties.admin + ", " + i + " name: " + d.properties.name);
     var color = stuff.filter( function(dd){ return (dd.State == d.properties.name ) });
     color = color[0].color;
     console.log("name, color: " + d.properties.name + ", " + color);
     d.color = color;
  });

  svg.selectAll("path")
      .data(data)
    .enter()
      .append("path")
      .attr("class", "country")
      .attr("d", path)
//    .transition()
//      .delay(1000)
//      .duration(4000)
//      .style('fill', function(d) { console.log('d.color: ' + d.color ); return d.color; })

  // Label the countries listed in names
  svg.selectAll("text")
      .data(data)
    .enter()
      .append("text")
      .attr("class", "special-label")
      .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
      .text(function(d) { return d.properties.name; });

});

}
