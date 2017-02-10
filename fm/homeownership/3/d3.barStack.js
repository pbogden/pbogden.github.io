d3.barStack = function() {

  var width = 960,
      height = 500,
      xValue = function(d) { return d[0]; },
      yValue = function(d) { return d[1]; },
      extent = null;

  var margin = {top: 30, right: 30, bottom: 30, left: 30},
      xScale = d3.scaleBand(),
      yScale = d3.scaleLinear(),
      xAxis = d3.axisBottom(),
      yAxis = d3.axisLeft();

  function chart(selection) {
    selection.each(function(data) {

      var g = d3.select(this).append("g")
          .attr('class', 'chart')
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      xScale
          .range([0, width - margin.left - margin.right])
          .padding(.1)
          .domain(data.map(function(d) { return d.age; }));

      extent = extent || d3.extent(data, function(d) { return d[1]; });
      extent[0] = Math.min(0, extent[0]);
      yScale
          .range([height - margin.top - margin.bottom, 0])
          .domain(extent);

      var xAxis = d3.axisBottom(xScale);

      var yAxis = d3.axisLeft(yScale)
          .ticks(5, "%");

      g.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + yScale.range()[0] + ")")
          .call(xAxis);

      g.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .style("fill", "black")
          .text("Homeownership Rate");

      // Bind the data -- one .group for each stack
      var group = g.selectAll(".group")
          .data(data, function(d) { return d.age; })
        .enter().append("g")
          .attr("class", "group")
          .attr("transform", function(d) { return "translate(" + xScale(d.age) + ",0)"; })

      // Draw a stack
      group.selectAll(".bar")
          .data(function(d, i) { return d.values; })
        .enter().append("rect")
          .attr("class", "bar")
          .attr("width", xScale.bandwidth())
          .attr("x", 0)
          .attr("y", function(d) { return yScale(d[1]); })
          .attr("height", function(d) { return Math.abs( yScale(d[0]) - yScale(d[1]) ) })
          .style("fill", "steelblue");

      // Zero crossing
      g.append("path")
          .datum([ [d3.min(xScale.range()), yScale(0)], [d3.max(xScale.range()), yScale(0)] ])
          .attr("d", d3.line())
          .style("stroke", "#333")
          .style("stroke-width", "1")
    });
  }

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width  = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.x = function(_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return chart;
  };

  chart.y = function(_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return chart;
  };

  chart.xScale = function(_) {
    if (!arguments.length) return xScale;
    xScale = _;
    return chart;
  };

  chart.yScale = function(_) {
    if (!arguments.length) return yScale;
    yScale = _;
    return chart;
  };

  chart.extent = function(_) {
    if (!arguments.length) return extent;
    extent = _;
    return chart;
  };

  return chart;
}
