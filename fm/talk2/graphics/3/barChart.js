function barChart() {

  var width = 960,
      height = 500,
      xValue = function(d) { return d[0]; },
      yValue = function(d) { return d[1]; };

  var margin = {top: 80, right: 30, bottom: 30, left: 30},
      xScale = d3.scaleBand(),
      yScale = d3.scaleSqrt(), // Pow().exponent(.3),
      xAxis = d3.axisBottom(),
      yAxis = d3.axisLeft();

  function chart(selection) {
    selection.each(function(data) {

      // Update the x scale.
      xScale
          .range([margin.left , width - margin.left - margin.right])
          .padding(.1)
          .domain(data.map(function(d) { return d[0]; }));

      // Update the y scale.
      var extent = d3.extent(data, function(d) { return d[1]; });
      extent[0] = Math.min(extent[0], 0);
      yScale
          .range([height - margin.top - margin.bottom, 0])
          .domain(extent);

      // Update the x axis.
      xAxis.scale(xScale);

      // Update the y axis.
      yAxis.scale(yScale)
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
          .attr("transform", "translate(" + margin.left + ", 0)")
          .call(yAxis)
        .append("text") // y-axis label
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .style("fill", "black")
          .text("");

      g.selectAll(".bar")
          .data(data, function(d) { return d[0]; })
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

  function update(selection) {
      data = selection.datum()
      g = selection.select('g')
//      xScale.domain(data.map(function(d) { return d[0]; }));
      var extent = d3.extent(data, function(d) { return d[1]; });
      extent[0] = Math.min(extent[0], 0);
      yScale.domain(extent);

      var bar = g.selectAll(".bar")
          .data(data, function(d) { return d[0]; })

      bar.exit().remove();

      bar.enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return xScale(d[0]); })
          .attr("width", xScale.bandwidth())
          .attr("y", function(d) { return ( yScale(0) - yScale(d[1]) ) > 0 ? yScale(d[1]) : yScale(0); })
        .merge(bar)
        .transition()
          .duration(2000)
          .attr("x", function(d) { return xScale(d[0]); })
          .attr("y", function(d) { return ( yScale(0) - yScale(d[1]) ) > 0 ? yScale(d[1]) : yScale(0); })
          .attr("height", function(d) { return Math.abs( yScale(0) - yScale(d[1]) ) });

      g.select('.y.axis')
        .transition()
          .duration(2000)
          .call(yAxis.scale(yScale))
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

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.update = update;

  return chart;
}
