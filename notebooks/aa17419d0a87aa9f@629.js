import define1 from "./a3d02469b183c13f@1550.js";
import define2 from "./2044e02a89cc688a@921.js";

function _1(md){return(
md`# scatterplot-histogram combo`
)}

function _2(md){return(
md`## interesting ranges

* All of them -- last month
* Shallow ones -- 0-5 km -- last month
* Big ones -- 5+ -- last 10 years
* Deep ones -- 300+ km -- last 10 years
`
)}

function _fig(html,$0,histogram){return(
html`
  <div style="display: flex;">
      <div style="width: 50%;">
        ${$0}
      </div>
      <div style="width: 50%;">
        ${histogram}
      </div>
  </div>`
)}

function _map(Plot,width,land,brushed){return(
Plot.plot({
  projection: "equal-earth",
  width: width/2,
  marks: [
    Plot.graticule(),
    Plot.geo(land, {fill: "#ccc"}),
    Plot.geo(brushed, {r: 1, fill: "#000"}),
    Plot.sphere()
  ],
})
)}

function _5(md){return(
md`## parameters`
)}

function _x(){return(
'depth'
)}

function _y(){return(
"mag"
)}

function _z(){return(
"time"
)}

function _selection(){return(
null
)}

function _10(md){return(
md`## histogram`
)}

function _histogram(Plot,brushed,z){return(
Plot.plot({
  y: {
    grid: true
  },
  marks: [
    Plot.rectY(brushed, Plot.binX({y: "count"}, {x: z, thresholds: 30})),
    Plot.ruleY([0])
  ],
  caption: `Histogram of ${z}`,
  marginTop: 30,
  marginBottom: 30,
  style: {fontSize: 12}
})
)}

function _12(md){return(
md`## scatterplot`
)}

function _brushed(PlotBrush,data,x,y){return(
PlotBrush.plot({
    // style: {fontSize: 15},
    // marginTop: 50,
    // inset: 20,
    grid: true,
    marks: [
      PlotBrush.dot(data, {x: x, y: y, fill: 'black', r: 1, }),
      PlotBrush.brush(data, {x: x, y: y, selection: null })
    ],
    caption: `Scatterplot of ${y} (y-axis) & ${x} (x-axis)`
})
)}

function _14(md){return(
md`## processing`
)}

function _data(geojson,x,convert,y,z){return(
geojson.features.map(d => {
  const obj = {};
  obj[x] = convert(d, x);
  obj[y] = convert(d, y);
  obj[z] = convert(d, z);
  obj.type = "Feature";
  obj.geometry = JSON.parse(JSON.stringify(d.geometry));
  obj.datum = JSON.parse(JSON.stringify(d));
  return obj;
})
)}

function _convert(){return(
function convert(d, x) {
  if (x == "time") return new Date(d.properties[x]);
  if (x == "depth") return d.geometry.coordinates[2];
  return d.properties[x];
}
)}

function _17(md){return(
md`## data`
)}

async function _geojson(d3)
{
  // Interesting time range for all magnitudes
  // const starttime="2022-12-15";
  // const endtime="2023-01-15";

  const starttime="2022-01-15";
  const endtime="2023-01-15";
  // const starttime="2020-01-01"; // 2 years
  // const starttime="2012-01-01"; // 10 years
  // const endtime="2022-01-01";

  const bigones = "&minmagnitude=5";
  const deepones = "&mindepth=300";
  const timerange = `&starttime=${starttime}&endtime=${endtime}`;
  const base = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson";
  
  const url = base
    + timerange
    // + deepones
    + bigones;

  // Last month
  //const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
  
  return await d3.json(url);
}


function _19(md){return(
md`## Appendix`
)}

function _Plot(require){return(
require("@observablehq/plot@0.6.2")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("fig")).define("fig", ["html","viewof brushed","histogram"], _fig);
  main.variable(observer("map")).define("map", ["Plot","width","land","brushed"], _map);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("x")).define("x", _x);
  main.variable(observer("y")).define("y", _y);
  main.variable(observer("z")).define("z", _z);
  main.variable(observer("selection")).define("selection", _selection);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer("histogram")).define("histogram", ["Plot","brushed","z"], _histogram);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer("viewof brushed")).define("viewof brushed", ["PlotBrush","data","x","y"], _brushed);
  main.variable(observer("brushed")).define("brushed", ["Generators", "viewof brushed"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _14);
  main.variable(observer("data")).define("data", ["geojson","x","convert","y","z"], _data);
  main.variable(observer("convert")).define("convert", _convert);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer("geojson")).define("geojson", ["d3"], _geojson);
  main.variable(observer()).define(["md"], _19);
  const child1 = runtime.module(define1);
  main.import("land", child1);
  const child2 = runtime.module(define2);
  main.import("Plot", "PlotBrush", child2);
  main.variable(observer("Plot")).define("Plot", ["require"], _Plot);
  return main;
}
