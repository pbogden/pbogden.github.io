import define1 from "./32eeadb67cb4cbcb@1472.js";

function _1(md){return(
md`# Plot.brush ([#71](https://github.com/observablehq/plot/pull/71))


Issues:
- how to make it compatible with title/tooltip? (this is an issue with d3-brush rather than Plot?)
`
)}

function _2(md){return(
md`## 2D brush`
)}

function _selection(Plot,data){return(
Plot.plot({marks: [
  Plot.dot(data, { fill: "2", r: 2.5, stroke: "black", strokeWidth: 0.5 }),
  Plot.brush(data, { selection: [[-2, 2], [0, 0]] })
]})
)}

function _4(selection){return(
selection
)}

function _5(Plot,selection,data){return(
Plot.plot({marks: [
  Plot.dot(selection, {fill: "2", stroke: selection.length < data.length ? "none" : "black", strokeWidth: 0.5, r: 3})
]})
)}

function _6(Plot,selection){return(
Plot.plot({
  color: { scheme: "pubu" },
  marks: [ Plot.rect(selection, Plot.bin({fill: "count"}, {thresholds: 40})) ]
})
)}

function _7(md){return(
md`## 1-d brushes`
)}

function _selectionX(Plot,data,first){return(
Plot.plot({marks: [
  Plot.ruleX(data, { x: first, stroke: "pink" }),
  Plot.brushX(data, { x: first, selection: [0, 1] })
]})
)}

function _9(selectionX){return(
selectionX
)}

function _selectionY(Plot,data,first){return(
Plot.plot({marks: [
  Plot.ruleY(data, { y: first, stroke: "orange" }),
  Plot.brushY(data, { y: first, selection: [0, 5] })
]})
)}

function _first(){return(
d => d[0]
)}

function _12(selectionY){return(
selectionY
)}

function _13(md){return(
md`## Faceting
`
)}

function _penguins_selection(Plot,penguins,width){return(
Plot.plot({
  height: 640,
  grid: true,
  x: {
    label: "flipper_length →   /   dot color represents sex"
  },
  y: {
    label: "↑ bill_length"
  },
  facet: {
    data: penguins,
    x: "island"
    // y: "sex"
  },
  marks: [
    Plot.frame(),
    Plot.dot(penguins, {
      x: "flipper_length",
      y: "bill_length",
      r: 2,
      fill: "sex"
    }),
    Plot.brush(penguins, {
      x: "flipper_length",
      y: "bill_length",
      selection: [
        [220, 45],
        [180, 55]
      ]
    })
  ],
  width,
  height: width * 0.38
})
)}

function _16(d3,penguins_selection){return(
d3.group(penguins_selection, d => d.island)
)}

function _17(md){return(
md`## Scales

Plot.brush does not reserve the scales. It also works well with ordinal scales.
`
)}

function _penguins_selection_ordinal(Plot,data,penguins,width){return(
Plot.plot({
  height: 640,
  grid: true,
  x: {
    label: " dot color represents sex"
  },
  y: {
    label: "↑ bill_length"
  },
  facet: {
    data,
    x: "island"
    // y: "sex"
  },
  marks: [
    Plot.frame(),
    Plot.dot(penguins, {
      x: "species", //"flipper_length",
      y: "bill_length",
      r: 2,
      fill: "sex"
    }),
    Plot.brush(penguins, {
      x: "species", //"flipper_length_mm",
      y: "bill_length",
      selection: [
        [220, 45],
        [180, 55]
      ]
    })
  ],
  width,
  height: width * 0.38
})
)}

function _19(d3,penguins_selection_ordinal){return(
d3.group(penguins_selection_ordinal, d => d.island, d => d.species)
)}

function _20(md){return(
md`## Dimensions`
)}

function _21(md){return(
md`Sometimes the plot is 2-dimensional but we want a 1-d brush:`
)}

function _selection1(Plot,data){return(
Plot.plot({
  marks: [
    Plot.rectY(data, Plot.binX({ y: "count" }, { x: "0" })),
    Plot.brushX(data, { x: "0" })
  ]
})
)}

function _23(selection1){return(
selection1
)}

function _selectionY2(Plot,data,first){return(
Plot.plot({
  marks: [
    Plot.dot(data, { y: first, x: Math.random }),
    Plot.brushY(data, { y: first, selection: [0, 5] })
  ]
})
)}

function _25(selectionY2){return(
selectionY2
)}

function _26(md){return(
md`## onbrush

Pass a function as the onbrush option (name??) to use a callback. The default is to inform "viewof". Receives the D3 brush event and the selected data. (We're using a mutable to demonstrate, but it could be any other function.)`
)}

