function _geo(location,md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none">Geo Mark / Observable Plot</h1><a href="/@observablehq/plot?collection=@observablehq/plot">Observable Plot</a> › <a href="/@observablehq/plot-marks?collection=@observablehq/plot">Marks</a> › Geo · <a href="https://github.com/observablehq/plot/blob/main/README.md#geo">API</a></div>

# Plot: Geo

The **geo** mark draws geographic features and other polygonal geometry, often as maps. It works with Plot’s flexible [geographic projection system](https://observablehq.com/@observablehq/plot-projections${location.search}).`
)}

function _2(Plot,counties){return(
Plot.geo(counties, {fill: (d) => d.properties.unemployment}).plot({
  projection: "albers-usa",
  color: {
    type: "quantile",
    n: 8,
    scheme: "blues",
    label: "Unemployment (%)",
    legend: true
  }
})
)}

function _channels(md){return(
md`The [choropleth map](https://en.wikipedia.org/wiki/Choropleth_map) above shows county-level unemployment rates for the contiguous United States. To create it, we join a collection of county polygons (a GeoJSON file) with a table of unemployment rates (a CSV file): the _fill_ function looks up the unemployment rate for the given county. The data is prepared and explained in the [appendix below](#appendix).`
)}

function _features(md){return(
md`A geo mark’s data is typically [GeoJSON](https://geojson.org/). You can pass a single GeoJSON object, a feature or geometry collection, or an array or iterable of GeoJSON objects. The map below combines Point, LineString, and MultiPolygon geometries to track Charles Darwin’s voyage on HMS _Beagle_. (Data via [Benjamin Schmidt](/@bmschmidt/data-driven-projections-darwins-world).)`
)}

function _land(FileAttachment){return(
FileAttachment("land.json").json()
)}

function _beagle(FileAttachment){return(
FileAttachment("beagle.json").json()
)}

function _london(){return(
{type: "Point", coordinates: [-0.13, 51.5]}
)}

function _8(Plot,land,beagle,london){return(
Plot.geo([land, beagle, london]).plot({projection: "equirectangular"})
)}

function _9(md){return(
md`To improve this map, we can fill the land, thicken the line, increase the point size, add a bit of color to the [line](/@observablehq/plot-line) mark, and a caption. We can also adopt the [Equal Earth](https://equal-earth.com/equal-earth-projection.html) projection designed by Bojan Šavrič, Bernhard Jenny, and Tom Patterson.`
)}

function _10(Plot,land,beagle,london,htl){return(
Plot.plot({
  projection: "equal-earth",
  marks: [
    Plot.geo(land, {fill: "currentColor"}),
    Plot.graticule(),
    Plot.line(beagle.coordinates, {stroke: (d, i) => i, z: null, strokeWidth: 2}),
    Plot.geo(london, {fill: "red", r: 5}),
    Plot.sphere()
  ],
  caption: htl.html`The voyage of Charles Darwin aboard HMS <i>Beagle</i>, 1831–1836.`
})
)}

function _11(md){return(
md`Note how the line uses the default _auto_ **curve** option, which interpolates by using the shortest path which, on the sphere, follows the great circle. Try and change the code above to specify curve: "linear" on the line mark, and see the difference!`
)}

function _12(md){return(
md`The convenience helper Plot.**graticule** draws a uniform grid of meridians (constant longitude) and parallels (constant latitude) every 10° between ±80° latitude (for the polar regions, meridians every 90°). Plot.**sphere**, for its part, draws the outline of the projected sphere.`
)}

function _13(Plot){return(
Plot.plot({
  inset: 4,
  height: 400,
  projection: {type: "orthographic", rotate: [0, -35, 20]},
  marks: [Plot.graticule({strokeOpacity: 0.5}), Plot.sphere()]
})
)}

function _14(md){return(
md`Like all marks, geo accepts both constant and channel values for the common mark options (such as fill, stroke, opacity…). The constant <b style="color: red;">red</b> color above allowed us to style the Point representing London. A variable channel, in turn, produces a different color for each geometry based on the associated datum.`
)}

