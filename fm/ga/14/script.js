
var width = 960,
    height = 500,
    maxRadius = 12;

var circle, nodes = [], clusters = [], refs, tip, ticks = 0;

var choice = [combined, grouped, gridded];

var color = d3.scaleOrdinal(d3.schemeCategory10);

var groupLocations = [{ x: - width / 4, y: - height / 6 }, { x:  width / 15, y: - height / 6 },
                      { x: - width / 4, y:   height / 4 }, { x:  width / 15, y:   height / 4 }];

var forceCollide = d3.forceCollide()
    .radius(function(d) { return d.radius + 1.5; })
    .iterations(1);

var simulation = d3.forceSimulation()
    .on("tick", tick);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

svg.append('text')
    .style('font-size', '2em')
    .style('text-anchor', 'middle')
    .attr('y', - height / 2)
    .attr('dy', '1em')
    .text(title)

d3.selectAll('input')
    .on('change', function() { ticks = 0; choice[this.value].call(); })

d3.json('data.json', function(error, json) {
  if (error) console.error(error);

  refs = json[0].value.map(function(d) { return d.key; });

  json.forEach(function(cluster, i) {
    var anorm = 30 / d3.max(cluster.value, function(d) { return d.value; })
    cluster.value.forEach(function(node) {
      var datum = {cluster: i, radius: anorm * node.value, value: node.value,
                   product: cluster.key, referrer: node.key };
      nodes.push(datum)
      if (!clusters[i]) clusters.push(datum);
      if (node.value > clusters[i].radius) clusters[i] = datum;
    })
  })

  color.domain(clusters.map(function(d) { return d.cluster; }));

  circle = svg.selectAll("circle")
      .data(nodes)
    .enter().append("circle")
      .attr("r", function(d) { return d.radius; })
      .style("fill", function(d) { return color(d.cluster); })
      .on('mouseover', mousedover)
      .on('mousemove', mousemoved)
      .on('mouseout', mousedout)

  simulation.nodes(nodes).stop();
  d3.selectAll('input:checked').each(function(d) { choice[this.value].call(); })
});

function tick() {
  circle
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
}

// force nodes to collapse on the largest node in their cluster
function forceCluster(alpha) {
  for (var i = 0, n = nodes.length, node, cluster, k = alpha * 1; i < n; ++i) {
    node = nodes[i];
    cluster = clusters[node.cluster];
    node.vx -= (node.x - cluster.x) * k;
    node.vy -= (node.y - cluster.y) * k;
  }
}

function mousedover(d) {
  tip = svg.append('g')
      .attr('id', 'tip')
      .style('pointer-events', 'none')

  tip.append('rect')

  tip.append('text')
      .attr('x', function() { return d3.mouse(this)[0] })
      .attr('y', function() { return d3.mouse(this)[1] - 15 })
      .text(d.product + ", " + d.referrer + ", " + d.value)

  var bbox = tip.select('text').node().getBBox();
  var dx = bbox.height / 5;
  tip.select('rect')
      .attr('x', bbox.x - dx)
      .attr('y', bbox.y - dx)
      .attr('width', bbox.width + 2 * dx)
      .attr('height', bbox.height + 2 * dx)
      .style('fill', '#eee')
      .style('stroke', '#333')
      .style('rx', dx)
      .style('ry', dx)
      .style('fill-opacity', 0.9)
}


function mousemoved(d) {
  tip.select('text')
      .attr('x', function() { return d3.mouse(this)[0] })
      .attr('y', function() { return d3.mouse(this)[1] - 15 })

  var bbox = tip.select('text').node().getBBox();
  var dx = bbox.height / 5;
  tip.select('rect')
      .attr('x', bbox.x - dx)
      .attr('y', bbox.y - dx)
}

