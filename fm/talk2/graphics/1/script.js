// WARNING: If the following isn't accurate, dates in visualization will be wrong
// ASSUMING: start date = 1 Oct 2015 = 20150901
var startDate = new Date(2015, 09, 1), // presumed startDate for GA query
    maxDays = Math.floor( (new Date() - startDate) )/ 1000 / 60 / 60 / 24 + 1;
    console.log('maxDays', maxDays)

var margin = {top: 0, right: 0, bottom: 0, left: 0};
    width = 960 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var message = 'Mouse over the bars for detail',
    timerId = null,
    name = 'thehomestory.com';

var notes = {
      'corporate-news': "17 Jun 2016: Workplace relocation FAQ, 8 Mar 2016: Unclear (looking at Oct 19 press release?)",
      'housing-survey': "7 Jun 2016: Unclear (url has a photo tag?)",
      'commentary': "10 Mar 2016: Housing Myths Debunked, 1 Jun 2016 (Eloqua Track ID on FM Commentary?)",
      'fanniemae.com': "Aug 2016: 50% rise for 2 weeks starting Aug 15th (??)",
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

  // Style the x-axis
//  container.selectAll('.x.axis').remove();  // remove x-axis
  container.selectAll('.x.axis .tick')
      .each(function(d, i) { if (i % 10 !== 0) d3.select(this).remove(); })

  text.remove();
  text = container.append('text').attr('x', 100).attr('y', 100).text(message);

  container.selectAll('.bar')
      .on('mouseover', moused)
      .on('mouseout', function() { timerId = window.setTimeout(function() { text.text(message) }, 1000); });

  function clickedName(d) {
    console.log('clickedName', this, this.value)
    name = this.value; // reset global
    d3.selectAll('#names button').classed('active', false)
    d3.select(this).classed('active', true)
    d3.select('#note').html(notes[name])

    if (d3.selectAll("#filters button.active").node().value == 'exclude')
        console.log('FILTERING VIDEO');

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
    d3.selectAll('#filters button').classed('active', false)
    d3.select(this).classed('active', true)
    console.log('clickedFilter', this, this.value)

    clickedName.call(d3.select('#names button.active').node())
  }
});

function moused(d) {
  if (timerId) clearTimeout(timerId);
  var nthDay = +d[0];
  var date = new Date( startDate.getFullYear(),
                       startDate.getMonth(),
                       startDate.getDate() + nthDay);
  var f = d3.timeFormat('%a %d-%b-%Y')
  text.text(f(date) + "  --  " + d3.format(',d')(d[1]));

  d3.select("#list")
      .html(function() {
          return d[2].map(function(d) { return d[1] + ": " + d[0] }).join('<br>')
      })
}

function getData(json) {
  // Initialialize an array that will contain the data
  var data = d3.range(0, maxDays).map(function(d) { return d.toString(); })

  // Include video?
  var video = (d3.selectAll("#filters button.active").node().value == 'include');

  var datum;
  return data.map(function(nthDay) {
    var datum = [nthDay, 0, []];
    if (json[nthDay]) {
      var value = d3.sum(json[nthDay].urls, function(d) { return d[1] });
      var filteredURLs = json[nthDay].urls.filter(function(d) { return (!d[0].includes('?sf')) });
      var filteredValue = d3.sum(filteredURLs, function(d) { return d[1] });
      datum = [nthDay, video ? value : filteredValue, video ? json[nthDay].urls : filteredURLs];
    }
//    console.log('getData:', +nthDay, json[nthDay].value, value, filteredValue, filteredURLs);
    return datum;
  })
}
