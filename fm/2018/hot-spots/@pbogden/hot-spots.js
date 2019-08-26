// https://observablehq.com/@pbogden/hot-spots@1168
import define1 from "../@mbostock/form-input.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Hot spots`
)});
  main.variable(observer("radioValue")).define("radioValue", ["Generators","radioView"], function(Generators,radioView){return(
Generators.input(radioView)
)});
  main.variable(observer("radioView")).define("radioView", ["form","html"], function(form,html){return(
form(html`<form>
  <div>
    <label><input name="year" type="radio" value="total" checked> <i>2018</i></label>
    <label><input name="year" type="radio" value="2017"> <i>2017</i></label>
    <label><input name="year" type="radio" value="2016"> <i>2016</i></label>
    <label><input name="year" type="radio" value="2015"> <i>2015</i></label>
    <label><input name="year" type="radio" value="2014"> <i>2014</i></label>
  </div>
</form>`)
)});
  main.variable(observer("map")).define("map", ["d3","DOM","width","height","basemap"], function(d3,DOM,width,height,basemap)
{
  const div = d3.select(DOM.element('div')).style('width', width + 'px').style('height', height + 'px');
  const svg = div.append('svg').style('position', 'absolute').attr('width', '100%').attr('height', '100%'); 
  
  div.node().insertBefore(basemap.canvas, svg.node());
  d3.select(basemap.canvas).style('position', 'absolute');
  
  return div.node();
}
);
  main.variable(observer("viewof url")).define("viewof url", ["html"], function(html)
{
  const options = [
    {
      name: "CartoDB Voyager",
      value: (x, y, z) => `https://${"abc"[Math.abs(x + y) % 3]}.basemaps.cartocdn.com/rastertiles/voyager/${z}/${x}/${y}${devicePixelRatio > 1 ? "@2x" : ""}.png`
    },
    {
      name: "Stamen Terrain",
      value: (x, y, z) => `https://stamen-tiles-${"abc"[Math.abs(x + y) % 3]}.a.ssl.fastly.net/terrain/${z}/${x}/${y}${devicePixelRatio > 1 ? "@2x" : ""}.png`,
      selected: true
    },
    {
      name: "Stamen Toner",
      value: (x, y, z) => `https://stamen-tiles-${"abc"[Math.abs(x + y) % 3]}.a.ssl.fastly.net/toner/${z}/${x}/${y}${devicePixelRatio > 1 ? "@2x" : ""}.png`
    },
    {
      name: "Stamen Toner (hybrid)",
      value: (x, y, z) => `https://stamen-tiles-${"abc"[Math.abs(x + y) % 3]}.a.ssl.fastly.net/toner-hybrid/${z}/${x}/${y}${devicePixelRatio > 1 ? "@2x" : ""}.png`
    },
    {
      name: "Stamen Toner (lite)",
      value: (x, y, z) => `https://stamen-tiles-${"abc"[Math.abs(x + y) % 3]}.a.ssl.fastly.net/toner-lite/${z}/${x}/${y}${devicePixelRatio > 1 ? "@2x" : ""}.png`
    },
    {
      name: "Stamen Watercolor",
      value: (x, y, z) => `https://stamen-tiles-${"abc"[Math.abs(x + y) % 3]}.a.ssl.fastly.net/watercolor/${z}/${x}/${y}.png`
    },
    {
      name: "OSM Mapnik", 
      value: (x, y, z) => `https://${"abc"[Math.abs(x + y) % 3]}.tile.osm.org/${z}/${x}/${y}.png`
    },
    {
      name: "Wikimedia Maps", 
      value: (x, y, z) => `https://maps.wikimedia.org/osm-intl/${z}/${x}/${y}.png`
    }
  ];
  const form = html`<form><select name=i>${options.map(({name}) => Object.assign(html`<option>`, {textContent: name}))}`;
  form.i.onchange = () => {
    form.value = options[form.i.selectedIndex].value;
    form.dispatchEvent(new CustomEvent("input"));
  };
  form.i.selectedIndex = Math.max(0, options.findIndex(o => o.selected));
  form.value = options[form.i.selectedIndex].value;
  return form;
}
);
  main.variable(observer("url")).define("url", ["Generators", "viewof url"], (G, _) => G.input(_));
  main.variable(observer()).define(["d3","map","data","loan_rate","html"], function(d3,map,data,loan_rate,html)
{
  d3.select(map).select('svg').selectAll("circle")
    .data(data)
    .join("circle")
  //     .sort(function(a,b) { return Math.abs(b.properties[budget]) - Math.abs(a.properties[budget]) })
      .attr("fill", d => loan_rate(d) > 0.04 ? '#c55147' : '#007697')
      .attr('fill-opacity', d => loan_rate(d) > 0.04 ? .8 : .5)
      .attr('cx', d => d[1].x)
      .attr('cy', d => d[1].y)
      .attr("r", d => d[1].households > 1000 ? 70 * loan_rate(d) : null)
  //     .on('mouseover click', (d) => div.property("value", d.properties).dispatch("input"))
  //     .on('mouseout', () => div.property("value", "").dispatch("input"))
  
  // div.property("value", "").dispatch('input');
  return html`Add circles`
}
);
  main.variable(observer()).define(["d3","map"], function(d3,map){return(
d3.select(map).select('svg').selectAll('circle').nodes()
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Data`
)});
  main.variable(observer("loan_rate")).define("loan_rate", ["radioValue"], function(radioValue){return(
(d) => d[1].households ? d[1][radioValue.year] / d[1].households : null
)});
  main.variable(observer("data")).define("data", ["d3","projection"], async function(d3,projection)
{
  let data = await d3.json("https://pbogden.com/single/data/irs_data.json");
  data = Object.entries(data);
  data = data.filter(d => projection([d[1].lon, d[1].lat]) != null) // removes Puerto Rico
  data.forEach(d => { 
    let xy = projection([d[1].lon, d[1].lat]);
    d[1].x = xy[0]; 
    d[1].y = xy[1];
    return d; 
  });
  return data
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`### Map
Map tiles copyright [OpenStreetMap contributors](https://www.openstreetmap.org/copyright).`
)});
  main.variable(observer("height")).define("height", ["width"], function(width){return(
600 * width / 960
)});
  main.variable(observer("tileSize")).define("tileSize", function(){return(
256
)});
  main.variable(observer("tile")).define("tile", ["d3","width","height","projection"], function(d3,width,height,projection){return(
d3.tile()
    .size([width, height])
    .scale(projection.scale() * 2 * Math.PI)
    .translate(projection([0, 0]))
)});
  main.variable(observer("projection")).define("projection", ["d3","width","height"], function(d3,width,height){return(
d3.geoMercator()
    .center([-96, 39])
    .scale(Math.pow(2, 12.5) / (2 * Math.PI))
    .translate([width / 2, height / 2])
)});
  main.variable(observer("path")).define("path", ["d3","projection"], function(d3,projection){return(
d3.geoPath(projection)
)});
  main.variable(observer("basemap")).define("basemap", ["tile","DOM","tileSize","url","width","height"], async function(tile,DOM,tileSize,url,width,height)
{
  const tiles = tile();
  const [x0, y0] = tiles[0];
  const [x1, y1] = tiles[tiles.length - 1];
  const offscreenContext = DOM.context2d((x1 - x0 + 1) * tileSize, (y1 - y0 + 1) * tileSize);
  for (const [x, y, image] of await Promise.all(tiles.map(([x, y, z]) => new Promise((resolve, reject) => {
    const image = new Image;
    image.onerror = reject;
    image.onload = () => resolve(image);
    image.src = url(x, y, z);
  }).then(image => [x, y, image])))) {
    offscreenContext.drawImage(image, (x - x0) * tileSize, (y - y0) * tileSize, tileSize, tileSize);
  }
  const context = DOM.context2d(width, height);
  context.drawImage(
    offscreenContext.canvas,
    Math.round((x0 + tiles.translate[0]) * tiles.scale),
    Math.round((y0 + tiles.translate[1]) * tiles.scale),
    (x1 - x0 + 1) * tiles.scale,
    (y1 - y0 + 1) * tiles.scale
  );
  return context;
}
);
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5", "d3-geo@1", "d3-tile@0.0.3")
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Appendix`
)});
  const child1 = runtime.module(define1);
  main.import("form", child1);
  return main;
}
