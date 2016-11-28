var startDate = new Date(2015, 09, 1), // presumed startDate for GA query
    maxDays = Math.floor( (new Date() - startDate) )/ 1000 / 60 / 60 / 24 + 1;
    console.log('maxDays', maxDays)

var margin = {top: 0, right: 0, bottom: 0, left: 0};
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var message = 'Mouse over the bars for detail',
    timerId = null,
    name = 'fanniemae.com';

var notes = {
      'corporate-news': "8 Mar: Oct 19 press release (Innovations for Lenders), 17 Jun: Workplace Relocation FAQ",
      'housing-survey': "7 Jun 2016: ~30% SpredFast tags",
      'media/commentary': "10 Mar: Simmons (Myths Debunked), 1 Jun: Palim (Dec 10 commentary)",
      'fanniemae.com': "Aug 2016: ~10K increase for 2 weeks",
    };

var container = d3.select("#chart").append("svg")
    .attr('viewBox', "0, 0, " + (width + margin.left + margin.right) + ", " + (height + margin.top + margin.bottom))
    .attr('preserveAspectRatio', "xMinYMid")
  .append("g")
    .attr("id", "container")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

container.append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "#eee")

var chart = barChart()
    .x(function(d) { return d[0]; })
    .y(function(d) { return d[1]; })
    .width(width)
    .height(height);

var text = container.append('text')
    .attr('class', 'label')
    .attr('x', 200)
    .attr('y', 100)
    .text('Waiting for data');

d3.json('data.json', function(error, json) {
  if (error) throw error;

  console.log( Object.keys(json) );

  d3.selectAll('#names button')
      .classed('active', function() { return this.value === name; })
      .on('click', clickedName);

  d3.selectAll('#filters button')
      .on('click', clickedFilter)

  // Initialize graphic
  container
     .datum( getData(json[name]) )
     .call(chart);

  // Restyle the x-axis
  container.selectAll('.x.axis g').remove();  // remove default x-axis
  var chartMargin = chart.margin();
  var xScale = d3.scaleTime()
    .domain(d3.extent(container.datum().map(function(d) { return (typeof d[0] === 'string') ? null : d[0]; })))
    .range([chartMargin.left , width - chartMargin.left - chartMargin.right])
  container.selectAll('.x.axis').call(d3.axisBottom().scale(xScale));

  text.remove();
  text = container.append('text').attr('x', 100).attr('y', 100).text(message);

  container.selectAll('.bar')
      .on('mouseover', moused)
      .on('mouseout', function() { timerId = window.setTimeout(function() { text.text(message) }, 1000); });

  function clickedName(d) {
    name = this.value; // reset global
    console.log('clickedName:', name)
    d3.selectAll('#names button').classed('active', false)
    d3.select(this).classed('active', true)
    d3.select('#note').html(notes[name])

    // Update the graphic with newly filtered data
    container
        .datum( getData(json[name]) )
        .call(chart.update);

    container.selectAll('.bar')
        .on('mouseover', moused)
        .on('mouseout', function() { timerId = window.setTimeout(function() { text.text(message) }, 1000); });
  }

  // Change the filter option
  function clickedFilter() {
    // Toggle the filter that was just clicked
    console.log('clickedFilter:', d3.select(this).node().value)
    d3.selectAll('#filters button').classed('active', false);
    d3.select(this).classed('active', true);

    // Reload data for current 'name'
    clickedName.call(d3.select('#names button.active').node())
  }
});

function moused(d) {
  if (timerId) clearTimeout(timerId);
  var date = d[0];
  var f = d3.timeFormat('%a %d-%b-%Y')
  text.text(f(date) + "  --  " + d3.format(',d')(d[1]));

  // Update the list of URLs below the chart
  d3.select("#list")
      .html(function() {
          return d[2].map(function(dd) { return dd[1] + ": " + dd[0] }).join('<br>')
      })
}

function getData(json) {
  // Initialize an array that will contain the filtered data
  var data = Object.keys(json);
  var dateParse = d3.timeParse('%Y%m%d');

  // Get a list of filters from the GUI buttons
  var filters = d3.selectAll('#filters button.active').nodes().map(function(d) { return d.value; })
  console.log('filters', filters)

  var datum;
  return data.map(function(nthDay) {
    var datum = [null, 0, []];
    if (json[nthDay]) {
      var urls = json[nthDay].urls;
      var date = dateParse((json[nthDay].date).toString());
      var v0 = d3.sum(urls, function(d) { return d[1] });

      filters.forEach(function(filter) {
        urls = urls.filter(function(d) { return (d[0].includes(filter)); });
      })

      var value = d3.sum(urls, function(d) { return d[1] });
      datum = [date, value, urls];
    }
    return datum;
  })
}
