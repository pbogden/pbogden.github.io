// https://observablehq.com/@pbogden/2018-bubble@536
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# 2018 bubble`
)});
  main.variable(observer("viewof object")).define("viewof object", ["form","html"], function(form,html){return(
form(html`<form>
  <div>
    <label><input name="year" type="radio" value="2018" checked> <i>2018</i></label>
    <label><input name="year" type="radio" value="2017"> <i>2017</i></label>
    <label><input name="year" type="radio" value="2016"> <i>2016</i></label>
    <label><input name="year" type="radio" value="2015"> <i>2015</i></label>
    <label><input name="year" type="radio" value="2014"> <i>2014</i></label>
  </div>
</form>`)
)});
  main.variable(observer("object")).define("object", ["Generators", "viewof object"], (G, _) => G.input(_));
  main.define("initial z", function(){return(
42
)});
  main.variable(observer("mutable z")).define("mutable z", ["Mutable", "initial z"], (M, _) => new M(_));
  main.variable(observer("z")).define("z", ["mutable z"], _ => _.generator);
  main.variable(observer()).define(["d3","chart"], function(d3,chart){return(
d3.select(chart).selectAll('circle.bubble').data().map(d => d.single)
)});
  main.variable(observer("chart")).define("chart", ["d3","topojson","us","data","mutable z"], function(d3,topojson,us,data,$0)
{
  const path = d3.geoPath();
  const width = 960;
  const height = 600;
  const radius = d3.scaleSqrt().domain([0, 6e4]).range([0, 55]);
  const formatNumber = d3.format(",.0f");

  const svg = d3.create("svg")
      .attr("viewBox", "0 0 960 600")
      // .style("width", "100%")
      // .style("height", "auto");
      .attr("width", "960px")
      .attr("height", "600px");
  
  svg.append("g").append("rect")
      .attr("fill", "#fff")
      .attr("width", "960")
      .attr("height", "600")
      .attr("x", 0)
      .attr("y", 0);
  
  const legend = svg.append("g")
      .attr('id', 'legend')
      .attr("transform", `translate(${width - 60},${height - 20})`)
      .attr("text-anchor", "middle")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
    .selectAll("g")
      .data([6e4, 3e4, 1e4])
    .join("g");
  
  legend.append("circle")
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("cy", d => -radius(d))
      .attr("r", radius);

  legend.append("text")
      .attr("y", d => -2 * radius(d))
      .attr("dy", "1.3em")
      .text(d3.format(".1s"));
 
  svg.append("path")
      .datum(topojson.feature(us, us.objects.nation))
      .attr("fill", "#d9d7dc") // fm background
      .attr("d", path);
  
  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round")
      .attr("d", path);
  
  let bubble = svg.selectAll("circle.bubble")
      .data(data)

  bubble.exit().remove();

  bubble = bubble.enter().append("circle")
      .attr('class', "bubble")
      .attr('fill', '#0d2e49')
      .attr('fill-opacity', 0.5)
      .attr('stroke', function(d, i) { return radius(d.single) < 1 ? 'none' : 'white' })
      .attr('stroke-width', 0.5)

    .merge(bubble)
      .attr("transform", d => "translate(" + d.centroid + ")")
      .attr("r", d => radius(d.single))
      .on('mouseover', d => $0.value = d.single)
  
  return svg.node();
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`### Load data`
)});
  main.variable(observer("extent")).define("extent", ["d3","data"], function(d3,data){return(
d3.extent(data.map(d => d.single))
)});
  main.variable(observer()).define(["data"], function(data){return(
data.map(d => d.single)
)});
  main.variable(observer("data")).define("data", ["d3","object","topojson","us"], async function(d3,object,topojson,us)
{
  const path = d3.geoPath();
  let json = await d3.json("https://pbogden.com/single/data/data" + object.year + ".json")
  let myMap = new Map();
  Object.keys(json).forEach((key) => myMap.set(key, json[key]));
  
  let data = topojson.feature(us, us.objects.counties).features
      .map(d => ({ single: myMap.get(d.id), centroid: path.centroid(d) }))
      .filter(d => typeof d.single !== 'undefined')
      .sort((a, b) => b.single - a.single);
  
  return data;
}
);
  main.variable(observer("json")).define("json", ["d3"], function(d3){return(
d3.json("https://pbogden.com/single/data/data2018.json")
)});
  main.variable(observer("fetchPopulation")).define("fetchPopulation", ["d3"], function(d3){return(
function fetchPopulation(date) {
  return d3.json("https://api.census.gov/data/2018/pep/population?get=POP&for=county:*&DATE_CODE=" + date).then(rows => rows.slice(1).sort((a, b) => a[2].localeCompare(b[2]) || a[3].localeCompare(b[3])).map(([population,, state, county]) => [state + county, +population]));
}
)});
  main.variable(observer("color")).define("color", ["d3"], function(d3){return(
d3.scaleDiverging([0, 100, 49203], d3.interpolatePlasma)
)});
  main.variable(observer("format")).define("format", ["d3"], function(d3){return(
d3.format(".2s")
)});
  main.variable(observer("states")).define("states", ["us"], function(us){return(
new Map(us.objects.states.geometries.map(d => [d.id, d.properties]))
)});
  main.variable(observer("us")).define("us", ["d3"], function(d3){return(
d3.json("https://cdn.jsdelivr.net/npm/us-atlas@2/us/10m.json")
)});
  main.variable(observer("topojson")).define("topojson", ["require"], function(require){return(
require("topojson-client@3")
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  main.variable(observer("form")).define("form", ["html","formValue"], function(html,formValue){return(
function form(form) {
  const container = html`<div>${form}`;
  form.addEventListener("submit", event => event.preventDefault());
  form.addEventListener("change", () => container.dispatchEvent(new CustomEvent("input")));
  form.addEventListener("input", () => container.value = formValue(form));
  container.value = formValue(form);
  return container
}
)});
  main.variable(observer("formValue")).define("formValue", function(){return(
function formValue(form) {
  const object = {};
  for (const input of form.elements) {
    if (input.disabled || !input.hasAttribute("name")) continue;
    let value = input.value;
    switch (input.type) {
      case "range":
      case "number": {
        value = input.valueAsNumber;
        break;
      }
      case "date": {
        value = input.valueAsDate;
        break;
      }
      case "radio": {
        if (!input.checked) continue;
        break;
      }
      case "checkbox": {
        if (input.checked) value = true;
        else if (input.name in object) continue;
        else value = false;
        break;
      }
      case "file": {
        value = input.multiple ? input.files : input.files[0];
        break;
      }
    }
    object[input.name] = value;
  }
  return object;
}
)});
  return main;
}
