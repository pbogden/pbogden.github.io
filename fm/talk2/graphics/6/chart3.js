function chart3() {
  var startDate = new Date(2015, 09, 1),
      timeFormat = d3.timeFormat('%b'),
      parseDate = d3.timeParse("%-m/%-d/%Y %I:%M %p");  // m/d/yyyy

  var keyword = "Clicks",
      tweetLabel = "none",
      timerId = null,
      data = null;

  var container = d3.select("#chart3");

  var chart = barChart()
      .x(function(d) { return d[0]; })
      .y(function(d) { return d[1]; });

  function my(json) {

    console.log('chart3', Object.keys(json[0]))

    data = dailyBins(json.filter(empty).map(type));
    console.log('binned 0:', data[0], data[0][3])

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

    // inner label for y axis
    container.select('.y.axis .label')
        .text('label for chart 3');

    function clicked(d, i) {
      console.log('chart3 clicked', this, this.value, data)
      // Set globals "keyword" & "tweetLabel"
      if (i <= 3) {
        keyword = this.value;
      } else {
        tweetLabel = this.value.toLowerCase();
      }
      data = data.map(filterByLabel);

      container
          .datum(data)
          .call(chart.update);

      container.selectAll('button')
          .each(function(d,k) {
            if (((i <= 3) && (k <= 3)) ||
                ((i > 3) && (k > 3))) d3.select(this).classed('active', false)
          })
      d3.select(this).classed('active', true)
    }
  }

  // Sample with globals: value = "keyword", filter by "tweetLabel"
  function filterByLabel(d, i) {
    var value = d[1];
    var date = d[2];
    var tweets = d[3];
//    console.log('i, d[0], date, value BEFORE:', i, d[0], date, value, d)

    value = 0;
    tweets.forEach(function(d) {
      if ((tweetLabel === 'none') ||
          (d.Labels.toLowerCase().includes(tweetLabel))) value += +d[keyword];
    });
//    console.log('i, value AFTER:', i, value)
    d[1] = value;
    return d;
  }

  function date(nthDay) {
      return new Date( startDate.getFullYear(),
                       startDate.getMonth(),
                       startDate.getDate() + nthDay);
  }

  // One-day bins of twitter data
  function dailyBins(data) {
      var extent = d3.extent(data.map(function(d) { return d.date; }))
      var y0 = startDate.getFullYear();
      var m0 = startDate.getMonth();
      var d0 = startDate.getDate();
      var nDays = 365;

      // Initialized the bins
      var bins = d3.range(nDays).map(function(d) {
        return [d, 0, new Date(y0, m0, d0 + d),[]];
      });

      // Bin the data
      data.forEach(function(d) {
        var k = Math.floor( (d.date - startDate) / 1000 / 60 / 60 / 24);
        if (k < 0) return;
        bins[k][1] += d.value;
        bins[k][3].push(d);
      });

      return bins;
  }

  // Returns relevant columns from the spredfast CSV
  function type(d, i) {
    // Make sure hour is zero padded
    var t = (d.Time.length === 7) ? ' 0' + d.Time : ' ' + d.Time;
    if (t.length !== 9) console.log('Problem with Time:', t, d)

    d.date = parseDate(d.Date + t)
    d.value = +d[keyword];
    d.row = i;

    return d;
  }

  function empty(d, i) { return d.Time !== '' & d.date !== ''; }

  function mousedover(d, i) {
    console.log('custom mousedover (d, i, data[i]):', d, i, data[i]);
    var nthDay = d[0];
    var count = d[1];
    container.selectAll('.bar')
        .classed('active', function(d) { return d[0] === nthDay; })
    var date = new Date( startDate.getFullYear(),
                         startDate.getMonth(),
                         startDate.getDate() + nthDay);
    var f = d3.timeFormat('%a %d-%b-%Y')
    if (timerId) clearTimeout(timerId);
    container.select('#chart-text').text(f(date) + "  --  " + d3.format(',d')(count));
  }

  function mousedout() {
    timerId = window.setTimeout(function() {
      container.select('#chart-text').text('Mouse over the bars for detail');
      container.selectAll(".bar").classed('active', false)
    }, 1000);
  }

  my.mousedover = mousedover;
  my.mousedout = mousedout;
//  my.mousedover = chart.mousedover;
//  my.mousedout = chart.mousedout;

  return my;
}
