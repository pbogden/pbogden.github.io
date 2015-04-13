function raster(element, filename) {

// Required properties:
//
//      Bounding box for image  -- western SSA (upper left, lower right)
//      Image dimensions

var filename = filename || "data/ssa/risk.png";

var active = d3.select(null);

// Bounding box for image
var left = -20, bottom = 0, right = 37, top = 28; // Western SSA
//var left = -2, bottom = 3, right = 20, top = 14; // Nigeria

var width, height;

function getimage(cb) {
    var img = new Image();
    img.onload = function() { width = img.width; height = img.height; cb() };
    img.src = filename;
};

// GeoJSON bounding box (multipoint)
var bbPoints = { "type": "Feature",
             "geometry": { "type": "MultiPoint", "coordinates": [[left, top], [right, bottom]] }
    };

queue()
  .defer(d3.json, "data/ssa/ssa.json")
  .defer(d3.json, "data/ssa/africa.json")
  .defer(getimage)
  .await(ready);

// Read topology for country boundaries of western SSA
function ready(error, data, africa) {

  // Fit SVG to DIV container
  var svg = d3.select(element).append('svg')
        .attr('viewBox', "0, 0, " + width + ", " + height)  // min-x, min-y, width, height
        .attr('preserveaspectratio', "xMinYMid")

  var g = svg.append("g")
    .style("stroke-width", "1.0px");

  var projection = d3.geo.equirectangular()
    .translate([0,0])
    .scale(1);

  var path = d3.geo.path()
    .projection(projection);

  // Project to bounding box
  var b = path.bounds(bbPoints),
      s = 1.0 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
      t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

  projection.scale(s).translate(t);

  // Individual country boundaries
  var countries = data.objects.ssa.geometries
                     .map(function(d) { return topojson.feature(data, d); });

  // Africa boundary
  var africa = [ topojson.merge(africa, africa.objects.ne_50m_admin_0_countries.geometries) ];

  g.selectAll("path#Africa")
      .data(africa)
      .enter()
      .append("path")
      .attr('id', 'Africa')
      .attr("d", path)
      .style("fill", "none")
      .style("stroke", "gray")
      .style("stroke-width", "1px")

  g.append("clipPath")
      .attr("id", "clip")
      .append("use")
      .attr("xlink:href", "#Africa");

  g.append("image")
      .attr("width", width)
      .attr("height", height)
      .attr("xlink:href", filename)
      .attr("clip-path", "url(#clip)");

  // Add image element for the cocoa mask
  g.append("image")
      .attr('id', "myRasterMask")
      .attr("width", width)
      .attr("height", height)
//      .attr("xlink:href", "data/cocoa.png")
      .attr("clip-path", "url(#clip)");

  // Toggle the cocoa mask
  var cocoaButton = d3.select('li#cocoa');
 
  cocoaButton
      .on("click", toggleMask);

  function toggleMask(d) {
      var mask = d3.select('#myRasterMask'),
          link = mask.attr('xlink:href'),
          cocoa = "data/cocoa.png";

      if (link == cocoa) {
          mask.attr('xlink:href', ' ');
          cocoaButton.classed('active', false);
      } else {
          mask.attr('xlink:href', cocoa);
          cocoaButton.classed('active', true);
      }
  }

  g.selectAll("path.country")
      .data(countries)
    .enter()
      .append("path")
      .attr('class', 'country')
      .attr("d", path)
      .style("fill-opacity", 0)
      .style("stroke", "#333")
      .style("stroke-width", "2px")
      .style("stroke-linecap", "round")
      .style("stroke-linejoin", "round")
      .on("click", clicked);

  function clicked(d) {
    if (active.node() === this) return reset();
    active.classed("active", false);
    active = d3.select(this).classed("active", true);

    var bounds = path.bounds(d),
    dx = bounds[1][0] - bounds[0][0],
    dy = bounds[1][1] - bounds[0][1],
    x = (bounds[0][0] + bounds[1][0]) / 2,
    y = (bounds[0][1] + bounds[1][1]) / 2,
    scale = .9 / Math.max(dx / width, dy / height),
    translate = [width / 2 - scale * x, height / 2 - scale * y];

    g.transition()
        .duration(750)
        .style("stroke-width", 1.0 / scale + "px")
        .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

    // TRIGGER OTHER GRAPHICS
    var country = active[0][0]["__data__"].properties.admin;

    svg.select('#raster-label').remove();
    svg.append('text')
        .attr('id', 'raster-label')
        .attr('x', width / 2 )
        .attr('y', height / 2 )
        .style('text-anchor', 'middle')
        .style('font-size', height/10)
        .style('fill-opacity', 0.8)
        .text(country);

    console.log('clicked country:', country);
  }

  function reset() {
    active.classed("active", false);
    active = d3.select(null);

    svg.select('#raster-label').remove();

    g.transition()
        .duration(750)
        .style("stroke-width", "1px")
        .attr("transform", "");
  }
}
}
