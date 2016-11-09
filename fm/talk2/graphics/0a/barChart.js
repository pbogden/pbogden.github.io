function barChart() {

  var width = 960,
      height = 500,
      xValue = function(d) { return d[0]; },
      yValue = function(d) { return d[1]; };

  var margin = {top: 30, right: 30, bottom: 30, left: 60},
      xScale = d3.scaleBand()
      yScale = d3.scaleSqrt(), // Pow().exponent(.3),
      xAxis = d3.axisBottom(),
      yAxis = d3.axisLeft();

  function chart(selection) {
    selection.each(function(data) {

      // Convert to standard data representation greedily;
      // this is needed for nondeterministic accessors.
      data = data.map(function(d, i) {
        return [ xValue.call(data, d, i), yValue.call(data, d, i) ];
      });

      // Update the x scale.
      xScale
          .range([0 , width - margin.left - margin.right])
          .padding(.1)
          .domain(data.map(function(d) { return d[0]; }));

      // Update the y scale.
      var extent = d3.extent(data, function(d) { return d[1]; });
      extent[0] = Math.min(extent[0], 0);
      yScale
          .range([height - margin.top - margin.bottom, 0])
          .domain(extent).nice();

      // Update the x axis.
      var xAxis = d3.axisBottom(xScale);

      // Update the y axis.
      var yAxis = d3.axisLeft(yScale)
          .ticks(8);

      // Update the inner dimensions
      var g = d3.select(this).append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      g.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + yScale.range()[0] + ")")
          .call(xAxis);

      g.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text") // y-axis label
          .attr("class", "label")
          .attr("dy", "-.5em")
          .style("text-anchor", "start")
          .style("fill", "black")
          .text("pageviews");

      g.selectAll(".bar")
          .data(data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return xScale(d[0]); })
          .attr("width", xScale.bandwidth())
          .attr("y", function(d) { return ( yScale(0) - yScale(d[1]) ) > 0 ? yScale(d[1]) : yScale(0); })
          .attr("height", function(d) { return Math.abs( yScale(0) - yScale(d[1]) ) });

      g.append("path")
          .datum([ [d3.min(xScale.range()), yScale(0)], [d3.max(xScale.range()), yScale(0)] ])
          .attr("d", d3.line())
          .style("stroke", "#333")
          .style("stroke-width", "1")
    });
  }

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

  return chart;
}
