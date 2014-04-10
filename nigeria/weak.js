
function weak() {

var margin = {top: 20, right: 100, bottom: 30, left: 20},
    width = 960 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);
var weakColor = d3.scale.linear()
    .range(["red", "green"]);

var color = d3.scale.category20b();

var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

var svg = d3.select("#weakPlot").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data.tsv", function(error, data) {

  var states = data.map(function(d) { return d.State || null; });
  var keys = d3.keys(data[0]).filter(function(key) { return key !== "State"; });

  data.forEach(function(d) {
    d.values = keys.map(function(name) { return {name: name, value: +d[name]}; });
  });

  x0.domain(data.map(function(d) { return d.State; }));
  y.domain([-5, 5]);
  weakColor.domain([-5, 5]);

  // GLOBAL USED BY NIGERIA PLOT
  var stuff = data.map( function(d) { return {State: d.State, value: d.sum, color: weakColor(d.sum) }; });
  nigeria(stuff);

  var state = svg.selectAll(".state")
      .data(data)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x0(d.State) + ",0)"; });

  var anorm = 1./Math.sqrt(keys.length - 1);

  function plotData() {
    state.selectAll("circle")
        .data(function(d) { return d.values; })
      .enter().append("circle")
        .attr("r", '7')
        .attr("cx", 0)
        .attr('fill-opacity', function(d) { return (d.name == 'sum') ? 0 : 1; })
        .attr("cy", function(d) { return (d.name == 'sum') ? y(0) : y(d.value); })
        .style("fill", function(d) { return (d.name == 'sum') ? '#fff' : color(d.name); });
  }

  plotData();

  d3.selectAll('button').on('click', function() {

    state.selectAll('circle').remove();
    plotData();
    state.selectAll("circle")
      .transition()
        .delay(1000)
        .duration(3000)
        .attr('fill-opacity', 1)
        .attr('fill-opacity', function(d) { return (d.name == 'sum') ? 1 : 0; })
        .style("fill", function(d) { return (d.name == 'sum') ? weakColor(d.value) : color(d.value); })
        .attr("cy", function(d) { return (d.name == 'sum') ? y(anorm*d.value) : y(d.value); });

      d3.selectAll("path")
          .style('fill', function(d) { console.log('d.color: ' + d.color ); return '#999'; })
        .transition()
          .delay(1000)
          .duration(5000)
          .style('fill', function(d) { console.log('d.color: ' + d.color ); return d.color; })
  });

});

};

