function barChart() {

  var margin = {top: 80, right: 30, bottom: 30, left: 80},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var xValue = function(d) { return d[0]; },
      yValue = function(d) { return d[1]; };

  var g = null,
      text = null,
      timerId = null;

  var xScale = d3.scaleBand()
      yScale = d3.scaleSqrt(), // Pow().exponent(.3),
      xAxis = d3.axisBottom(),
      yAxis = d3.axisLeft();

  function chart(selection) {
    selection.each(function(data) {

      // Update the x scale.
      xScale
          .range([0 , width])
          .padding(.1)
          .domain(data.map(function(d) { return d[0]; }));

      // Update the y scale.
      var extent = d3.extent(data, function(d) { return d[1]; });
      extent[0] = Math.min(extent[0], 0);
      yScale
          .range([height, 0])
          .domain(extent);

      // Update the x axis.
      xAxis.scale(xScale);

      // Update the y axis.
      yAxis.scale(yScale)
          .ticks(8);

      var svg = selection.append("svg")
              .attr('viewBox', "0, 0, " + (width + margin.left + margin.right) + ", " + (height + margin.top + margin.bottom))
              .attr('preserveAspectRatio', "xMinYMid")

      svg.append("rect")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .style("fill", "#eee");

      g = svg.append("g")
              .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

      // Update the inner dimensions
//      g = d3.select(this).append("g")
//          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      g.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + yScale.range()[0] + ")")
          .call(xAxis);

      g.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text") // y-axis label
          .attr('class', 'label')
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .style("fill", "black")
          .text("");

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

      text = g.append('text')
            .attr('id', 'chart-text')
            .attr('x', '4em')
            .attr('y', '1em')
            .text('Mouse over the bars for detail');
    });
  }

  function update(selection) {
      data = selection.datum()
      g = selection.select('g')
      console.log('update -- g:', g.nodes()[0])
      xScale.domain(data.map(function(d) { return d[0]; }));
      var extent = d3.extent(data, function(d) { return d[1]; });
      extent[0] = Math.min(extent[0], 0);
      yScale.domain(extent);

      g.selectAll(".bar")
          .data(data)
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

// TODO: finish integrating this into barChart.js
    function mousedover(d) {
      var startDate = new Date(2015, 09, 1); // presumed startDate
      var nthDay = d[0];
      var count = g.datum()[nthDay][1];
      var check = g.datum()[nthDay][0];
      if (check !== nthDay) throw new Error('inconsistent data ' + check + ', ' + nthDay)
      g.selectAll('.bar')
          .classed('active', function(d) { return d[0] === nthDay; })
      if (timerId) clearTimeout(timerId);
      var date = new Date( startDate.getFullYear(),
                           startDate.getMonth(),
                           startDate.getDate() + nthDay);
      var f = d3.timeFormat('%a %d-%b-%Y')
      text.text(f(date) + "  --  " + d3.format(',d')(count));
    }

  function mousedout() {
    timerId = window.setTimeout(function() {
      text.text('Mouse over the bars for detail');
      g.selectAll(".bar").classed('active', false)
    }, 1000);
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

  chart.update = update;
  chart.mousedover = mousedover;
  chart.mousedout = mousedout;

  return chart;
}