function grouped() {
  refs.forEach(function(ref) {
    if (typeof group[ref] === 'undefined') {
      svg.selectAll('.label').remove();
      svg.append('text')
          .attr('x', - width / 4)
          .attr('y', - height / 3)
          .text('ERROR: Referrers need to be grouped... ' + ref);
      throw ref;
    };
  });

  var forceX = d3.forceX(function(d) { return groupLocations[group[d.referrer]].x; });
  var forceY = d3.forceY(function(d) { return groupLocations[group[d.referrer]].y; });

  simulation
      .force("center", undefined)
      .force('collide', forceCollide)
      .force('cluster', undefined)
      .force('gravity', undefined)
      .force('x', forceX)
      .force('y', forceY)
      .alpha(1).restart();

  addGroupedLabels();
}

function combined() {
  simulation
    .force("center", d3.forceCenter())
    .force("collide", forceCollide)
    .force("cluster", forceCluster)
    .force("gravity", d3.forceManyBody(30))
    .force('x', d3.forceX().strength(.4))
    .force('y', d3.forceY().strength(.4))
    .alpha(1).restart();

  addCombinedLabels();
}

function gridded() {
  var forceY = d3.forceY(function(d) { return (3 + refs.indexOf(d.referrer)) * 58 - height / 2; });
  var forceX = d3.forceX(function(d) { return (1 + d.cluster) * 80 - width / 2; });

  simulation
      .force("center", undefined)
      .force('collide', undefined)
      .force('cluster', undefined)
      .force('gravity', undefined)
      .force('x', forceX)
      .force('y', forceY)
      .alpha(1).restart();

  addGridLabels();
}

function mousedout() {
  tip.remove()
}

function addCombinedLabels() {
  svg.selectAll('.label').remove();
  var x = 100 - width / 2;
  svg.append('text').attr('class', 'label')
    .attr('x', x)
    .attr('y', -100)
    .text( 'Content (URL text):' )
    .style('font-size', '1.3em')
  clusters.forEach(function(d, i) {
    var x = 100 - width / 2, y = i * 30 - 70;
    svg.append('text').attr('class', 'label')
        .attr('x', x)
        .attr('y', y)
        .text( d.product )
        .style('fill', color(d.cluster))
        .style('font-size', '1.3em')
  });

  var labels = ['Referrers:'].concat(refs.map(function(d) { return d; }));
  labels.forEach(function(d, i) {
    var x = 150, y = i * 30 - 100;
    var text = groupLabels[group[d]] || null;
    svg.append('text').attr('class', 'label')
        .attr('x', x)
        .attr('y', y)
        .text( d + (text ? ' (' + text + ')' : ''))
        .style('font-size', '1.3em')
  });

  var total = d3.sum(circle.data(), function(d) { return d.value; });
  svg.append('text').attr('class', 'label')
      .attr('y', -175)
      .text( d3.format(',d')(total) + " pageviews/month" )
      .style('font-size', '1.5em')
      .style('text-anchor', 'middle')
}

function addGroupedLabels() {
  svg.selectAll('.label').remove();
  groupLabels.forEach(function(d, i) {
    var circles = circle.data().filter(function(d) { return group[d.referrer] == i; })
    var total = d3.sum(circles, function(d) { return d.value; });
    svg.append('text').attr('class', 'label')
        .style('text-anchor', 'middle')
        .style('font-size', '1.3em')
        .attr('x', groupLocations[i].x)
        .attr('y', groupLocations[i].y - 90)
        .text(d + '  (' + d3.format(',d')(total) + ')' )
  });
}

function addGridLabels() {
  svg.selectAll('.label').remove();
  svg.selectAll('.label')
      .data(refs)
    .enter().append('text')
      .attr('class', 'label')
      .attr('x', 200)
      .attr('y', function(d, i) { return (3 + i) * 60 - height / 2; })
      .text(function(d) { return d + ' (' + groupLabels[group[d]] + ')'; })

  clusters.forEach(function(d, i) {
    var x = (i + 1) * 80 - width / 2, y = 2.3 * 60 - height / 2;
    svg.append('text').attr('class', 'label')
        .attr('transform', 'rotate(-35,' + x + ',' + y + ')')
        .attr('x', x)
        .attr('y', y)
        .text( d.product )
        .style('fill', color(d.cluster))
  })
}
