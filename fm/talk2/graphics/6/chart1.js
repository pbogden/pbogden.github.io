function chart1() {
  // WARNING: If the following isn't accurate, dates in visualization will be wrong
  // ASSUMING: start date = 1 Oct 2015 = 20150901
  var startDate = new Date(2015, 09, 1), // presumed startDate for GA query
      timeFormat = d3.timeFormat('%b');

  var container = d3.select("#chart1");

  var data = null;

  var chart = barChart()
      .x(function(d) { return d[0]; })
      .y(function(d) { return d[1]; });

  function my(json) {

    console.log('chart1:', Object.keys(json));

    // Initialize data-dependent things
    var keyword = 'fanniemae';
    data = json[keyword].map(function(d, i) { return [i, d]; })

    container.selectAll('button')
        .classed('active', function() { return this.value === keyword; });

    container.selectAll('button')
        .on('click', clicked)

    container
        .datum(data)
        .call(chart);

    // Style the x-axis
    container.selectAll('.x.axis .tick')
        .each(function(d, i) {
          if (date(d).getDate() !== 1) return d3.select(this).remove();
          var mon = timeFormat(date(d));
          var monYr = d3.timeFormat('%b %Y')(date(d))
          d3.select(this).select('text').text( mon === "Jan" ? monYr : mon );
        })

    // Inner label for y axis
    container.select('.y.axis .label')
        .text('Pageviews');

    function clicked(d, i) {
      console.log('chart1 clicked', this, this.value)
      data = json[this.value].map(function(d, i) { return [i, d]; })
      container
          .datum(data)
          .call(chart.update);
      container.selectAll('button').classed('active', false)
      d3.select(this).classed('active', true)
    }
  }

  function date(nthDay) {
      return new Date( startDate.getFullYear(),
                       startDate.getMonth(),
                       startDate.getDate() + nthDay);
  }

  my.mousedover = chart.mousedover;
  my.mousedout = chart.mousedout;

  return my;
}