function _15(md){return(
md`The radius of Point and MultiPoint geometries is specified via the *r* option. It can be a constant number in pixels (as with London above), or a channel. If it a channel, geometries are sorted by descending radius, and the effective radius is controlled by the _r_ scale, which defaults to _sqrt_ such that the area of a point is proportional to its value. Points with a negative radius are not rendered.`
)}

async function _earthquakes(){return(
(await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson")).json()
)}

function _17(Plot,land,earthquakes){return(
Plot.plot({
  projection: "equirectangular",
  marks: [
    Plot.graticule(),
    Plot.geo(land, {fill: "#ccc"}),
    Plot.geo(earthquakes, {r: d => Math.exp(d.properties.mag)}),
    Plot.sphere()
  ]
})
)}

function _18(md){return(
md`As an alternative to Plot.geo with point geometries, you can pass longitude and latitude to Plot.dot’s _x_ and _y_ channels, and indeed many of Plot’s basic marks can be projected (like we did with the [line](/@observablehq/plot-line) mark for the _Beagle_’s route). You can even mix the two types of marks, depending on how your dataset is structured! Maps often layer several marks, as the [Mapping with Plot](/@observablehq/plot-mapping) notebook illustrates.`
)}

function _19(md){return(
md`The geo mark’s _geometry_ channel can be used to generate geometry from a non-GeoJSON data source. For example, to visualize the shockwave created by the explosion of the Hunga Tonga–Hunga Haʻapai volcano on January 15, 2022 with a series of geodesic circles of increasing radius:`
)}

function _20(Plot,land,radii,d3,tonga){return(
Plot.plot({
  projection: {
    type: "equal-earth",
    rotate: [90, 0]
  },
  color: {
    legend: true,
    label: "Distance from Tonga (km)",
    transform: (d) => 111.2 * d, // degrees to km
    nice: true
  },
  marks: [
    Plot.geo(land),
    Plot.geo(radii, {
      geometry: d3
        .geoCircle()
        .center(tonga)
        .radius((r) => r),
      stroke: (r) => r,
      strokeWidth: 2
    }),
    Plot.geo({ type: "Point", coordinates: tonga }, { fill: "red", r: 4 }),
    Plot.sphere()
  ]
})
)}

function _radii(d3){return(
d3.range(10, 171, 10)
)}

function _tonga(){return(
[-175.38, -20.57]
)}

function _23(md){return(
md`Lastly, Plot.geo is not limited to spherical geometries. [Plot’s projection system](/@observablehq/plot-projection) includes planar projections, which allow you to work with shapes—such as contours—generated on an arbitrary flat surface.`
)}

function _appendix(md){return(
md`---

## Appendix`
)}

function _25(md){return(
md`### GeoJSON, TopoJSON and other formats for geographic information

The GeoJSON format is a common way to represent geographic shapes: it can be used to specify geometries such as points (Point and MultiPoint), lines (LineString, MultiLineString), and areas (Polygon, MultiPolygon). Geometries can also be assembled and connected to properties (such as names, values…), to create Features.`
)}

function _26(md){return(
md`For various reasons, features are often stored in a different format than GeoJSON. A common format is TopoJSON, which both offers a more compact representation (faster loading times), and facilitates topological operations such as merging polygons, computing meshes of edges, etc. Before feeding these to Plot.geo, you have to convert them to GeoJSON with the [topojson-client](https://github.com/topojson/topojson-client) library—automatically available in Observable notebooks. Other libraries exist that can read various formats used to encode geographic shapes—such as shapefiles, geoparquet, _etc._ In all cases, there exists a way to create a GeoJSON representation from these files, that we can pass to Plot.geo.`
)}

function _27(md){return(
md`In fact, in the case of TopoJSON files, the code that does the job is shorter than our explanation! See below how we extract the *nation* feature, aggregate the edges between states in *statemesh*, and retrieve the counties as a FeatureCollection, all from a single file *us-counties-10m.json*, saved as a TopoJSON file attachment.`
)}

function _us(FileAttachment){return(
FileAttachment("us-counties-10m.json").json()
)}

function _nation(topojson,us){return(
topojson.feature(us, us.objects.nation)
)}

function _statemesh(topojson,us){return(
topojson.mesh(us, us.objects.states, (a, b) => a !== b)
)}

function _counties(unemployment,topojson,us)
{
  const rate = new Map(unemployment.map(({id, rate}) => [id, rate]));
  const counties = topojson.feature(us, us.objects.counties);
  for (const county of counties.features) county.properties.unemployment = rate.get(county.id);
  return counties;
}


function _32(md){return(
md`### Tabular data

The dataset below contains the 2016 unemployment rates for each county from the [U.S. Bureau of Labor Statistics](https://www.bls.gov/lau/tables.htm). Above, we index them by the county’s [FIPS code](https://en.wikipedia.org/wiki/FIPS_county_code) for faster access when joining them with the geometries.`
)}

async function _unemployment(FileAttachment){return(
(await FileAttachment("us-county-unemployment.csv").csv()).map(({rate, ...rest}) => ({...rest, rate: +rate}))
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["us-counties-10m.json", {url: new URL("./files/783cf2bf259e16d662d92c9f59ec97e564c50841c5984f2bb6f65a6d31f8c1b80846bffb65cb654dc2b587ac96f0007ab68c24bacce33655fd785e46020aff74.json", import.meta.url), mimeType: "application/json", toString}],
    ["us-county-unemployment.csv", {url: new URL("./files/ee8afc06d280f74df98603cf5b594f7eec8acf249c84f006e01b9bad44eb6fa325f93034fbe26120c473fc9d0f1c2be90b3ba11c384751b2dc1429c98a6c0cb6.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["land.json", {url: new URL("./files/d5b12e83fa8ef8dc76ac8b1d051975e330b55d783f279c4314f18ffbfdd3b7e2c948dc47f6a1aa20d71069cf17f3c300b2da6556f7afbf9bac595cde4014aa4e.json", import.meta.url), mimeType: "application/json", toString}],
    ["beagle.json", {url: new URL("./files/fee89c376624f835f9700ea61f06611feffec64c19a4dc769ac58a13865f576c1e4505a6f4281b346aeef79904d1c2729b5336b4c7b99caa941f7e78575e3e6d.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer("geo")).define("geo", ["location","md"], _geo);
  main.variable(observer()).define(["Plot","counties"], _2);
  main.variable(observer("channels")).define("channels", ["md"], _channels);
  main.variable(observer("features")).define("features", ["md"], _features);
  main.variable(observer("land")).define("land", ["FileAttachment"], _land);
  main.variable(observer("beagle")).define("beagle", ["FileAttachment"], _beagle);
  main.variable(observer("london")).define("london", _london);
  main.variable(observer()).define(["Plot","land","beagle","london"], _8);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer()).define(["Plot","land","beagle","london","htl"], _10);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer()).define(["Plot"], _13);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer()).define(["md"], _15);
  main.variable(observer("earthquakes")).define("earthquakes", _earthquakes);
  main.variable(observer()).define(["Plot","land","earthquakes"], _17);
  main.variable(observer()).define(["md"], _18);
  main.variable(observer()).define(["md"], _19);
  main.variable(observer()).define(["Plot","land","radii","d3","tonga"], _20);
  main.variable(observer("radii")).define("radii", ["d3"], _radii);
  main.variable(observer("tonga")).define("tonga", _tonga);
  main.variable(observer()).define(["md"], _23);
  main.variable(observer("appendix")).define("appendix", ["md"], _appendix);
  main.variable(observer()).define(["md"], _25);
  main.variable(observer()).define(["md"], _26);
  main.variable(observer()).define(["md"], _27);
  main.variable(observer("us")).define("us", ["FileAttachment"], _us);
  main.variable(observer("nation")).define("nation", ["topojson","us"], _nation);
  main.variable(observer("statemesh")).define("statemesh", ["topojson","us"], _statemesh);
  main.variable(observer("counties")).define("counties", ["unemployment","topojson","us"], _counties);
  main.variable(observer()).define(["md"], _32);
  main.variable(observer("unemployment")).define("unemployment", ["FileAttachment"], _unemployment);
  return main;
}