function _27(Plot,penguins,$0,width){return(
Plot.plot({
  marks: [
    Plot.frame(),
    Plot.dot(
      penguins.filter((d) => d.flipper_length < 185),
      {
        x: "flipper_length",
        y: "bill_length",
        r: 2,
        fill: "sex"
      }
    ),
    Plot.brush(penguins, {
      x: "flipper_length",
      y: "bill_length",
      selection: [
        [184.5, 45],
        [180, 55]
      ],
      onbrush: (event, values) => ($0.value = { event, values })
    })
  ],
  width: 300,
  height: width * 0.38,
  inset: 14,
  caption: "A caption"
})
)}

function _minibrush(){return(
""
)}

function _29(md,minibrush){return(
md`Current selection: ${
  minibrush.event.selection
    ? JSON.stringify(
        minibrush.event.selection.map((d) => d.map((e) => +e.toFixed(2)))
      )
    : null
}`
)}

function _30(minibrush){return(
minibrush.values
)}

function _31(md){return(
md`---
_boring zone_`
)}

async function _Plot(require,FileAttachment){return(
require(await FileAttachment("plot@14.umd.js").url())
)}

function _random(d3){return(
d3.randomNormal()
)}

function _data(random){return(
Array.from({length: 500}, () => [random(), random(), random()])
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["plot@14.umd.js", {url: new URL("./files/b62ecba69260f59ab4490bd0b985865ae5ecdf66a2691f622ce740e663526baffb88f38190aa3d22cf3c6542dd99b41a48a9b358fe0394b79873085a76d79ca0.js", import.meta.url), mimeType: "application/javascript", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("viewof selection")).define("viewof selection", ["Plot","data"], _selection);
  main.variable(observer("selection")).define("selection", ["Generators", "viewof selection"], (G, _) => G.input(_));
  main.variable(observer()).define(["selection"], _4);
  main.variable(observer()).define(["Plot","selection","data"], _5);
  main.variable(observer()).define(["Plot","selection"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer("viewof selectionX")).define("viewof selectionX", ["Plot","data","first"], _selectionX);
  main.variable(observer("selectionX")).define("selectionX", ["Generators", "viewof selectionX"], (G, _) => G.input(_));
  main.variable(observer()).define(["selectionX"], _9);
  main.variable(observer("viewof selectionY")).define("viewof selectionY", ["Plot","data","first"], _selectionY);
  main.variable(observer("selectionY")).define("selectionY", ["Generators", "viewof selectionY"], (G, _) => G.input(_));
  main.variable(observer("first")).define("first", _first);
  main.variable(observer()).define(["selectionY"], _12);
  main.variable(observer()).define(["md"], _13);
  const child1 = runtime.module(define1);
  main.import("data", "penguins", child1);
  main.variable(observer("viewof penguins_selection")).define("viewof penguins_selection", ["Plot","penguins","width"], _penguins_selection);
  main.variable(observer("penguins_selection")).define("penguins_selection", ["Generators", "viewof penguins_selection"], (G, _) => G.input(_));
  main.variable(observer()).define(["d3","penguins_selection"], _16);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer("viewof penguins_selection_ordinal")).define("viewof penguins_selection_ordinal", ["Plot","data","penguins","width"], _penguins_selection_ordinal);
  main.variable(observer("penguins_selection_ordinal")).define("penguins_selection_ordinal", ["Generators", "viewof penguins_selection_ordinal"], (G, _) => G.input(_));
  main.variable(observer()).define(["d3","penguins_selection_ordinal"], _19);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer()).define(["md"], _21);
  main.variable(observer("viewof selection1")).define("viewof selection1", ["Plot","data"], _selection1);
  main.variable(observer("selection1")).define("selection1", ["Generators", "viewof selection1"], (G, _) => G.input(_));
  main.variable(observer()).define(["selection1"], _23);
  main.variable(observer("viewof selectionY2")).define("viewof selectionY2", ["Plot","data","first"], _selectionY2);
  main.variable(observer("selectionY2")).define("selectionY2", ["Generators", "viewof selectionY2"], (G, _) => G.input(_));
  main.variable(observer()).define(["selectionY2"], _25);
  main.variable(observer()).define(["md"], _26);
  main.variable(observer()).define(["Plot","penguins","mutable minibrush","width"], _27);
  main.define("initial minibrush", _minibrush);
  main.variable(observer("mutable minibrush")).define("mutable minibrush", ["Mutable", "initial minibrush"], (M, _) => new M(_));
  main.variable(observer("minibrush")).define("minibrush", ["mutable minibrush"], _ => _.generator);
  main.variable(observer()).define(["md","minibrush"], _29);
  main.variable(observer()).define(["minibrush"], _30);
  main.variable(observer()).define(["md"], _31);
  main.variable(observer("Plot")).define("Plot", ["require","FileAttachment"], _Plot);
  main.variable(observer("random")).define("random", ["d3"], _random);
  main.variable(observer("data")).define("data", ["random"], _data);
  return main;
}
