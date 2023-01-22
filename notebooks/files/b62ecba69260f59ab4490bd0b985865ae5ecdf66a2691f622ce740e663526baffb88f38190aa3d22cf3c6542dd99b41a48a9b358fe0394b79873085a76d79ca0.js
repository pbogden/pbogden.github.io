// @observablehq/plot v0.3.2 Copyright 2020-2021 Observable, Inc.
(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3@7.2.1/dist/d3.min.js')) :
typeof define === 'function' && define.amd ? define(['exports', 'd3@7.2.1/dist/d3.min.js'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Plot = global.Plot || {}, global.d3));
})(this, (function (exports, d3) { 'use strict';

var version = "0.3.2";

function format(date, fallback) {
  if (!(date instanceof Date)) date = new Date(+date);
  if (isNaN(date)) return typeof fallback === "function" ? fallback(date) : fallback;
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();
  const milliseconds = date.getUTCMilliseconds();
  return `${formatYear(date.getUTCFullYear())}-${pad(date.getUTCMonth() + 1, 2)}-${pad(date.getUTCDate(), 2)}${
    hours || minutes || seconds || milliseconds ? `T${pad(hours, 2)}:${pad(minutes, 2)}${
      seconds || milliseconds ? `:${pad(seconds, 2)}${
        milliseconds ? `.${pad(milliseconds, 3)}` : ``
      }` : ``
    }Z` : ``
  }`;
}

function formatYear(year) {
  return year < 0 ? `-${pad(-year, 6)}`
    : year > 9999 ? `+${pad(year, 6)}`
    : pad(year, 4);
}

function pad(value, width) {
  return `${value}`.padStart(width, "0");
}

const re = /^(?:[-+]\d{2})?\d{4}(?:-\d{2}(?:-\d{2})?)?(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d{3})?)?(?:Z|[-+]\d{2}:?\d{2})?)?$/;

function parse(string, fallback) {
  if (!re.test(string += "")) return typeof fallback === "function" ? fallback(string) : fallback;
  return new Date(string);
}

function formatMonth(locale = "en-US", month = "short") {
  const format = new Intl.DateTimeFormat(locale, {timeZone: "UTC", month});
  return i => {
    if (i != null && !isNaN(i = new Date(Date.UTC(2000, +i)))) {
      return format.format(i);
    }
  };
}

function formatWeekday(locale = "en-US", weekday = "short") {
  const format = new Intl.DateTimeFormat(locale, {timeZone: "UTC", weekday});
  return i => {
    if (i != null && !isNaN(i = new Date(Date.UTC(2001, 0, +i)))) {
      return format.format(i);
    }
  };
}

function formatIsoDate(date) {
  return format(date, "Invalid Date");
}

function defined(x) {
  return x != null && !Number.isNaN(x);
}

function ascendingDefined(a, b) {
  return defined(b) - defined(a) || d3.ascending(a, b);
}

function nonempty(x) {
  return x != null && `${x}` !== "";
}

function filter$1(index, ...channels) {
  for (const c of channels) {
    if (c) index = index.filter(i => defined(c[i]));
  }
  return index;
}

function finite(x) {
  return isFinite(x) ? x : NaN;
}

function positive(x) {
  return x > 0 && isFinite(x) ? x : NaN;
}

function negative(x) {
  return x < 0 && isFinite(x) ? x : NaN;
}

function firstof(...values) {
  for (const v of values) {
    if (v !== undefined) {
      return v;
    }
  }
}

// Positional scales have associated axes, and for ordinal data, a point or band
// scale is used instead of an ordinal scale.
const position = Symbol("position");

// Color scales default to the turbo interpolator for quantitative data, and to
// the Tableau10 scheme for ordinal data. In the future, color scales may also
// have an associated legend.
const color = Symbol("color");

// Radius scales default to the sqrt type, have a default range of [0, 3], and a
// default domain from 0 to the median first quartile of associated channels.
const radius = Symbol("radius");

// Opacity scales have a default range of [0, 1], and a default domain from 0 to
// the maximum value of associated channels.
const opacity = Symbol("opacity");

// TODO Rather than hard-coding the list of known scale names, collect the names
// and categories for each plot specification, so that custom marks can register
// custom scales.
const registry = new Map([
  ["x", position],
  ["y", position],
  ["fx", position],
  ["fy", position],
  ["r", radius],
  ["color", color],
  ["opacity", opacity]
]);

const offset = typeof window !== "undefined" && window.devicePixelRatio > 1 ? 0 : 0.5;

function styles(
  mark,
  {
    title,
    href,
    target,
    fill,
    fillOpacity,
    stroke,
    strokeWidth,
    strokeOpacity,
    strokeLinejoin,
    strokeLinecap,
    strokeMiterlimit,
    strokeDasharray,
    opacity,
    mixBlendMode,
    shapeRendering
  },
  channels,
  {
    fill: defaultFill = "currentColor",
    stroke: defaultStroke = "none",
    strokeWidth: defaultStrokeWidth,
    strokeLinejoin: defaultStrokeLinejoin,
    strokeMiterlimit: defaultStrokeMiterlimit
  }
) {

  // Some marks don’t support fill (e.g., tick and rule).
  if (defaultFill === null) {
    fill = null;
    fillOpacity = null;
  }

  // Some marks don’t support stroke (e.g., image).
  if (defaultStroke === null) {
    stroke = null;
    strokeOpacity = null;
  }

  // Some marks default to fill with no stroke, while others default to stroke
  // with no fill. For example, bar and area default to fill, while dot and line
  // default to stroke. For marks that fill by default, the default fill only
  // applies if the stroke is (constant) none; if you set a stroke, then the
  // default fill becomes none. Similarly for marks that stroke by stroke, the
  // default stroke only applies if the fill is (constant) none.
  if (none(defaultFill)) {
    if (!none(defaultStroke) && !none(fill)) defaultStroke = "none";
  } else {
    if (none(defaultStroke) && !none(stroke)) defaultFill = "none";
  }

  const [vfill, cfill] = maybeColor(fill, defaultFill);
  const [vfillOpacity, cfillOpacity] = maybeNumber(fillOpacity);
  const [vstroke, cstroke] = maybeColor(stroke, defaultStroke);
  const [vstrokeOpacity, cstrokeOpacity] = maybeNumber(strokeOpacity);
  const [vopacity, copacity] = maybeNumber(opacity);

  // For styles that have no effect if there is no stroke, only apply the
  // defaults if the stroke is not (constant) none.
  if (cstroke !== "none") {
    if (strokeWidth === undefined) strokeWidth = defaultStrokeWidth;
    if (strokeLinejoin === undefined) strokeLinejoin = defaultStrokeLinejoin;
    if (strokeMiterlimit === undefined) strokeMiterlimit = defaultStrokeMiterlimit;
  }

  const [vstrokeWidth, cstrokeWidth] = maybeNumber(strokeWidth);

  // Some marks don’t support fill (e.g., tick and rule).
  if (defaultFill !== null) {
    mark.fill = impliedString(cfill, "currentColor");
    mark.fillOpacity = impliedNumber(cfillOpacity, 1);
  }

  // Some marks don’t support stroke (e.g., image).
  if (defaultStroke !== null) {
    mark.stroke = impliedString(cstroke, "none");
    mark.strokeWidth = impliedNumber(cstrokeWidth, 1);
    mark.strokeOpacity = impliedNumber(cstrokeOpacity, 1);
    mark.strokeLinejoin = impliedString(strokeLinejoin, "miter");
    mark.strokeLinecap = impliedString(strokeLinecap, "butt");
    mark.strokeMiterlimit = impliedNumber(strokeMiterlimit, 4);
    mark.strokeDasharray = string(strokeDasharray);
  }

  mark.target = string(target);
  mark.opacity = impliedNumber(copacity, 1);
  mark.mixBlendMode = impliedString(mixBlendMode, "normal");
  mark.shapeRendering = impliedString(shapeRendering, "auto");

  return [
    ...channels,
    {name: "title", value: title, optional: true},
    {name: "href", value: href, optional: true},
    {name: "fill", value: vfill, scale: "color", optional: true},
    {name: "fillOpacity", value: vfillOpacity, scale: "opacity", optional: true},
    {name: "stroke", value: vstroke, scale: "color", optional: true},
    {name: "strokeOpacity", value: vstrokeOpacity, scale: "opacity", optional: true},
    {name: "strokeWidth", value: vstrokeWidth, optional: true},
    {name: "opacity", value: vopacity, scale: "opacity", optional: true}
  ];
}

function applyChannelStyles(selection, {target}, {title: L, fill: F, fillOpacity: FO, stroke: S, strokeOpacity: SO, strokeWidth: SW, opacity: O, href: H}) {
  if (F) applyAttr(selection, "fill", i => F[i]);
  if (FO) applyAttr(selection, "fill-opacity", i => FO[i]);
  if (S) applyAttr(selection, "stroke", i => S[i]);
  if (SO) applyAttr(selection, "stroke-opacity", i => SO[i]);
  if (SW) applyAttr(selection, "stroke-width", i => SW[i]);
  if (O) applyAttr(selection, "opacity", i => O[i]);
  if (H) applyHref(selection, i => H[i], target);
  title(L)(selection);
}

function applyGroupedChannelStyles(selection, {target}, {title: L, fill: F, fillOpacity: FO, stroke: S, strokeOpacity: SO, strokeWidth: SW, opacity: O, href: H}) {
  if (F) applyAttr(selection, "fill", ([i]) => F[i]);
  if (FO) applyAttr(selection, "fill-opacity", ([i]) => FO[i]);
  if (S) applyAttr(selection, "stroke", ([i]) => S[i]);
  if (SO) applyAttr(selection, "stroke-opacity", ([i]) => SO[i]);
  if (SW) applyAttr(selection, "stroke-width", ([i]) => SW[i]);
  if (O) applyAttr(selection, "opacity", ([i]) => O[i]);
  if (H) applyHref(selection, ([i]) => H[i], target);
  titleGroup(L)(selection);
}

function applyIndirectStyles(selection, mark) {
  applyAttr(selection, "fill", mark.fill);
  applyAttr(selection, "fill-opacity", mark.fillOpacity);
  applyAttr(selection, "stroke", mark.stroke);
  applyAttr(selection, "stroke-width", mark.strokeWidth);
  applyAttr(selection, "stroke-opacity", mark.strokeOpacity);
  applyAttr(selection, "stroke-linejoin", mark.strokeLinejoin);
  applyAttr(selection, "stroke-linecap", mark.strokeLinecap);
  applyAttr(selection, "stroke-miterlimit", mark.strokeMiterlimit);
  applyAttr(selection, "stroke-dasharray", mark.strokeDasharray);
  applyAttr(selection, "shape-rendering", mark.shapeRendering);
}

function applyDirectStyles(selection, mark) {
  applyStyle(selection, "mix-blend-mode", mark.mixBlendMode);
  applyAttr(selection, "opacity", mark.opacity);
}

function applyHref(selection, href, target) {
  selection.each(function(i) {
    const h = href(i);
    if (h != null) {
      const a = document.createElementNS(d3.namespaces.svg, "a");
      a.setAttributeNS(d3.namespaces.xlink, "href", h);
      if (target != null) a.setAttribute("target", target);
      this.parentNode.insertBefore(a, this).appendChild(this);
    }
  });
}

function applyAttr(selection, name, value) {
  if (value != null) selection.attr(name, value);
}

function applyStyle(selection, name, value) {
  if (value != null) selection.style(name, value);
}

function applyTransform(selection, x, y, tx, ty) {
  if (x && x.bandwidth) tx += x.bandwidth() / 2;
  if (y && y.bandwidth) ty += y.bandwidth() / 2;
  if (tx || ty) selection.attr("transform", `translate(${tx},${ty})`);
}

function impliedString(value, impliedValue) {
  if ((value = string(value)) !== impliedValue) return value;
}

function impliedNumber(value, impliedValue) {
  if ((value = number(value)) !== impliedValue) return value;
}

function filterStyles(index, {fill: F, fillOpacity: FO, stroke: S, strokeOpacity: SO, strokeWidth: SW}) {
  return filter$1(index, F, FO, S, SO, SW);
}

function none(color) {
  return color == null || color === "none";
}

const validClassName = /^-?([_a-z]|[\240-\377]|\\[0-9a-f]{1,6}(\r\n|[ \t\r\n\f])?|\\[^\r\n\f0-9a-f])([_a-z0-9-]|[\240-\377]|\\[0-9a-f]{1,6}(\r\n|[ \t\r\n\f])?|\\[^\r\n\f0-9a-f])*$/;

function maybeClassName(name) {
  if (name === undefined) return `plot-${Math.random().toString(16).slice(2)}`;
  name = `${name}`;
  if (!validClassName.test(name)) throw new Error(`invalid class name: ${name}`);
  return name;
}

function applyInlineStyles(selection, style) {
  if (typeof style === "string") {
    selection.property("style", style);
  } else if (style != null) {
    for (const element of selection) {
      Object.assign(element.style, style);
    }
  }
}

function composeTransform(t1, t2) {
  if (t1 == null) return t2 === null ? undefined : t2;
  if (t2 == null) return t1 === null ? undefined : t1;
  return (data, facets) => {
    ({data, facets} = t1(data, facets));
    return t2(arrayify(data), facets);
  };
}

function filter(value, options) {
  return basic(options, filterTransform(value));
}

function filterTransform(value) {
  return (data, facets) => {
    const V = valueof(data, value);
    return {data, facets: facets.map(I => I.filter(i => V[i]))};
  };
}

function reverse(options) {
  return basic(options, reverseTransform);
}

function reverseTransform(data, facets) {
  return {data, facets: facets.map(I => I.slice().reverse())};
}

function shuffle({seed, ...options} = {}) {
  return basic(options, sortValue(seed == null ? Math.random : d3.randomLcg(seed)));
}

function sort(value, options) {
  return basic(options, sortTransform(value));
}

function sortTransform(value) {
  return (typeof value === "function" && value.length !== 1 ? sortCompare : sortValue)(value);
}

function sortCompare(compare) {
  return (data, facets) => {
    const compareData = (i, j) => compare(data[i], data[j]);
    return {data, facets: facets.map(I => I.slice().sort(compareData))};
  };
}

function sortValue(value) {
  return (data, facets) => {
    const V = valueof(data, value);
    const compareValue = (i, j) => ascendingDefined(V[i], V[j]);
    return {data, facets: facets.map(I => I.slice().sort(compareValue))};
  };
}

// If both t1 and t2 are defined, returns a composite transform that first
// applies t1 and then applies t2.
function basic({
  filter: f1,
  sort: s1,
  reverse: r1,
  transform: t1,
  ...options
} = {}, t2) {
  if (t1 === undefined) { // explicit transform overrides filter, sort, and reverse
    if (f1 != null) t1 = filterTransform(f1);
    if (s1 != null && !isOptions(s1)) t1 = composeTransform(t1, sortTransform(s1));
    if (r1) t1 = composeTransform(t1, reverseTransform);
  }
  return {
    ...options,
    ...isOptions(s1) && {sort: s1},
    transform: composeTransform(t1, t2)
  };
}

// Group on {z, fill, stroke}.
function groupZ(outputs, options) {
  return groupn(null, null, outputs, options);
}

// Group on {z, fill, stroke}, then on x.
function groupX(outputs = {y: "count"}, options = {}) {
  const {x = identity} = options;
  if (x == null) throw new Error("missing channel: x");
  return groupn(x, null, outputs, options);
}

// Group on {z, fill, stroke}, then on y.
function groupY(outputs = {x: "count"}, options = {}) {
  const {y = identity} = options;
  if (y == null) throw new Error("missing channel: y");
  return groupn(null, y, outputs, options);
}

// Group on {z, fill, stroke}, then on x and y.
function group(outputs = {fill: "count"}, options = {}) {
  let {x, y} = options;
  ([x, y] = maybeTuple(x, y));
  if (x == null) throw new Error("missing channel: x");
  if (y == null) throw new Error("missing channel: y");
  return groupn(x, y, outputs, options);
}

function groupn(
  x, // optionally group on x
  y, // optionally group on y
  {
    data: reduceData = reduceIdentity,
    filter,
    sort,
    reverse,
    ...outputs // output channel definitions
  } = {},
  inputs = {} // input channels and options
) {

  // Compute the outputs.
  outputs = maybeOutputs(outputs, inputs);
  reduceData = maybeReduce$1(reduceData, identity);
  sort = sort == null ? undefined : maybeOutput("sort", sort, inputs);
  filter = filter == null ? undefined : maybeEvaluator("filter", filter, inputs);

  // Produce x and y output channels as appropriate.
  const [GX, setGX] = maybeLazyChannel(x);
  const [GY, setGY] = maybeLazyChannel(y);

  // Greedily materialize the z, fill, and stroke channels (if channels and not
  // constants) so that we can reference them for subdividing groups without
  // computing them more than once.
  const {
    z,
    fill,
    stroke,
    x1, x2, // consumed if x is an output
    y1, y2, // consumed if y is an output
    ...options
  } = inputs;
  const [GZ, setGZ] = maybeLazyChannel(z);
  const [vfill] = maybeColor(fill);
  const [vstroke] = maybeColor(stroke);
  const [GF = fill, setGF] = maybeLazyChannel(vfill);
  const [GS = stroke, setGS] = maybeLazyChannel(vstroke);

  return {
    ..."z" in inputs && {z: GZ || z},
    ..."fill" in inputs && {fill: GF || fill},
    ..."stroke" in inputs && {stroke: GS || stroke},
    ...basic(options, (data, facets) => {
      const X = valueof(data, x);
      const Y = valueof(data, y);
      const Z = valueof(data, z);
      const F = valueof(data, vfill);
      const S = valueof(data, vstroke);
      const G = maybeSubgroup(outputs, Z, F, S);
      const groupFacets = [];
      const groupData = [];
      const GX = X && setGX([]);
      const GY = Y && setGY([]);
      const GZ = Z && setGZ([]);
      const GF = F && setGF([]);
      const GS = S && setGS([]);
      let i = 0;
      for (const o of outputs) o.initialize(data);
      if (sort) sort.initialize(data);
      if (filter) filter.initialize(data);
      for (const facet of facets) {
        const groupFacet = [];
        for (const o of outputs) o.scope("facet", facet);
        if (sort) sort.scope("facet", facet);
        if (filter) filter.scope("facet", facet);
        for (const [f, I] of maybeGroup(facet, G)) {
          for (const [y, gg] of maybeGroup(I, Y)) {
            for (const [x, g] of maybeGroup(gg, X)) {
              if (filter && !filter.reduce(g)) continue;
              groupFacet.push(i++);
              groupData.push(reduceData.reduce(g, data));
              if (X) GX.push(x);
              if (Y) GY.push(y);
              if (Z) GZ.push(G === Z ? f : Z[g[0]]);
              if (F) GF.push(G === F ? f : F[g[0]]);
              if (S) GS.push(G === S ? f : S[g[0]]);
              for (const o of outputs) o.reduce(g);
              if (sort) sort.reduce(g);
            }
          }
        }
        groupFacets.push(groupFacet);
      }
      maybeSort(groupFacets, sort, reverse);
      return {data: groupData, facets: groupFacets};
    }),
    ...!hasOutput(outputs, "x") && (GX ? {x: GX} : {x1, x2}),
    ...!hasOutput(outputs, "y") && (GY ? {y: GY} : {y1, y2}),
    ...Object.fromEntries(outputs.map(({name, output}) => [name, output]))
  };
}

function hasOutput(outputs, ...names) {
  for (const {name} of outputs) {
    if (names.includes(name)) {
      return true;
    }
  }
  return false;
}

function maybeOutputs(outputs, inputs) {
  return Object.entries(outputs).map(([name, reduce]) => {
    return reduce == null
      ? {name, initialize() {}, scope() {}, reduce() {}}
      : maybeOutput(name, reduce, inputs);
  });
}

function maybeOutput(name, reduce, inputs) {
  const evaluator = maybeEvaluator(name, reduce, inputs);
  const [output, setOutput] = lazyChannel(evaluator.label);
  let O;
  return {
    name,
    output,
    initialize(data) {
      evaluator.initialize(data);
      O = setOutput([]);
    },
    scope(scope, I) {
      evaluator.scope(scope, I);
    },
    reduce(I, extent) {
      O.push(evaluator.reduce(I, extent));
    }
  };
}

function maybeEvaluator(name, reduce, inputs) {
  const input = maybeInput(name, inputs);
  const reducer = maybeReduce$1(reduce, input);
  let V, context;
  return {
    label: labelof(reducer === reduceCount ? null : input, reducer.label),
    initialize(data) {
      V = input === undefined ? data : valueof(data, input);
      if (reducer.scope === "data") {
        context = reducer.reduce(range(data), V);
      }
    },
    scope(scope, I) {
      if (reducer.scope === scope) {
        context = reducer.reduce(I, V);
      }
    },
    reduce(I, extent) {
      return reducer.scope == null
        ? reducer.reduce(I, V, extent)
        : reducer.reduce(I, V, context, extent);
    }
  };
}

function maybeGroup(I, X) {
  return X ? d3.sort(d3.group(I, i => X[i]), first$1) : [[, I]];
}

function maybeReduce$1(reduce, value) {
  if (reduce && typeof reduce.reduce === "function") return reduce;
  if (typeof reduce === "function") return reduceFunction(reduce);
  switch (`${reduce}`.toLowerCase()) {
    case "first": return reduceFirst$1;
    case "last": return reduceLast$1;
    case "count": return reduceCount;
    case "distinct": return reduceDistinct;
    case "sum": return value == null ? reduceCount : reduceSum$1;
    case "proportion": return reduceProportion(value, "data");
    case "proportion-facet": return reduceProportion(value, "facet");
    case "deviation": return reduceAccessor(d3.deviation);
    case "min": return reduceAccessor(d3.min);
    case "min-index": return reduceAccessor(d3.minIndex);
    case "max": return reduceAccessor(d3.max);
    case "max-index": return reduceAccessor(d3.maxIndex);
    case "mean": return reduceAccessor(d3.mean);
    case "median": return reduceAccessor(d3.median);
    case "variance": return reduceAccessor(d3.variance);
    case "mode": return reduceAccessor(d3.mode);
    case "x1": return reduceX1;
    case "x2": return reduceX2;
    case "y1": return reduceY1;
    case "y2": return reduceY2;
  }
  throw new Error("invalid reduce");
}

function maybeSubgroup(outputs, Z, F, S) {
  return firstof(
    outputs.some(o => o.name === "z") ? undefined : Z,
    outputs.some(o => o.name === "fill") ? undefined : F,
    outputs.some(o => o.name === "stroke") ? undefined : S
  );
}

function maybeSort(facets, sort, reverse) {
  if (sort) {
    const S = sort.output.transform();
    const compare = (i, j) => ascendingDefined(S[i], S[j]);
    facets.forEach(f => f.sort(compare));
  }
  if (reverse) {
    facets.forEach(f => f.reverse());
  }
}

function reduceFunction(f) {
  return {
    reduce(I, X, extent) {
      return f(take(X, I), extent);
    }
  };
}

function reduceAccessor(f) {
  return {
    reduce(I, X) {
      return f(I, i => X[i]);
    }
  };
}

const reduceIdentity = {
  reduce(I, X) {
    return take(X, I);
  }
};

const reduceFirst$1 = {
  reduce(I, X) {
    return X[I[0]];
  }
};

const reduceLast$1 = {
  reduce(I, X) {
    return X[I[I.length - 1]];
  }
};

const reduceCount = {
  label: "Frequency",
  reduce(I) {
    return I.length;
  }
};

const reduceDistinct = {
  label: "Distinct",
  reduce: (I, X) => {
    const s = new d3.InternSet();
    for (const i of I) s.add(X[i]);
    return s.size;
  }
};

const reduceSum$1 = reduceAccessor(d3.sum);

function reduceProportion(value, scope) {
  return value == null
      ? {scope, label: "Frequency", reduce: (I, V, basis = 1) => I.length / basis}
      : {scope, reduce: (I, V, basis = 1) => d3.sum(I, i => V[i]) / basis};
}

const reduceX1 = {
  reduce(I, X, {x1}) {
    return x1;
  }
};

const reduceX2 = {
  reduce(I, X, {x2}) {
    return x2;
  }
};

const reduceY1 = {
  reduce(I, X, {y1}) {
    return y1;
  }
};

const reduceY2 = {
  reduce(I, X, {y2}) {
    return y2;
  }
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray
const TypedArray = Object.getPrototypeOf(Uint8Array);
const objectToString = Object.prototype.toString;

class Mark {
  constructor(data, channels = [], options = {}, defaults) {
    const {facet = "auto", sort, dx, dy} = options;
    const names = new Set();
    this.data = data;
    this.sort = isOptions(sort) ? sort : null;
    this.facet = facet == null || facet === false ? null : keyword(facet === true ? "include" : facet, "facet", ["auto", "include", "exclude"]);
    const {transform} = basic(options);
    this.transform = transform;
    if (defaults !== undefined) channels = styles(this, options, channels, defaults);
    this.channels = channels.filter(channel => {
      const {name, value, optional} = channel;
      if (value == null) {
        if (optional) return false;
        throw new Error(`missing channel value: ${name}`);
      }
      if (name !== undefined) {
        const key = `${name}`;
        if (key === "__proto__") throw new Error("illegal channel name");
        if (names.has(key)) throw new Error(`duplicate channel: ${key}`);
        names.add(key);
      }
      return true;
    });
    this.dx = +dx || 0;
    this.dy = +dy || 0;
  }
  initialize(facets, facetChannels) {
    let data = arrayify(this.data);
    let index = facets === undefined && data != null ? range(data) : facets;
    if (data !== undefined && this.transform !== undefined) {
      if (facets === undefined) index = index.length ? [index] : [];
      ({facets: index, data} = this.transform(data, index));
      data = arrayify(data);
      if (facets === undefined && index.length) ([index] = index);
    }
    const channels = this.channels.map(channel => {
      const {name} = channel;
      return [name == null ? undefined : `${name}`, Channel(data, channel)];
    });
    if (this.sort != null) channelSort(channels, facetChannels, data, this.sort);
    return {index, channels};
  }
  plot({marks = [], ...options} = {}) {
    return plot({...options, marks: [...marks, this]});
  }
}

// TODO Type coercion?
function Channel(data, {scale, type, value}) {
  return {
    scale,
    type,
    value: valueof(data, value),
    label: labelof(value)
  };
}

function channelSort(channels, facetChannels, data, options) {
  const {reverse: defaultReverse, reduce: defaultReduce = true, limit: defaultLimit} = options;
  for (const x in options) {
    if (!registry.has(x)) continue; // ignore unknown scale keys
    const {value: y, reverse = defaultReverse, reduce = defaultReduce, limit = defaultLimit} = maybeValue(options[x]);
    if (reduce == null || reduce === false) continue; // disabled reducer
    const X = channels.find(([, {scale}]) => scale === x) || facetChannels && facetChannels.find(([, {scale}]) => scale === x);
    if (!X) throw new Error(`missing channel for scale: ${x}`);
    const XV = X[1].value;
    const [lo = 0, hi = Infinity] = limit && typeof limit[Symbol.iterator] === "function" ? limit : limit < 0 ? [limit] : [0, limit];
    if (y == null) {
      X[1].domain = () => {
        let domain = XV;
        if (reverse) domain = domain.slice().reverse();
        if (lo !== 0 || hi !== Infinity) domain = domain.slice(lo, hi);
        return domain;
      };
    } else {
      let YV;
      if (y === "data") {
        YV = data;
      } else {
        const Y = channels.find(([name]) => name === y);
        if (!Y) throw new Error(`missing channel: ${y}`);
        YV = Y[1].value;
      }
      const reducer = maybeReduce$1(reduce === true ? "max" : reduce, YV);
      X[1].domain = () => {
        let domain = d3.rollup(range(XV), I => reducer.reduce(I, YV), i => XV[i]);
        domain = d3.sort(domain, reverse ? descendingGroup : ascendingGroup);
        if (lo !== 0 || hi !== Infinity) domain = domain.slice(lo, hi);
        return domain.map(first$1);
      };
    }
  }
}

// This allows transforms to behave equivalently to channels.
function valueof(data, value, type) {
  const array = type === undefined ? Array : type;
  return typeof value === "string" ? array.from(data, field(value))
    : typeof value === "function" ? array.from(data, value)
    : typeof value === "number" || value instanceof Date ? array.from(data, constant(value))
    : value && typeof value.transform === "function" ? arrayify(value.transform(data), type)
    : arrayify(value, type); // preserve undefined type
}

const field = name => d => d[name];
const indexOf = (d, i) => i;
const identity = {transform: d => d};
const string = x => x == null ? x : `${x}`;
const number = x => x == null ? x : +x;
const boolean = x => x == null ? x : !!x;
const first$1 = d => d[0];
const second = d => d[1];
const constant = x => () => x;

// A few extra color keywords not known to d3-color.
const colors = new Set(["currentColor", "none"]);

// Some channels may allow a string constant to be specified; to differentiate
// string constants (e.g., "red") from named fields (e.g., "date"), this
// function tests whether the given value is a CSS color string and returns a
// tuple [channel, constant] where one of the two is undefined, and the other is
// the given value. If you wish to reference a named field that is also a valid
// CSS color, use an accessor (d => d.red) instead.
function maybeColor(value, defaultValue) {
  if (value === undefined) value = defaultValue;
  return value === null ? [undefined, "none"]
    : typeof value === "string" && (colors.has(value) || d3.color(value)) ? [undefined, value]
    : [value, undefined];
}

// Similar to maybeColor, this tests whether the given value is a number
// indicating a constant, and otherwise assumes that it’s a channel value.
function maybeNumber(value, defaultValue) {
  if (value === undefined) value = defaultValue;
  return value === null || typeof value === "number" ? [undefined, value]
    : [value, undefined];
}

// Validates the specified optional string against the allowed list of keywords.
function maybeKeyword(input, name, allowed) {
  if (input != null) return keyword(input, name, allowed);
}

// Validates the specified required string against the allowed list of keywords.
function keyword(input, name, allowed) {
  const i = `${input}`.toLowerCase();
  if (!allowed.includes(i)) throw new Error(`invalid ${name}: ${input}`);
  return i;
}

// Promotes the specified data to an array or typed array as needed. If an array
// type is provided (e.g., Array), then the returned array will strictly be of
// the specified type; otherwise, any array or typed array may be returned. If
// the specified data is null or undefined, returns the value as-is.
function arrayify(data, type) {
  return data == null ? data : (type === undefined
    ? (data instanceof Array || data instanceof TypedArray) ? data : Array.from(data)
    : (data instanceof type ? data : type.from(data)));
}

// Disambiguates an options object (e.g., {y: "x2"}) from a primitive value.
function isObject(option) {
  return option && option.toString === objectToString;
}

// Disambiguates an options object (e.g., {y: "x2"}) from a channel value
// definition expressed as a channel transform (e.g., {transform: …}).
function isOptions(option) {
  return isObject(option) && typeof option.transform !== "function";
}

// For marks specified either as [0, x] or [x1, x2], such as areas and bars.
function maybeZero(x, x1, x2, x3 = identity) {
  if (x1 === undefined && x2 === undefined) { // {x} or {}
    x1 = 0, x2 = x === undefined ? x3 : x;
  } else if (x1 === undefined) { // {x, x2} or {x2}
    x1 = x === undefined ? 0 : x;
  } else if (x2 === undefined) { // {x, x1} or {x1}
    x2 = x === undefined ? 0 : x;
  }
  return [x1, x2];
}

// For marks that have x and y channels (e.g., cell, dot, line, text).
function maybeTuple(x, y) {
  return x === undefined && y === undefined ? [first$1, second] : [x, y];
}

// A helper for extracting the z channel, if it is variable. Used by transforms
// that require series, such as moving average and normalize.
function maybeZ({z, fill, stroke} = {}) {
  if (z === undefined) ([z] = maybeColor(fill));
  if (z === undefined) ([z] = maybeColor(stroke));
  return z;
}

// Applies the specified titles via selection.call.
function title(L) {
  return L ? selection => selection
    .filter(i => nonempty(L[i]))
    .append("title")
      .text(i => L[i]) : () => {};
}

// title for groups (lines, areas).
function titleGroup(L) {
  return L ? selection => selection
    .filter(([i]) => nonempty(L[i]))
    .append("title")
      .text(([i]) => L[i]) : () => {};
}

// Returns a Uint32Array with elements [0, 1, 2, … data.length - 1].
function range(data) {
  return Uint32Array.from(data, indexOf);
}

// Returns a filtered range of data given the test function.
function where(data, test) {
  return range(data).filter(i => test(data[i], i, data));
}

// Returns an array [values[index[0]], values[index[1]], …].
function take(values, index) {
  return Array.from(index, i => values[i]);
}

function maybeInput(key, options) {
  if (options[key] !== undefined) return options[key];
  switch (key) {
    case "x1": case "x2": key = "x"; break;
    case "y1": case "y2": key = "y"; break;
  }
  return options[key];
}

// Defines a channel whose values are lazily populated by calling the returned
// setter. If the given source is labeled, the label is propagated to the
// returned channel definition.
function lazyChannel(source) {
  let value;
  return [
    {
      transform: () => value,
      label: labelof(source)
    },
    v => value = v
  ];
}

function labelof(value, defaultValue) {
  return typeof value === "string" ? value
    : value && value.label !== undefined ? value.label
    : defaultValue;
}

// Like lazyChannel, but allows the source to be null.
function maybeLazyChannel(source) {
  return source == null ? [source] : lazyChannel(source);
}

// Assuming that both x1 and x2 and lazy channels (per above), this derives a
// new a channel that’s the average of the two, and which inherits the channel
// label (if any). Both input channels are assumed to be quantitative. If either
// channel is temporal, the returned channel is also temporal.
function mid(x1, x2) {
  return {
    transform(data) {
      const X1 = x1.transform(data);
      const X2 = x2.transform(data);
      return isTemporal(X1) || isTemporal(X2)
        ? Array.from(X1, (_, i) => new Date((+X1[i] + +X2[i]) / 2))
        : Float64Array.from(X1, (_, i) => (+X1[i] + +X2[i]) / 2);
    },
    label: x1.label
  };
}

// This distinguishes between per-dimension options and a standalone value.
function maybeValue(value) {
  return value === undefined || isOptions(value) ? value : {value};
}

function numberChannel(source) {
  return {
    transform: data => valueof(data, source, Float64Array),
    label: labelof(source)
  };
}

function isOrdinal(values) {
  for (const value of values) {
    if (value == null) continue;
    const type = typeof value;
    return type === "string" || type === "boolean";
  }
}

function isTemporal(values) {
  for (const value of values) {
    if (value == null) continue;
    return value instanceof Date;
  }
}

function markify(mark) {
  return mark instanceof Mark ? mark : new Render(mark);
}

class Render extends Mark {
  constructor(render) {
    super();
    if (render == null) return;
    if (typeof render !== "function") throw new TypeError("invalid mark");
    this.render = render;
  }
  render() {}
}

function marks(...marks) {
  marks.plot = Mark.prototype.plot;
  return marks;
}

function ascendingGroup([ak, av], [bk, bv]) {
  return d3.ascending(av, bv) || d3.ascending(ak, bk);
}

function descendingGroup([ak, av], [bk, bv]) {
  return d3.descending(av, bv) || d3.ascending(ak, bk);
}

class AxisX {
  constructor({
    name = "x",
    axis,
    ticks,
    tickSize = name === "fx" ? 0 : 6,
    tickPadding = tickSize === 0 ? 9 : 3,
    tickFormat,
    fontVariant,
    grid,
    label,
    labelAnchor,
    labelOffset,
    line,
    tickRotate
  } = {}) {
    this.name = name;
    this.axis = keyword(axis, "axis", ["top", "bottom"]);
    this.ticks = ticks;
    this.tickSize = number(tickSize);
    this.tickPadding = number(tickPadding);
    this.tickFormat = tickFormat;
    this.fontVariant = impliedString(fontVariant, "normal");
    this.grid = boolean(grid);
    this.label = string(label);
    this.labelAnchor = maybeKeyword(labelAnchor, "labelAnchor", ["center", "left", "right"]);
    this.labelOffset = number(labelOffset);
    this.line = boolean(line);
    this.tickRotate = number(tickRotate);
  }
  render(
    index,
    {[this.name]: x, fy},
    channels,
    {
      width,
      height,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      facetMarginTop,
      facetMarginBottom,
      labelMarginLeft = 0,
      labelMarginRight = 0
    }
  ) {
    const {
      axis,
      fontVariant,
      grid,
      label,
      labelAnchor,
      labelOffset,
      line,
      tickRotate
    } = this;
    const offset = this.name === "x" ? 0 : axis === "top" ? marginTop - facetMarginTop : marginBottom - facetMarginBottom;
    const offsetSign = axis === "top" ? -1 : 1;
    const ty = offsetSign * offset + (axis === "top" ? marginTop : height - marginBottom);
    return d3.create("svg:g")
        .attr("transform", `translate(0,${ty})`)
        .call(createAxis(axis === "top" ? d3.axisTop : d3.axisBottom, x, this))
        .call(maybeTickRotate, tickRotate)
        .attr("font-size", null)
        .attr("font-family", null)
        .attr("font-variant", fontVariant)
        .call(!line ? g => g.select(".domain").remove() : () => {})
        .call(!grid ? () => {}
          : fy ? gridFacetX(index, fy, -ty)
          : gridX(offsetSign * (marginBottom + marginTop - height)))
        .call(!label ? () => {} : g => g.append("text")
            .attr("fill", "currentColor")
            .attr("transform", `translate(${
                labelAnchor === "center" ? (width + marginLeft - marginRight) / 2
                  : labelAnchor === "right" ? width + labelMarginRight
                  : -labelMarginLeft
              },${labelOffset * offsetSign})`)
            .attr("dy", axis === "top" ? "1em" : "-0.32em")
            .attr("text-anchor", labelAnchor === "center" ? "middle"
                : labelAnchor === "right" ? "end"
                : "start")
            .text(label))
      .node();
  }
}

class AxisY {
  constructor({
    name = "y",
    axis,
    ticks,
    tickSize = name === "fy" ? 0 : 6,
    tickPadding = tickSize === 0 ? 9 : 3,
    tickFormat,
    fontVariant,
    grid,
    label,
    labelAnchor,
    labelOffset,
    line,
    tickRotate
  } = {}) {
    this.name = name;
    this.axis = keyword(axis, "axis", ["left", "right"]);
    this.ticks = ticks;
    this.tickSize = number(tickSize);
    this.tickPadding = number(tickPadding);
    this.tickFormat = tickFormat;
    this.fontVariant = impliedString(fontVariant, "normal");
    this.grid = boolean(grid);
    this.label = string(label);
    this.labelAnchor = maybeKeyword(labelAnchor, "labelAnchor", ["center", "top", "bottom"]);
    this.labelOffset = number(labelOffset);
    this.line = boolean(line);
    this.tickRotate = number(tickRotate);
  }
  render(
    index,
    {[this.name]: y, fx},
    channels,
    {
      width,
      height,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      facetMarginLeft,
      facetMarginRight
    }
  ) {
    const {
      axis,
      fontVariant,
      grid,
      label,
      labelAnchor,
      labelOffset,
      line,
      tickRotate
    } = this;
    const offset = this.name === "y" ? 0 : axis === "left" ? marginLeft - facetMarginLeft : marginRight - facetMarginRight;
    const offsetSign = axis === "left" ? -1 : 1;
    const tx = offsetSign * offset + (axis === "right" ? width - marginRight : marginLeft);
    return d3.create("svg:g")
        .attr("transform", `translate(${tx},0)`)
        .call(createAxis(axis === "right" ? d3.axisRight : d3.axisLeft, y, this))
        .call(maybeTickRotate, tickRotate)
        .attr("font-size", null)
        .attr("font-family", null)
        .attr("font-variant", fontVariant)
        .call(!line ? g => g.select(".domain").remove() : () => {})
        .call(!grid ? () => {}
          : fx ? gridFacetY(index, fx, -tx)
          : gridY(offsetSign * (marginLeft + marginRight - width)))
        .call(!label ? () => {} : g => g.append("text")
            .attr("fill", "currentColor")
            .attr("transform", `translate(${labelOffset * offsetSign},${
                labelAnchor === "center" ? (height + marginTop - marginBottom) / 2
                  : labelAnchor === "bottom" ? height - marginBottom
                  : marginTop
              })${labelAnchor === "center" ? ` rotate(-90)` : ""}`)
            .attr("dy", labelAnchor === "center" ? (axis === "right" ? "-0.32em" : "0.75em")
                : labelAnchor === "bottom" ? "1.4em"
                : "-1em")
            .attr("text-anchor", labelAnchor === "center" ? "middle"
                : axis === "right" ? "end"
                : "start")
            .text(label))
      .node();
  }
}

function gridX(y2) {
  return g => g.selectAll(".tick line")
    .clone(true)
      .attr("stroke-opacity", 0.1)
      .attr("y2", y2);
}

function gridY(x2) {
  return g => g.selectAll(".tick line")
    .clone(true)
      .attr("stroke-opacity", 0.1)
      .attr("x2", x2);
}

function gridFacetX(index, fy, ty) {
  const dy = fy.bandwidth();
  const domain = fy.domain();
  return g => g.selectAll(".tick")
    .append("path")
      .attr("stroke", "currentColor")
      .attr("stroke-opacity", 0.1)
      .attr("d", (index ? take(domain, index) : domain).map(v => `M0,${fy(v) + ty}v${dy}`).join(""));
}

function gridFacetY(index, fx, tx) {
  const dx = fx.bandwidth();
  const domain = fx.domain();
  return g => g.selectAll(".tick")
    .append("path")
      .attr("stroke", "currentColor")
      .attr("stroke-opacity", 0.1)
      .attr("d", (index ? take(domain, index) : domain).map(v => `M${fx(v) + tx},0h${dx}`).join(""));
}

// D3 doesn’t provide a tick format for ordinal scales; we want shorthand when
// an ordinal domain is numbers or dates, and we want null to mean the empty
// string, not the default identity format.
function maybeTickFormat(tickFormat, domain) {
  return tickFormat === undefined ? (isTemporal(domain) ? formatIsoDate : string)
      : typeof tickFormat === "function" ? tickFormat
      : (typeof tickFormat === "string" ? (isTemporal(domain) ? d3.utcFormat : d3.format)
      : constant)(tickFormat);
}

function createAxis(axis, scale, {ticks, tickSize, tickPadding, tickFormat}) {
  if (!scale.tickFormat) {
    tickFormat = maybeTickFormat(tickFormat, scale.domain());
  }
  return axis(scale)
    .ticks(Array.isArray(ticks) ? null : ticks, typeof tickFormat === "function" ? null : tickFormat)
    .tickFormat(typeof tickFormat === "function" ? tickFormat : null)
    .tickSizeInner(tickSize)
    .tickSizeOuter(0)
    .tickPadding(tickPadding)
    .tickValues(Array.isArray(ticks) ? ticks : null);
}

const radians = Math.PI / 180;

function maybeTickRotate(g, rotate) {
  if (!(rotate = +rotate)) return;
  for (const text of g.selectAll("text")) {
    const x = +text.getAttribute("x");
    const y = +text.getAttribute("y");
    if (Math.abs(y) > Math.abs(x)) {
      const s = Math.sign(y);
      text.setAttribute("transform", `translate(0, ${y + s * 4 * Math.cos(rotate * radians)}) rotate(${rotate})`);
      text.setAttribute("text-anchor", Math.abs(rotate) < 10 ? "middle" : (rotate < 0) ^ (s > 0) ? "start" : "end");
    } else {
      const s = Math.sign(x);
      text.setAttribute("transform", `translate(${x + s * 4 * Math.abs(Math.sin(rotate * radians))}, 0) rotate(${rotate})`);
      text.setAttribute("text-anchor", Math.abs(rotate) > 60 ? "middle" : s > 0 ? "start" : "end");
    }
    text.removeAttribute("x");
    text.removeAttribute("y");
    text.setAttribute("dy", "0.32em");
  }
}

const ordinalSchemes = new Map([
  // categorical
  ["accent", d3.schemeAccent],
  ["category10", d3.schemeCategory10],
  ["dark2", d3.schemeDark2],
  ["paired", d3.schemePaired],
  ["pastel1", d3.schemePastel1],
  ["pastel2", d3.schemePastel2],
  ["set1", d3.schemeSet1],
  ["set2", d3.schemeSet2],
  ["set3", d3.schemeSet3],
  ["tableau10", d3.schemeTableau10],

  // diverging
  ["brbg", scheme11(d3.schemeBrBG, d3.interpolateBrBG)],
  ["prgn", scheme11(d3.schemePRGn, d3.interpolatePRGn)],
  ["piyg", scheme11(d3.schemePiYG, d3.interpolatePiYG)],
  ["puor", scheme11(d3.schemePuOr, d3.interpolatePuOr)],
  ["rdbu", scheme11(d3.schemeRdBu, d3.interpolateRdBu)],
  ["rdgy", scheme11(d3.schemeRdGy, d3.interpolateRdGy)],
  ["rdylbu", scheme11(d3.schemeRdYlBu, d3.interpolateRdYlBu)],
  ["rdylgn", scheme11(d3.schemeRdYlGn, d3.interpolateRdYlGn)],
  ["spectral", scheme11(d3.schemeSpectral, d3.interpolateSpectral)],

  // reversed diverging (for temperature data)
  ["burd", scheme11r(d3.schemeRdBu, d3.interpolateRdBu)],
  ["buylrd", scheme11r(d3.schemeRdYlBu, d3.interpolateRdYlBu)],

  // sequential (single-hue)
  ["blues", scheme9(d3.schemeBlues, d3.interpolateBlues)],
  ["greens", scheme9(d3.schemeGreens, d3.interpolateGreens)],
  ["greys", scheme9(d3.schemeGreys, d3.interpolateGreys)],
  ["oranges", scheme9(d3.schemeOranges, d3.interpolateOranges)],
  ["purples", scheme9(d3.schemePurples, d3.interpolatePurples)],
  ["reds", scheme9(d3.schemeReds, d3.interpolateReds)],

  // sequential (multi-hue)
  ["turbo", schemei(d3.interpolateTurbo)],
  ["viridis", schemei(d3.interpolateViridis)],
  ["magma", schemei(d3.interpolateMagma)],
  ["inferno", schemei(d3.interpolateInferno)],
  ["plasma", schemei(d3.interpolatePlasma)],
  ["cividis", schemei(d3.interpolateCividis)],
  ["cubehelix", schemei(d3.interpolateCubehelixDefault)],
  ["warm", schemei(d3.interpolateWarm)],
  ["cool", schemei(d3.interpolateCool)],
  ["bugn", scheme9(d3.schemeBuGn, d3.interpolateBuGn)],
  ["bupu", scheme9(d3.schemeBuPu, d3.interpolateBuPu)],
  ["gnbu", scheme9(d3.schemeGnBu, d3.interpolateGnBu)],
  ["orrd", scheme9(d3.schemeOrRd, d3.interpolateOrRd)],
  ["pubu", scheme9(d3.schemePuBu, d3.interpolatePuBu)],
  ["pubugn", scheme9(d3.schemePuBuGn, d3.interpolatePuBuGn)],
  ["purd", scheme9(d3.schemePuRd, d3.interpolatePuRd)],
  ["rdpu", scheme9(d3.schemeRdPu, d3.interpolateRdPu)],
  ["ylgn", scheme9(d3.schemeYlGn, d3.interpolateYlGn)],
  ["ylgnbu", scheme9(d3.schemeYlGnBu, d3.interpolateYlGnBu)],
  ["ylorbr", scheme9(d3.schemeYlOrBr, d3.interpolateYlOrBr)],
  ["ylorrd", scheme9(d3.schemeYlOrRd, d3.interpolateYlOrRd)],

  // cyclical
  ["rainbow", schemeicyclical(d3.interpolateRainbow)],
  ["sinebow", schemeicyclical(d3.interpolateSinebow)]
]);

function scheme9(scheme, interpolate) {
  return ({length: n}) => {
    n = Math.max(3, Math.floor(n));
    return n > 9 ? d3.quantize(interpolate, n) : scheme[n];
  };
}

function scheme11(scheme, interpolate) {
  return ({length: n}) => {
    if (n === 2) return [scheme[3][0], scheme[3][2]]; // favor diverging extrema
    n = Math.max(3, Math.floor(n));
    return n > 11 ? d3.quantize(interpolate, n) : scheme[n];
  };
}

function scheme11r(scheme, interpolate) {
  return ({length: n}) => {
    if (n === 2) return [scheme[3][2], scheme[3][0]]; // favor diverging extrema
    n = Math.max(3, Math.floor(n));
    return n > 11 ? d3.quantize(t => interpolate(1 - t), n) : scheme[n].slice().reverse();
  };
}

function schemei(interpolate) {
  return ({length: n}) => d3.quantize(interpolate, Math.max(2, Math.floor(n)));
}

function schemeicyclical(interpolate) {
  return ({length: n}) => d3.quantize(interpolate, Math.floor(n) + 1).slice(0, -1);
}

function ordinalScheme(scheme) {
  const s = `${scheme}`.toLowerCase();
  if (!ordinalSchemes.has(s)) throw new Error(`unknown scheme: ${s}`);
  return ordinalSchemes.get(s);
}

function ordinalRange(scheme, length) {
  const s = ordinalScheme(scheme);
  const r = typeof s === "function" ? s({length}) : s;
  return r.length !== length ? r.slice(0, length) : r;
}

const quantitativeSchemes = new Map([
  // diverging
  ["brbg", d3.interpolateBrBG],
  ["prgn", d3.interpolatePRGn],
  ["piyg", d3.interpolatePiYG],
  ["puor", d3.interpolatePuOr],
  ["rdbu", d3.interpolateRdBu],
  ["rdgy", d3.interpolateRdGy],
  ["rdylbu", d3.interpolateRdYlBu],
  ["rdylgn", d3.interpolateRdYlGn],
  ["spectral", d3.interpolateSpectral],

  // reversed diverging (for temperature data)
  ["burd", t => d3.interpolateRdBu(1 - t)],
  ["buylrd", t => d3.interpolateRdYlBu(1 - t)],

  // sequential (single-hue)
  ["blues", d3.interpolateBlues],
  ["greens", d3.interpolateGreens],
  ["greys", d3.interpolateGreys],
  ["purples", d3.interpolatePurples],
  ["reds", d3.interpolateReds],
  ["oranges", d3.interpolateOranges],

  // sequential (multi-hue)
  ["turbo", d3.interpolateTurbo],
  ["viridis", d3.interpolateViridis],
  ["magma", d3.interpolateMagma],
  ["inferno", d3.interpolateInferno],
  ["plasma", d3.interpolatePlasma],
  ["cividis", d3.interpolateCividis],
  ["cubehelix", d3.interpolateCubehelixDefault],
  ["warm", d3.interpolateWarm],
  ["cool", d3.interpolateCool],
  ["bugn", d3.interpolateBuGn],
  ["bupu", d3.interpolateBuPu],
  ["gnbu", d3.interpolateGnBu],
  ["orrd", d3.interpolateOrRd],
  ["pubugn", d3.interpolatePuBuGn],
  ["pubu", d3.interpolatePuBu],
  ["purd", d3.interpolatePuRd],
  ["rdpu", d3.interpolateRdPu],
  ["ylgnbu", d3.interpolateYlGnBu],
  ["ylgn", d3.interpolateYlGn],
  ["ylorbr", d3.interpolateYlOrBr],
  ["ylorrd", d3.interpolateYlOrRd],

  // cyclical
  ["rainbow", d3.interpolateRainbow],
  ["sinebow", d3.interpolateSinebow]
]);

function quantitativeScheme(scheme) {
  const s = `${scheme}`.toLowerCase();
  if (!quantitativeSchemes.has(s)) throw new Error(`unknown scheme: ${s}`);
  return quantitativeSchemes.get(s);
}

const flip = i => t => i(1 - t);
const unit = [0, 1];

const interpolators = new Map([
  // numbers
  ["number", d3.interpolateNumber],

  // color spaces
  ["rgb", d3.interpolateRgb],
  ["hsl", d3.interpolateHsl],
  ["hcl", d3.interpolateHcl],
  ["lab", d3.interpolateLab]
]);

function Interpolator(interpolate) {
  const i = `${interpolate}`.toLowerCase();
  if (!interpolators.has(i)) throw new Error(`unknown interpolator: ${i}`);
  return interpolators.get(i);
}

function ScaleQ(key, scale, channels, {
  type,
  nice,
  clamp,
  zero,
  domain = (registry.get(key) === radius || registry.get(key) === opacity ? inferZeroDomain : inferDomain$1)(channels),
  unknown,
  round,
  scheme,
  range = registry.get(key) === radius ? inferRadialRange(channels, domain) : registry.get(key) === opacity ? unit : undefined,
  interpolate = registry.get(key) === color ? (scheme == null && range !== undefined ? d3.interpolateRgb : quantitativeScheme(scheme !== undefined ? scheme : type === "cyclical" ? "rainbow" : "turbo")) : round ? d3.interpolateRound : d3.interpolateNumber,
  reverse
}) {
  if (type === "cyclical" || type === "sequential") type = "linear"; // shorthand for color schemes
  reverse = !!reverse;

  // Sometimes interpolate is a named interpolator, such as "lab" for Lab color
  // space. Other times interpolate is a function that takes two arguments and
  // is used in conjunction with the range. And other times the interpolate
  // function is a “fixed” interpolator on the [0, 1] interval, as when a
  // color scheme such as interpolateRdBu is used.
  if (typeof interpolate !== "function") {
    interpolate = Interpolator(interpolate);
  }
  if (interpolate.length === 1) {
    if (reverse) {
      interpolate = flip(interpolate);
      reverse = false;
    }
    if (range === undefined) {
      range = Float64Array.from(domain, (_, i) => i / (domain.length - 1));
      if (range.length === 2) range = unit; // optimize common case of [0, 1]
    }
    scale.interpolate((range === unit ? constant : interpolatePiecewise)(interpolate));
  } else {
    scale.interpolate(interpolate);
  }

  // If a zero option is specified, we assume that the domain is numeric, and we
  // want to ensure that the domain crosses zero. However, note that the domain
  // may be reversed (descending) so we shouldn’t assume that the first value is
  // smaller than the last; and also it’s possible that the domain has more than
  // two values for a “poly” scale. And lastly be careful not to mutate input!
  if (zero) {
    const [min, max] = d3.extent(domain);
    if ((min > 0) || (max < 0)) {
      domain = Array.from(domain);
      if (order(domain) < 0) domain[domain.length - 1] = 0;
      else domain[0] = 0;
    }
  }

  if (reverse) domain = d3.reverse(domain);
  scale.domain(domain).unknown(unknown);
  if (nice) scale.nice(nice === true ? undefined : nice), domain = scale.domain();
  if (range !== undefined) scale.range(range);
  if (clamp) scale.clamp(clamp);
  return {type, domain, range, scale, interpolate};
}

function ScaleLinear(key, channels, options) {
  return ScaleQ(key, d3.scaleLinear(), channels, options);
}

function ScaleSqrt(key, channels, options) {
  return ScalePow(key, channels, {...options, exponent: 0.5});
}

function ScalePow(key, channels, {exponent = 1, ...options}) {
  return ScaleQ(key, d3.scalePow().exponent(exponent), channels, {...options, type: "pow"});
}

function ScaleLog(key, channels, {base = 10, domain = inferLogDomain(channels), ...options}) {
  return ScaleQ(key, d3.scaleLog().base(base), channels, {...options, domain});
}

function ScaleQuantile(key, channels, {
  quantiles = 5,
  scheme = "rdylbu",
  domain = inferQuantileDomain(channels),
  interpolate,
  range = interpolate !== undefined ? d3.quantize(interpolate, quantiles) : registry.get(key) === color ? ordinalRange(scheme, quantiles) : undefined,
  reverse
}) {
  return ScaleThreshold(key, channels, {
    domain: d3.scaleQuantile(domain, range === undefined ? {length: quantiles} : range).quantiles(),
    range,
    reverse
  });
}

function ScaleSymlog(key, channels, {constant = 1, ...options}) {
  return ScaleQ(key, d3.scaleSymlog().constant(constant), channels, options);
}

function ScaleThreshold(key, channels, {
  domain = [0], // explicit thresholds in ascending order
  unknown,
  scheme = "rdylbu",
  interpolate,
  range = interpolate !== undefined ? d3.quantize(interpolate, domain.length + 1) : registry.get(key) === color ? ordinalRange(scheme, domain.length + 1) : undefined,
  reverse
}) {
  if (!d3.pairs(domain).every(([a, b]) => d3.ascending(a, b) <= 0)) throw new Error("non-ascending domain");
  if (reverse) range = d3.reverse(range); // domain ascending, so reverse range
  return {type: "threshold", scale: d3.scaleThreshold(domain, range === undefined ? [] : range).unknown(unknown), domain, range};
}

function ScaleIdentity() {
  return {type: "identity", scale: d3.scaleIdentity()};
}

function inferDomain$1(channels, f = finite) {
  return channels.length ? [
    d3.min(channels, ({value}) => value === undefined ? value : d3.min(value, f)),
    d3.max(channels, ({value}) => value === undefined ? value : d3.max(value, f))
  ] : [0, 1];
}

function inferZeroDomain(channels) {
  return [0, channels.length ? d3.max(channels, ({value}) => value === undefined ? value : d3.max(value, finite)) : 1];
}

// We don’t want the upper bound of the radial domain to be zero, as this would
// be degenerate, so we ignore nonpositive values. We also don’t want the maximum
// default radius to exceed 30px.
function inferRadialRange(channels, domain) {
  const h25 = d3.quantile(channels, 0.5, ({value}) => value === undefined ? NaN : d3.quantile(value, 0.25, positive));
  const range = domain.map(d => 3 * Math.sqrt(d / h25));
  const k = 30 / d3.max(range);
  return k < 1 ? range.map(r => r * k) : range;
}

function inferLogDomain(channels) {
  for (const {value} of channels) {
    if (value !== undefined) {
      for (let v of value) {
        v = +v;
        if (v > 0) return inferDomain$1(channels, positive);
        if (v < 0) return inferDomain$1(channels, negative);
      }
    }
  }
  return [1, 10];
}

function inferQuantileDomain(channels) {
  const domain = [];
  for (const {value} of channels) {
    if (value === undefined) continue;
    for (const v of value) domain.push(v);
  }
  return domain;
}

function interpolatePiecewise(interpolate) {
  return (i, j) => t => interpolate(i + t * (j - i));
}

function ScaleD(key, scale, transform, channels, {
  type,
  nice,
  clamp,
  domain = inferDomain$1(channels),
  unknown,
  pivot = 0,
  scheme,
  range,
  symmetric = true,
  interpolate = registry.get(key) === color ? (scheme == null && range !== undefined ? d3.interpolateRgb : quantitativeScheme(scheme !== undefined ? scheme : "rdbu")) : d3.interpolateNumber,
  reverse
}) {
  pivot = +pivot;
  let [min, max] = domain;
  min = Math.min(min, pivot);
  max = Math.max(max, pivot);

  // Sometimes interpolate is a named interpolator, such as "lab" for Lab color
  // space. Other times interpolate is a function that takes two arguments and
  // is used in conjunction with the range. And other times the interpolate
  // function is a “fixed” interpolator on the [0, 1] interval, as when a
  // color scheme such as interpolateRdBu is used.
  if (typeof interpolate !== "function") {
    interpolate = Interpolator(interpolate);
  }

  // If an explicit range is specified, promote it to a piecewise interpolator.
  if (range !== undefined) {
    interpolate = interpolate.length === 1
      ? interpolatePiecewise(interpolate)(...range)
      : d3.piecewise(interpolate, range);
  }

  // Reverse before normalization.
  if (reverse) interpolate = flip(interpolate);

  // Normalize the interpolator for symmetric difference around the pivot.
  if (symmetric) {
    const mid = transform.apply(pivot);
    const mindelta = mid - transform.apply(min);
    const maxdelta = transform.apply(max) - mid;
    if (mindelta < maxdelta) min = transform.invert(mid - maxdelta);
    else if (mindelta > maxdelta) max = transform.invert(mid + mindelta);
  }

  scale.domain([min, pivot, max]).unknown(unknown).interpolator(interpolate);
  if (clamp) scale.clamp(clamp);
  if (nice) scale.nice(nice);
  return {type, domain: [min, max], pivot, interpolate, scale};
}

function ScaleDiverging(key, channels, options) {
  return ScaleD(key, d3.scaleDiverging(), transformIdentity, channels, options);
}

function ScaleDivergingSqrt(key, channels, options) {
  return ScaleDivergingPow(key, channels, {...options, exponent: 0.5});
}

function ScaleDivergingPow(key, channels, {exponent = 1, ...options}) {
  return ScaleD(key, d3.scaleDivergingPow().exponent(exponent = +exponent), transformPow(exponent), channels, {...options, type: "diverging-pow"});
}

function ScaleDivergingLog(key, channels, {base = 10, pivot = 1, domain = inferDomain$1(channels, pivot < 0 ? negative : positive), ...options}) {
  return ScaleD(key, d3.scaleDivergingLog().base(base = +base), transformLog, channels, {domain, pivot, ...options});
}

function ScaleDivergingSymlog(key, channels, {constant = 1, ...options}) {
  return ScaleD(key, d3.scaleDivergingSymlog().constant(constant = +constant), transformSymlog(constant), channels, options);
}

const transformIdentity = {
  apply(x) {
    return x;
  },
  invert(x) {
    return x;
  }
};

const transformLog = {
  apply: Math.log,
  invert: Math.exp
};

const transformSqrt = {
  apply(x) {
    return Math.sign(x) * Math.sqrt(Math.abs(x));
  },
  invert(x) {
    return Math.sign(x) * (x * x);
  }
};

function transformPow(exponent) {
  return exponent === 0.5 ? transformSqrt : {
    apply(x) {
      return Math.sign(x) * Math.pow(Math.abs(x), exponent);
    },
    invert(x) {
      return Math.sign(x) * Math.pow(Math.abs(x), 1 / exponent);
    }
  };
}

function transformSymlog(constant) {
  return {
    apply(x) {
      return Math.sign(x) * Math.log1p(Math.abs(x / constant));
    },
    invert(x) {
      return Math.sign(x) * Math.expm1(Math.abs(x)) * constant;
    }
  };
}

function ScaleT(key, scale, channels, options) {
  return ScaleQ(key, scale, channels, options);
}

function ScaleTime(key, channels, options) {
  return ScaleT(key, d3.scaleTime(), channels, options);
}

function ScaleUtc(key, channels, options) {
  return ScaleT(key, d3.scaleUtc(), channels, options);
}

function ScaleO(scale, channels, {
  type,
  domain = inferDomain(channels),
  range,
  reverse
}) {
  if (type === "categorical") type = "ordinal"; // shorthand for color schemes
  if (reverse) domain = d3.reverse(domain);
  scale.domain(domain);
  if (range !== undefined) {
    // If the range is specified as a function, pass it the domain.
    if (typeof range === "function") range = range(domain);
    scale.range(range);
  }
  return {type, domain, range, scale};
}

function ScaleOrdinal(key, channels, {
  type,
  range,
  scheme = range === undefined ? type === "ordinal" ? "turbo" : "tableau10" : undefined,
  unknown,
  ...options
}) {
  if (registry.get(key) === color && scheme !== undefined) {
    if (range !== undefined) {
      const interpolate = quantitativeScheme(scheme);
      const t0 = range[0], d = range[1] - range[0];
      range = ({length: n}) => d3.quantize(t => interpolate(t0 + d * t), n);
    } else {
      range = ordinalScheme(scheme);
    }
  }
  if (unknown === d3.scaleImplicit) throw new Error("implicit unknown is not supported");
  return ScaleO(d3.scaleOrdinal().unknown(unknown), channels, {type, range, ...options});
}

function ScalePoint(key, channels, {
  align = 0.5,
  padding = 0.5,
  ...options
}) {
  return maybeRound(
    d3.scalePoint()
      .align(align)
      .padding(padding),
    channels,
    options
  );
}

function ScaleBand(key, channels, {
  align = 0.5,
  padding = 0.1,
  paddingInner = padding,
  paddingOuter = key === "fx" || key === "fy" ? 0 : padding,
  ...options
}) {
  return maybeRound(
    d3.scaleBand()
      .align(align)
      .paddingInner(paddingInner)
      .paddingOuter(paddingOuter),
    channels,
    options
  );
}

function maybeRound(scale, channels, options) {
  let {round} = options;
  if (round !== undefined) scale.round(round = !!round);
  scale = ScaleO(scale, channels, options);
  scale.round = round; // preserve for autoScaleRound
  return scale;
}

function inferDomain(channels) {
  const values = new d3.InternSet();
  for (const {value, domain} of channels) {
    if (domain !== undefined) return domain();
    if (value === undefined) continue;
    for (const v of value) values.add(v);
  }
  return d3.sort(values, ascendingDefined);
}

function Scales(channels, {
  inset: globalInset = 0,
  insetTop: globalInsetTop = globalInset,
  insetRight: globalInsetRight = globalInset,
  insetBottom: globalInsetBottom = globalInset,
  insetLeft: globalInsetLeft = globalInset,
  round,
  nice,
  clamp,
  align,
  padding,
  ...options
} = {}) {
  const scales = {};
  for (const key of registry.keys()) {
    const scaleChannels = channels.get(key);
    const scaleOptions = options[key];
    if (scaleChannels || scaleOptions) {
      const scale = Scale(key, scaleChannels, {
        round: registry.get(key) === position ? round : undefined, // only for position
        nice,
        clamp,
        align,
        padding,
        ...scaleOptions
      });
      if (scale) {
        // populate generic scale options (percent, transform, insets)
        let {
          percent,
          transform,
          inset,
          insetTop = inset !== undefined ? inset : key === "y" ? globalInsetTop : 0, // not fy
          insetRight = inset !== undefined ? inset : key === "x" ? globalInsetRight : 0, // not fx
          insetBottom = inset !== undefined ? inset : key === "y" ? globalInsetBottom : 0, // not fy
          insetLeft = inset !== undefined ? inset : key === "x" ? globalInsetLeft : 0 // not fx
        } = scaleOptions || {};
        if (transform == null) transform = undefined;
        else if (typeof transform !== "function") throw new Error("invalid scale transform");
        scale.percent = !!percent;
        scale.transform = transform;
        if (key === "x" || key === "fx") {
          scale.insetLeft = +insetLeft;
          scale.insetRight = +insetRight;
        } else if (key === "y" || key === "fy") {
          scale.insetTop = +insetTop;
          scale.insetBottom = +insetBottom;
        }
        scales[key] = scale;
      }
    }
  }
  return scales;
}

// Mutates scale.range!
function autoScaleRange({x, y, fx, fy}, dimensions) {
  if (fx) autoScaleRangeX(fx, dimensions);
  if (fy) autoScaleRangeY(fy, dimensions);
  if (x) autoScaleRangeX(x, fx ? {width: fx.scale.bandwidth()} : dimensions);
  if (y) autoScaleRangeY(y, fy ? {height: fy.scale.bandwidth()} : dimensions);
}

function autoScaleRangeX(scale, dimensions) {
  if (scale.range === undefined) {
    const {insetLeft, insetRight} = scale;
    const {width, marginLeft = 0, marginRight = 0} = dimensions;
    const left = marginLeft + insetLeft;
    const right = width - marginRight - insetRight;
    scale.range = [left, Math.max(left, right)];
    if (!isOrdinalScale(scale)) scale.range = piecewiseRange(scale);
    scale.scale.range(scale.range);
  }
  autoScaleRound(scale);
}

function autoScaleRangeY(scale, dimensions) {
  if (scale.range === undefined) {
    const {insetTop, insetBottom} = scale;
    const {height, marginTop = 0, marginBottom = 0} = dimensions;
    const top = marginTop + insetTop;
    const bottom = height - marginBottom - insetBottom;
    scale.range = [Math.max(top, bottom), top];
    if (!isOrdinalScale(scale)) scale.range = piecewiseRange(scale);
    else scale.range.reverse();
    scale.scale.range(scale.range);
  }
  autoScaleRound(scale);
}

function autoScaleRound(scale) {
  if (scale.round === undefined && isBandScale(scale) && roundError(scale) <= 30) {
    scale.scale.round(true);
  }
}

// If we were to turn on rounding for this band or point scale, how much wasted
// space would it introduce (on both ends of the range)? This must match
// d3.scaleBand’s rounding behavior:
// https://github.com/d3/d3-scale/blob/83555bd759c7314420bd4240642beda5e258db9e/src/band.js#L20-L32
function roundError({scale}) {
  const n = scale.domain().length;
  const [start, stop] = scale.range();
  const paddingInner = scale.paddingInner ? scale.paddingInner() : 1;
  const paddingOuter = scale.paddingOuter ? scale.paddingOuter() : scale.padding();
  const m = n - paddingInner;
  const step = Math.abs(stop - start) / Math.max(1, m + paddingOuter * 2);
  return (step - Math.floor(step)) * m;
}

function piecewiseRange(scale) {
  const length = scale.scale.domain().length + isThresholdScale(scale);
  if (!(length > 2)) return scale.range;
  const [start, end] = scale.range;
  return Array.from({length}, (_, i) => start + i / (length - 1) * (end - start));
}

function normalizeScale(key, scale) {
  return Scale(key, undefined, {...scale});
}

function Scale(key, channels = [], options = {}) {
  const type = inferScaleType(key, channels, options);
  options.type = type; // Mutates input!

  // Once the scale type is known, coerce the associated channel values and any
  // explicitly-specified domain to the expected type.
  switch (type) {
    case "diverging":
    case "diverging-sqrt":
    case "diverging-pow":
    case "diverging-log":
    case "diverging-symlog":
    case "cyclical":
    case "sequential":
    case "linear":
    case "sqrt":
    case "threshold":
    case "quantile":
    case "pow":
    case "log":
    case "symlog":
      options = coerceType(channels, options, coerceNumber, Float64Array);
      break;
    case "identity":
      if (registry.get(key) === position) options = coerceType(channels, options, coerceNumber, Float64Array);
      break;
    case "utc":
    case "time":
      options = coerceType(channels, options, coerceDate);
      break;
  }

  switch (type) {
    case "diverging": return ScaleDiverging(key, channels, options);
    case "diverging-sqrt": return ScaleDivergingSqrt(key, channels, options);
    case "diverging-pow": return ScaleDivergingPow(key, channels, options);
    case "diverging-log": return ScaleDivergingLog(key, channels, options);
    case "diverging-symlog": return ScaleDivergingSymlog(key, channels, options);
    case "categorical": case "ordinal": return ScaleOrdinal(key, channels, options);
    case "cyclical": case "sequential": case "linear": return ScaleLinear(key, channels, options);
    case "sqrt": return ScaleSqrt(key, channels, options);
    case "threshold": return ScaleThreshold(key, channels, options);
    case "quantile": return ScaleQuantile(key, channels, options);
    case "pow": return ScalePow(key, channels, options);
    case "log": return ScaleLog(key, channels, options);
    case "symlog": return ScaleSymlog(key, channels, options);
    case "utc": return ScaleUtc(key, channels, options);
    case "time": return ScaleTime(key, channels, options);
    case "point": return ScalePoint(key, channels, options);
    case "band": return ScaleBand(key, channels, options);
    case "identity": return registry.get(key) === position ? ScaleIdentity() : {type: "identity"};
    case undefined: return;
    default: throw new Error(`unknown scale type: ${type}`);
  }
}

function inferScaleType(key, channels, {type, domain, range}) {
  if (key === "fx" || key === "fy") return "band";
  if (type !== undefined) {
    for (const {type: t} of channels) {
      if (t !== undefined && type !== t) {
        throw new Error(`scale incompatible with channel: ${type} !== ${t}`);
      }
    }
    return type;
  }
  if (registry.get(key) === radius) return "sqrt";
  if (registry.get(key) === opacity) return "linear";
  for (const {type} of channels) if (type !== undefined) return type;
  if ((domain || range || []).length > 2) return asOrdinalType(key);
  if (domain !== undefined) {
    if (isOrdinal(domain)) return asOrdinalType(key);
    if (isTemporal(domain)) return "utc";
    return "linear";
  }
  // If any channel is ordinal or temporal, it takes priority.
  const values = channels.map(({value}) => value).filter(value => value !== undefined);
  if (values.some(isOrdinal)) return asOrdinalType(key);
  if (values.some(isTemporal)) return "utc";
  return "linear";
}

// Positional scales default to a point scale instead of an ordinal scale.
function asOrdinalType(key) {
  switch (registry.get(key)) {
    case position: return "point";
    case color: return "categorical";
    default: return "ordinal";
  }
}

function isTemporalScale({type}) {
  return type === "time" || type === "utc";
}

function isOrdinalScale({type}) {
  return type === "ordinal" || type === "point" || type === "band";
}

function isThresholdScale({type}) {
  return type === "threshold";
}

function isBandScale({type}) {
  return type === "point" || type === "band";
}

// If the domain is undefined, we assume an identity scale.
function scaleOrder({range, domain = range}) {
  return Math.sign(order(domain)) * Math.sign(order(range));
}

function order(values) {
  if (values == null) return;
  const first = values[0];
  const last = values[values.length - 1];
  return d3.descending(first, last);
}

// TODO use Float64Array.from for position and radius scales?
function applyScales(channels = [], scales) {
  const values = Object.create(null);
  for (let [name, {value, scale}] of channels) {
    if (name !== undefined) {
      if (scale !== undefined) {
        scale = scales[scale];
        if (scale !== undefined) {
          value = Array.from(value, scale);
        }
      }
      values[name] = value;
    }
  }
  return values;
}

// Certain marks have special behavior if a scale is collapsed, i.e. if the
// domain is degenerate and represents only a single value such as [3, 3]; for
// example, a rect will span the full extent of the chart along a collapsed
// dimension (whereas a dot will simply be drawn in the center).
function isCollapsed(scale) {
  const domain = scale.domain();
  const value = scale(domain[0]);
  for (let i = 1, n = domain.length; i < n; ++i) {
    if (scale(domain[i]) - value) {
      return false;
    }
  }
  return true;
}

// Mutates channel.value!
function coerceType(channels, options, coerce, type) {
  for (const c of channels) c.value = coerceArray(c.value, coerce, type);
  return {...options, domain: coerceArray(options.domain, coerce, type)};
}

function coerceArray(array, coerce, type = Array) {
  if (array !== undefined) return type.from(array, coerce);
}

// Unlike Mark’s number, here we want to convert null and undefined to NaN,
// since the result will be stored in a Float64Array and we don’t want null to
// be coerced to zero.
function coerceNumber(x) {
  return x == null ? NaN : +x;
}

// When coercing strings to dates, we only want to allow the ISO 8601 format
// since the built-in string parsing of the Date constructor varies across
// browsers. (In the future, this could be made more liberal if desired, though
// it is still generally preferable to do date parsing yourself explicitly,
// rather than rely on Plot.) Any non-string values are coerced to number first
// and treated as milliseconds since UNIX epoch.
function coerceDate(x) {
  return x instanceof Date && !isNaN(x) ? x
    : typeof x === "string" ? parse(x)
    : x == null || isNaN(x = +x) ? undefined
    : new Date(x);
}

function scale(options = {}) {
  let scale;
  for (const key in options) {
    if (!registry.has(key)) continue; // ignore unknown properties
    if (scale !== undefined) throw new Error("ambiguous scale definition");
    scale = exposeScale(normalizeScale(key, options[key]));
  }
  if (scale === undefined) throw new Error("invalid scale definition");
  return scale;
}

function exposeScales(scaleDescriptors) {
  return key => {
    if (!registry.has(key = `${key}`)) throw new Error(`unknown scale: ${key}`);
    return key in scaleDescriptors ? exposeScale(scaleDescriptors[key]) : undefined;
  };
}

function exposeScale({
  scale,
  type,
  domain,
  range,
  label,
  interpolate,
  transform,
  percent,
  pivot
}) {
  if (type === "identity") return {type: "identity", apply: d => d, invert: d => d};
  const unknown = scale.unknown ? scale.unknown() : undefined;
  return {
    type,
    domain: Array.from(domain), // defensive copy
    ...range !== undefined && {range: Array.from(range)}, // defensive copy
    ...transform !== undefined && {transform},
    ...percent && {percent}, // only exposed if truthy
    ...label !== undefined && {label},
    ...unknown !== undefined && {unknown},

    // quantitative
    ...interpolate !== undefined && {interpolate},
    ...scale.clamp && {clamp: scale.clamp()},

    // diverging (always asymmetric; we never want to apply the symmetric transform twice)
    ...pivot !== undefined && {pivot, symmetric: false},

    // log, diverging-log
    ...scale.base && {base: scale.base()},

    // pow, diverging-pow
    ...scale.exponent && {exponent: scale.exponent()},

    // symlog, diverging-symlog
    ...scale.constant && {constant: scale.constant()},

    // band, point
    ...scale.align && {align: scale.align(), round: scale.round()},
    ...scale.padding && (scale.paddingInner ? {paddingInner: scale.paddingInner(), paddingOuter: scale.paddingOuter()} : {padding: scale.padding()}),

    // utilities
    apply: t => scale(t),
    ...scale.invert && {invert: t => scale.invert(t)}
  };
}

function Axes(
  {x: xScale, y: yScale, fx: fxScale, fy: fyScale},
  {x = {}, y = {}, fx = {}, fy = {}, axis = true, grid, line, label, facet: {axis: facetAxis = axis, grid: facetGrid, label: facetLabel = label} = {}} = {}
) {
  let {axis: xAxis = axis} = x;
  let {axis: yAxis = axis} = y;
  let {axis: fxAxis = facetAxis} = fx;
  let {axis: fyAxis = facetAxis} = fy;
  if (!xScale) xAxis = null; else if (xAxis === true) xAxis = "bottom";
  if (!yScale) yAxis = null; else if (yAxis === true) yAxis = "left";
  if (!fxScale) fxAxis = null; else if (fxAxis === true) fxAxis = xAxis === "bottom" ? "top" : "bottom";
  if (!fyScale) fyAxis = null; else if (fyAxis === true) fyAxis = yAxis === "left" ? "right" : "left";
  return {
    ...xAxis && {x: new AxisX({grid, line, label, fontVariant: inferFontVariant(xScale), ...x, axis: xAxis})},
    ...yAxis && {y: new AxisY({grid, line, label, fontVariant: inferFontVariant(yScale), ...y, axis: yAxis})},
    ...fxAxis && {fx: new AxisX({name: "fx", grid: facetGrid, label: facetLabel, ...fx, axis: fxAxis})},
    ...fyAxis && {fy: new AxisY({name: "fy", grid: facetGrid, label: facetLabel, ...fy, axis: fyAxis})}
  };
}

// Mutates axis.ticks!
// TODO Populate tickFormat if undefined, too?
function autoAxisTicks({x, y, fx, fy}, {x: xAxis, y: yAxis, fx: fxAxis, fy: fyAxis}) {
  if (fxAxis) autoAxisTicksK(fx, fxAxis, 80);
  if (fyAxis) autoAxisTicksK(fy, fyAxis, 35);
  if (xAxis) autoAxisTicksK(x, xAxis, 80);
  if (yAxis) autoAxisTicksK(y, yAxis, 35);
}

function autoAxisTicksK(scale, axis, k) {
  if (axis.ticks === undefined) {
    const [min, max] = d3.extent(scale.scale.range());
    axis.ticks = (max - min) / k;
  }
}

// Mutates axis.{label,labelAnchor,labelOffset} and scale.label!
function autoScaleLabels(channels, scales, {x, y, fx, fy}, dimensions, options) {
  if (fx) {
    autoAxisLabelsX(fx, scales.fx, channels.get("fx"));
    if (fx.labelOffset === undefined) {
      const {facetMarginTop, facetMarginBottom} = dimensions;
      fx.labelOffset = fx.axis === "top" ? facetMarginTop : facetMarginBottom;
    }
  }
  if (fy) {
    autoAxisLabelsY(fy, fx, scales.fy, channels.get("fy"));
    if (fy.labelOffset === undefined) {
      const {facetMarginLeft, facetMarginRight} = dimensions;
      fy.labelOffset = fy.axis === "left" ? facetMarginLeft : facetMarginRight;
    }
  }
  if (x) {
    autoAxisLabelsX(x, scales.x, channels.get("x"));
    if (x.labelOffset === undefined) {
      const {marginTop, marginBottom, facetMarginTop, facetMarginBottom} = dimensions;
      x.labelOffset = x.axis === "top" ? marginTop - facetMarginTop : marginBottom - facetMarginBottom;
    }
  }
  if (y) {
    autoAxisLabelsY(y, x, scales.y, channels.get("y"));
    if (y.labelOffset === undefined) {
      const {marginRight, marginLeft, facetMarginLeft, facetMarginRight} = dimensions;
      y.labelOffset = y.axis === "left" ? marginLeft - facetMarginLeft : marginRight - facetMarginRight;
    }
  }
  for (const [key, type] of registry) {
    if (type !== position && scales[key]) { // not already handled above
      autoScaleLabel(key, scales[key], channels.get(key), options[key]);
    }
  }
}

// Mutates axis.labelAnchor, axis.label, scale.label!
function autoAxisLabelsX(axis, scale, channels) {
  if (axis.labelAnchor === undefined) {
    axis.labelAnchor = isOrdinalScale(scale) ? "center"
      : scaleOrder(scale) < 0 ? "left"
      : "right";
  }
  if (axis.label === undefined) {
    axis.label = inferLabel(channels, scale, axis, "x");
  }
  scale.label = axis.label;
}

// Mutates axis.labelAnchor, axis.label, scale.label!
function autoAxisLabelsY(axis, opposite, scale, channels) {
  if (axis.labelAnchor === undefined) {
    axis.labelAnchor = isOrdinalScale(scale) ? "center"
      : opposite && opposite.axis === "top" ? "bottom" // TODO scaleOrder?
      : "top";
  }
  if (axis.label === undefined) {
    axis.label = inferLabel(channels, scale, axis, "y");
  }
  scale.label = axis.label;
}

// Mutates scale.label!
function autoScaleLabel(key, scale, channels, options) {
  if (options) {
    scale.label = options.label;
  }
  if (scale.label === undefined) {
    scale.label = inferLabel(channels, scale, null, key);
  }
}

// Channels can have labels; if all the channels for a given scale are
// consistently labeled (i.e., have the same value if not undefined), and the
// corresponding axis doesn’t already have an explicit label, then the channels’
// label is promoted to the corresponding axis.
function inferLabel(channels = [], scale, axis, key) {
  let candidate;
  for (const {label} of channels) {
    if (label === undefined) continue;
    if (candidate === undefined) candidate = label;
    else if (candidate !== label) return;
  }
  if (candidate !== undefined) {
    // Ignore the implicit label for temporal scales if it’s simply “date”.
    if (isTemporalScale(scale) && /^(date|time|year)$/i.test(candidate)) return;
    if (!isOrdinalScale(scale)) {
      if (scale.percent) candidate = `${candidate} (%)`;
      if (key === "x" || key === "y") {
        const order = scaleOrder(scale);
        if (order) {
          if (key === "x" || (axis && axis.labelAnchor === "center")) {
            candidate = key === "x" === order < 0 ? `← ${candidate}` : `${candidate} →`;
          } else {
            candidate = `${order < 0 ? "↑ " : "↓ "}${candidate}`;
          }
        }
      }
    }
  }
  return candidate;
}

function inferFontVariant(scale) {
  return isOrdinalScale(scale) ? undefined : "tabular-nums";
}

function facets(data, {x, y, ...options}, marks) {
  return x === undefined && y === undefined
    ? marks // if no facets are specified, ignore!
    : [new Facet(data, {x, y, ...options}, marks)];
}

class Facet extends Mark {
  constructor(data, {x, y, ...options} = {}, marks = []) {
    if (data == null) throw new Error("missing facet data");
    super(
      data,
      [
        {name: "fx", value: x, scale: "fx", optional: true},
        {name: "fy", value: y, scale: "fy", optional: true}
      ],
      options
    );
    this.marks = marks.flat(Infinity).map(markify);
    // The following fields are set by initialize:
    this.marksChannels = undefined; // array of mark channels
    this.marksIndexByFacet = undefined; // map from facet key to array of mark indexes
  }
  initialize() {
    const {index, channels} = super.initialize();
    const facets = index === undefined ? [] : facetGroups(index, channels);
    const facetsKeys = Array.from(facets, first$1);
    const facetsIndex = Array.from(facets, second);
    const subchannels = [];
    const marksChannels = this.marksChannels = [];
    const marksIndexByFacet = this.marksIndexByFacet = facetMap(channels);
    for (const facetKey of facetsKeys) {
      marksIndexByFacet.set(facetKey, new Array(this.marks.length));
    }
    let facetsExclude;
    for (let i = 0; i < this.marks.length; ++i) {
      const mark = this.marks[i];
      const {facet} = mark;
      const markFacets = facet === "auto" ? mark.data === this.data ? facetsIndex : undefined
        : facet === "include" ? facetsIndex
        : facet === "exclude" ? facetsExclude || (facetsExclude = facetsIndex.map(f => Uint32Array.from(d3.difference(index, f))))
        : undefined;
      const {index: I, channels: markChannels} = mark.initialize(markFacets, channels);
      // If an index is returned by mark.initialize, its structure depends on
      // whether or not faceting has been applied: it is a flat index ([0, 1, 2,
      // …]) when not faceted, and a nested index ([[0, 1, …], [2, 3, …], …])
      // when faceted.
      if (I !== undefined) {
        if (markFacets) {
          for (let j = 0; j < facetsKeys.length; ++j) {
            marksIndexByFacet.get(facetsKeys[j])[i] = I[j];
          }
        } else {
          for (let j = 0; j < facetsKeys.length; ++j) {
            marksIndexByFacet.get(facetsKeys[j])[i] = I;
          }
        }
      }
      for (const [, channel] of markChannels) {
        subchannels.push([, channel]);
      }
      marksChannels.push(markChannels);
    }
    return {index, channels: [...channels, ...subchannels]};
  }
  render(I, scales, channels, dimensions, axes) {
    const {marks, marksChannels, marksIndexByFacet} = this;
    const {fx, fy} = scales;
    const fyDomain = fy && fy.domain();
    const fxDomain = fx && fx.domain();
    const fyMargins = fy && {marginTop: 0, marginBottom: 0, height: fy.bandwidth()};
    const fxMargins = fx && {marginRight: 0, marginLeft: 0, width: fx.bandwidth()};
    const subdimensions = {...dimensions, ...fxMargins, ...fyMargins};
    const marksValues = marksChannels.map(channels => applyScales(channels, scales));
    return d3.create("svg:g")
        .call(g => {
          if (fy && axes.y) {
            const axis1 = axes.y, axis2 = nolabel(axis1);
            const j = axis1.labelAnchor === "bottom" ? fyDomain.length - 1 : axis1.labelAnchor === "center" ? fyDomain.length >> 1 : 0;
            const fyDimensions = {...dimensions, ...fyMargins};
            g.selectAll()
              .data(fyDomain)
              .join("g")
              .attr("transform", ky => `translate(0,${fy(ky)})`)
              .append((ky, i) => (i === j ? axis1 : axis2).render(
                fx && where(fxDomain, kx => marksIndexByFacet.has([kx, ky])),
                scales,
                null,
                fyDimensions
              ));
          }
          if (fx && axes.x) {
            const axis1 = axes.x, axis2 = nolabel(axis1);
            const j = axis1.labelAnchor === "right" ? fxDomain.length - 1 : axis1.labelAnchor === "center" ? fxDomain.length >> 1 : 0;
            const {marginLeft, marginRight} = dimensions;
            const fxDimensions = {...dimensions, ...fxMargins, labelMarginLeft: marginLeft, labelMarginRight: marginRight};
            g.selectAll()
              .data(fxDomain)
              .join("g")
              .attr("transform", kx => `translate(${fx(kx)},0)`)
              .append((kx, i) => (i === j ? axis1 : axis2).render(
                fy && where(fyDomain, ky => marksIndexByFacet.has([kx, ky])),
                scales,
                null,
                fxDimensions
              ));
          }
        })
        .call(g => g.selectAll()
          .data(facetKeys(scales).filter(marksIndexByFacet.has, marksIndexByFacet))
          .join("g")
            .attr("transform", facetTranslate(fx, fy))
            .each(function(key) {
              const marksFacetIndex = marksIndexByFacet.get(key);
              for (let i = 0; i < marks.length; ++i) {
                const values = marksValues[i];
                const index = filterStyles(marksFacetIndex[i], values);
                const node = marks[i].render(
                  index,
                  scales,
                  values,
                  subdimensions
                );
                if (node != null) this.appendChild(node);
              }
            }))
      .node();
  }
}

// Derives a copy of the specified axis with the label disabled.
function nolabel(axis) {
  return axis === undefined || axis.label === undefined
    ? axis // use the existing axis if unlabeled
    : Object.assign(Object.create(axis), {label: undefined});
}

// Unlike facetGroups, which returns groups in order of input data, this returns
// keys in order of the associated scale’s domains.
function facetKeys({fx, fy}) {
  return fx && fy ? d3.cross(fx.domain(), fy.domain())
    : fx ? fx.domain()
    : fy.domain();
}

// Returns an array of [[key1, index1], [key2, index2], …] representing the data
// indexes associated with each facet. For two-dimensional faceting, each key
// is a two-element array; see also facetMap.
function facetGroups(index, channels) {
  return (channels.length > 1 ? facetGroup2 : facetGroup1)(index, ...channels);
}

function facetGroup1(index, [, {value: F}]) {
  return d3.groups(index, i => F[i]);
}

function facetGroup2(index, [, {value: FX}], [, {value: FY}]) {
  return d3.groups(index, i => FX[i], i => FY[i])
    .flatMap(([x, xgroup]) => xgroup
    .map(([y, ygroup]) => [[x, y], ygroup]));
}

// This must match the key structure returned by facetGroups.
function facetTranslate(fx, fy) {
  return fx && fy ? ([kx, ky]) => `translate(${fx(kx)},${fy(ky)})`
    : fx ? kx => `translate(${fx(kx)},0)`
    : ky => `translate(0,${fy(ky)})`;
}

function facetMap(channels) {
  return new (channels.length > 1 ? FacetMap2 : FacetMap);
}

class FacetMap {
  constructor() {
    this._ = new d3.InternMap();
  }
  has(key) {
    return this._.has(key);
  }
  get(key) {
    return this._.get(key);
  }
  set(key, value) {
    return this._.set(key, value), this;
  }
}

// A Map-like interface that supports paired keys.
class FacetMap2 extends FacetMap {
  has([key1, key2]) {
    const map = super.get(key1);
    return map ? map.has(key2) : false;
  }
  get([key1, key2]) {
    const map = super.get(key1);
    return map && map.get(key2);
  }
  set([key1, key2], value) {
    const map = super.get(key1);
    if (map) map.set(key2, value);
    else super.set(key1, new d3.InternMap([[key2, value]]));
    return this;
  }
}

function legendRamp(color, {
  label = color.label,
  tickSize = 6,
  width = 240,
  height = 44 + tickSize,
  marginTop = 18,
  marginRight = 0,
  marginBottom = 16 + tickSize,
  marginLeft = 0,
  style,
  ticks = (width - marginLeft - marginRight) / 64,
  tickFormat,
  fontVariant = inferFontVariant(color),
  round = true,
  className
}) {
  className = maybeClassName(className);

  const svg = d3.create("svg")
      .attr("class", className)
      .attr("font-family", "system-ui, sans-serif")
      .attr("font-size", 10)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .call(svg => svg.append("style").text(`
        .${className} {
          display: block;
          background: white;
          height: auto;
          height: intrinsic;
          max-width: 100%;
          overflow: visible;
        }
        .${className} text {
          white-space: pre;
        }
      `))
      .call(applyInlineStyles, style);

  let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);

  let x;

  // Some D3 scales use scale.interpolate, some scale.interpolator, and some
  // scale.round; this normalizes the API so it works with all scale types.
  const applyRange = round
      ? (x, range) => x.rangeRound(range)
      : (x, range) => x.range(range);

  const {type, domain, range, interpolate, scale, pivot} = color;

  // Continuous
  if (interpolate) {

    // Often interpolate is a “fixed” interpolator on the [0, 1] interval, as
    // with a built-in color scheme, but sometimes it is a function that takes
    // two arguments and is used in conjunction with the range.
    const interpolator = range === undefined ? interpolate
        : d3.piecewise(interpolate.length === 1 ? interpolatePiecewise(interpolate)
        : interpolate, range);

    // Construct a D3 scale of the same type, but with a range that evenly
    // divides the horizontal extent of the legend. (In the common case, the
    // domain.length is two, and so the range is simply the extent.) For a
    // diverging scale, we need an extra point in the range for the pivot such
    // that the pivot is always drawn in the middle.
    x = applyRange(
      scale.copy(),
      d3.quantize(
        d3.interpolateNumber(marginLeft, width - marginRight),
        Math.min(
          domain.length + (pivot !== undefined),
          range === undefined ? Infinity : range.length
        )
      )
    );

    svg.append("image")
        .attr("x", marginLeft)
        .attr("y", marginTop)
        .attr("width", width - marginLeft - marginRight)
        .attr("height", height - marginTop - marginBottom)
        .attr("preserveAspectRatio", "none")
        .attr("xlink:href", ramp(interpolator).toDataURL());
  }

  // Threshold
  else if (type === "threshold") {
    const thresholds = domain;

    const thresholdFormat
        = tickFormat === undefined ? d => d
        : typeof tickFormat === "string" ? d3.format(tickFormat)
        : tickFormat;

    // Construct a linear scale with evenly-spaced ticks for each of the
    // thresholds; the domain extends one beyond the threshold extent.
    x = applyRange(d3.scaleLinear().domain([-1, range.length - 1]), [marginLeft, width - marginRight]);

    svg.append("g")
      .selectAll("rect")
      .data(range)
      .join("rect")
        .attr("x", (d, i) => x(i - 1))
        .attr("y", marginTop)
        .attr("width", (d, i) => x(i) - x(i - 1))
        .attr("height", height - marginTop - marginBottom)
        .attr("fill", d => d);

    ticks = Array.from(thresholds, (_, i) => i);
    tickFormat = i => thresholdFormat(thresholds[i], i);
  }

  // Ordinal (hopefully!)
  else {
    x = applyRange(d3.scaleBand().domain(domain), [marginLeft, width - marginRight]);

    svg.append("g")
      .selectAll("rect")
      .data(domain)
      .join("rect")
        .attr("x", x)
        .attr("y", marginTop)
        .attr("width", Math.max(0, x.bandwidth() - 1))
        .attr("height", height - marginTop - marginBottom)
        .attr("fill", scale);

    tickAdjust = () => {};
  }

  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x)
          .ticks(Array.isArray(ticks) ? null : ticks, typeof tickFormat === "string" ? tickFormat : undefined)
          .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
          .tickSize(tickSize)
          .tickValues(Array.isArray(ticks) ? ticks : null))
      .attr("font-size", null)
      .attr("font-family", null)
      .attr("font-variant", impliedString(fontVariant, "normal"))
      .call(tickAdjust)
      .call(g => g.select(".domain").remove())
      .call(label === undefined ? () => {} : g => g.append("text")
          .attr("x", marginLeft)
          .attr("y", marginTop + marginBottom - height - 6)
          .attr("fill", "currentColor") // TODO move to stylesheet?
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text(label));

  return svg.node();
}

function ramp(color, n = 256) {
  const canvas = d3.create("canvas").attr("width", n).attr("height", 1).node();
  const context = canvas.getContext("2d");
  for (let i = 0; i < n; ++i) {
    context.fillStyle = color(i / (n - 1));
    context.fillRect(i, 0, 1, 1);
  }
  return canvas;
}

function legendSwatches(color, {
  columns,
  tickFormat,
  fontVariant = inferFontVariant(color),
  // TODO label,
  swatchSize = 15,
  swatchWidth = swatchSize,
  swatchHeight = swatchSize,
  marginLeft = 0,
  className,
  style,
  width
} = {}) {
  className = maybeClassName(className);
  tickFormat = maybeTickFormat(tickFormat, color.domain);

  const swatches = d3.create("div")
      .attr("class", className)
      .attr("style", `
        --swatchWidth: ${+swatchWidth}px;
        --swatchHeight: ${+swatchHeight}px;
      `);

  let extraStyle;

  if (columns != null) {
    extraStyle = `
      .${className}-swatch {
        display: flex;
        align-items: center;
        break-inside: avoid;
        padding-bottom: 1px;
      }
      .${className}-swatch::before {
        flex-shrink: 0;
      }
      .${className}-label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `;

    swatches
        .style("columns", columns)
      .selectAll()
      .data(color.domain)
      .join("div")
        .attr("class", `${className}-swatch`)
        .style("--color", color.scale)
        .call(item => item.append("div")
            .attr("class", `${className}-label`)
            .attr("title", tickFormat)
            .text(tickFormat));
  } else {
    extraStyle = `
      .${className} {
        display: flex;
        align-items: center;
        min-height: 33px;
        flex-wrap: wrap;
      }
      .${className}-swatch {
        display: inline-flex;
        align-items: center;
        margin-right: 1em;
      }
    `;

    swatches
      .selectAll()
      .data(color.domain)
      .join("span")
        .attr("class", `${className}-swatch`)
        .style("--color", color.scale)
        .text(tickFormat);
  }

  return swatches
      .call(div => div.insert("style", "*").text(`
        .${className} {
          font-family: system-ui, sans-serif;
          font-size: 10px;
          margin-bottom: 0.5em;${marginLeft === undefined ? "" : `
          margin-left: ${+marginLeft}px;`}${width === undefined ? "" : `
          width: ${width}px;`}
        }
        .${className}-swatch::before {
          content: "";
          width: var(--swatchWidth);
          height: var(--swatchHeight);
          margin-right: 0.5em;
          background: var(--color);
        }
        ${extraStyle}
      `))
      .style("font-variant", impliedString(fontVariant, "normal"))
      .call(applyInlineStyles, style)
    .node();
}

function legendColor(color, {
  legend = true,
  ...options
}) {
  if (legend === true) legend = color.type === "ordinal" ? "swatches" : "ramp";
  switch (`${legend}`.toLowerCase()) {
    case "swatches": return legendSwatches(color, options);
    case "ramp": return legendRamp(color, options);
    default: throw new Error(`unknown legend type: ${legend}`);
  }
}

const black = d3.rgb(0, 0, 0);

function legendOpacity({type, interpolate, ...scale}, {
  legend = true,
  color = black,
  ...options
}) {
  if (!interpolate) throw new Error(`${type} opacity scales are not supported`);
  if (legend === true) legend = "ramp";
  if (`${legend}`.toLowerCase() !== "ramp") throw new Error(`${legend} opacity legends are not supported`);
  return legendColor({type, ...scale, interpolate: interpolateOpacity(color)}, {legend, ...options});
}

function interpolateOpacity(color) {
  const {r, g, b} = d3.rgb(color) || black; // treat invalid color as black
  return t => `rgba(${r},${g},${b},${t})`;
}

const legendRegistry = new Map([
  ["color", legendColor],
  ["opacity", legendOpacity]
]);

function legend(options = {}) {
  for (const [key, value] of legendRegistry) {
    const scale = options[key];
    if (isObject(scale)) { // e.g., ignore {color: "red"}
      return value(normalizeScale(key, scale), legendOptions(scale, options));
    }
  }
  throw new Error("unknown legend type");
}

function exposeLegends(scales, defaults = {}) {
  return (key, options) => {
    if (!legendRegistry.has(key)) throw new Error(`unknown legend type: ${key}`);
    if (!(key in scales)) return;
    return legendRegistry.get(key)(scales[key], legendOptions(defaults[key], options));
  };
}

function legendOptions({label, ticks, tickFormat} = {}, options = {}) {
  return {label, ticks, tickFormat, ...options};
}

function Legends(scales, options) {
  const legends = [];
  for (const [key, value] of legendRegistry) {
    const o = options[key];
    if (o && o.legend) {
      legends.push(value(scales[key], legendOptions(scales[key], o)));
    }
  }
  return legends;
}

function plot(options = {}) {
  const {facet, style, caption} = options;

  // className for inline styles
  const className = maybeClassName(options.className);

  // When faceting, wrap all marks in a faceting mark.
  if (facet !== undefined) {
    const {marks} = options;
    const {data} = facet;
    options = {...options, marks: facets(data, facet, marks)};
  }

  // Flatten any nested marks.
  const marks = options.marks === undefined ? [] : options.marks.flat(Infinity).map(markify);

  // A Map from Mark instance to an object of named channel values.
  const markChannels = new Map();
  const markIndex = new Map();

  // A Map from scale name to an array of associated channels.
  const scaleChannels = new Map();

  // Initialize the marks’ channels, indexing them by mark and scale as needed.
  // Also apply any scale transforms.
  for (const mark of marks) {
    if (markChannels.has(mark)) throw new Error("duplicate mark");
    const {index, channels} = mark.initialize();
    for (const [, channel] of channels) {
      const {scale} = channel;
      if (scale !== undefined) {
        const scaled = scaleChannels.get(scale);
        const {percent, transform = percent ? x => x * 100 : undefined} = options[scale] || {};
        if (transform != null) channel.value = Array.from(channel.value, transform);
        if (scaled) scaled.push(channel);
        else scaleChannels.set(scale, [channel]);
      }
    }
    markChannels.set(mark, channels);
    markIndex.set(mark, index);
  }

  const scaleDescriptors = Scales(scaleChannels, options);
  const scales = ScaleFunctions(scaleDescriptors);
  const axes = Axes(scaleDescriptors, options);
  const dimensions = Dimensions(scaleDescriptors, axes, options);

  autoScaleRange(scaleDescriptors, dimensions);
  autoScaleLabels(scaleChannels, scaleDescriptors, axes, dimensions, options);
  autoAxisTicks(scaleDescriptors, axes);

  // When faceting, render axes for fx and fy instead of x and y.
  const x = facet !== undefined && scales.fx ? "fx" : "x";
  const y = facet !== undefined && scales.fy ? "fy" : "y";
  if (axes[x]) marks.unshift(axes[x]);
  if (axes[y]) marks.unshift(axes[y]);

  const {width, height} = dimensions;

  const svg = d3.create("svg")
      .attr("class", className)
      .attr("fill", "currentColor")
      .attr("font-family", "system-ui, sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "middle")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .call(svg => svg.append("style").text(`
        .${className} {
          display: block;
          background: white;
          height: auto;
          height: intrinsic;
          max-width: 100%;
        }
        .${className} text {
          white-space: pre;
        }
      `))
      .call(applyInlineStyles, style)
    .node();

  for (const mark of marks) {
    const channels = markChannels.get(mark);
    const values = applyScales(channels, scales);
    const index = filterStyles(markIndex.get(mark), values);
    const node = mark.render(index, scales, values, dimensions, axes);
    if (node != null) svg.appendChild(node);
  }

  // Wrap the plot in a figure with a caption, if desired.
  let figure = svg;
  const legends = Legends(scaleDescriptors, options);
  if (caption != null || legends.length > 0) {
    figure = document.createElement("figure");
    figure.style.maxWidth = "initial";
    figure.append(...legends, svg);
    if (caption != null) {
      const figcaption = document.createElement("figcaption");
      figcaption.append(caption);
      figure.append(figcaption);
    }
  }

  figure.scale = exposeScales(scaleDescriptors);
  figure.legend = exposeLegends(scaleDescriptors, options);
  return figure;
}

function Dimensions(
  scales,
  {
    x: {axis: xAxis} = {},
    y: {axis: yAxis} = {},
    fx: {axis: fxAxis} = {},
    fy: {axis: fyAxis} = {}
  },
  {
    width = 640,
    height = autoHeight(scales),
    facet: {
      margin: facetMargin,
      marginTop: facetMarginTop = facetMargin !== undefined ? facetMargin : fxAxis === "top" ? 30 : 0,
      marginRight: facetMarginRight = facetMargin !== undefined ? facetMargin : fyAxis === "right" ? 40 : 0,
      marginBottom: facetMarginBottom = facetMargin !== undefined ? facetMargin : fxAxis === "bottom" ? 30 : 0,
      marginLeft: facetMarginLeft = facetMargin !== undefined ? facetMargin : fyAxis === "left" ? 40 : 0
    } = {},
    margin,
    marginTop = margin !== undefined ? margin : Math.max((xAxis === "top" ? 30 : 0) + facetMarginTop, yAxis || fyAxis ? 20 : 0.5 - offset),
    marginRight = margin !== undefined ? margin : Math.max((yAxis === "right" ? 40 : 0) + facetMarginRight, xAxis || fxAxis ? 20 : 0.5 + offset),
    marginBottom = margin !== undefined ? margin : Math.max((xAxis === "bottom" ? 30 : 0) + facetMarginBottom, yAxis || fyAxis ? 20 : 0.5 + offset),
    marginLeft = margin !== undefined ? margin : Math.max((yAxis === "left" ? 40 : 0) + facetMarginLeft, xAxis || fxAxis ? 20 : 0.5 - offset)
  } = {}
) {
  return {
    width,
    height,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    facetMarginTop,
    facetMarginRight,
    facetMarginBottom,
    facetMarginLeft
  };
}

function ScaleFunctions(scales) {
  return Object.fromEntries(Object.entries(scales).map(([name, {scale}]) => [name, scale]));
}

function autoHeight({y, fy, fx}) {
  const nfy = fy ? fy.scale.domain().length : 1;
  const ny = y ? (isOrdinalScale(y) ? y.scale.domain().length : Math.max(7, 17 / nfy)) : 1;
  return !!(y || fy) * Math.max(1, Math.min(60, ny * nfy)) * 20 + !!fx * 30 + 60;
}

const curves = new Map([
  ["basis", d3.curveBasis],
  ["basis-closed", d3.curveBasisClosed],
  ["basis-open", d3.curveBasisOpen],
  ["bundle", d3.curveBundle],
  ["bump-x", d3.curveBumpX],
  ["bump-y", d3.curveBumpY],
  ["cardinal", d3.curveCardinal],
  ["cardinal-closed", d3.curveCardinalClosed],
  ["cardinal-open", d3.curveCardinalOpen],
  ["catmull-rom", d3.curveCatmullRom],
  ["catmull-rom-closed", d3.curveCatmullRomClosed],
  ["catmull-rom-open", d3.curveCatmullRomOpen],
  ["linear", d3.curveLinear],
  ["linear-closed", d3.curveLinearClosed],
  ["monotone-x", d3.curveMonotoneX],
  ["monotone-y", d3.curveMonotoneY],
  ["natural", d3.curveNatural],
  ["step", d3.curveStep],
  ["step-after", d3.curveStepAfter],
  ["step-before", d3.curveStepBefore]
]);

function Curve(curve = d3.curveLinear, tension) {
  if (typeof curve === "function") return curve; // custom curve
  const c = curves.get(`${curve}`.toLowerCase());
  if (!c) throw new Error(`unknown curve: ${curve}`);
  if (tension !== undefined) {
    switch (c) {
      case d3.curveBundle: return c.beta(tension);
      case d3.curveCardinalClosed:
      case d3.curveCardinalOpen:
      case d3.curveCardinal: return c.tension(tension);
      case d3.curveCatmullRomClosed:
      case d3.curveCatmullRomOpen:
      case d3.curveCatmullRom: return c.alpha(tension);
    }
  }
  return c;
}

function maybeIdentityX(options = {}) {
  const {x, x1, x2} = options;
  return x1 === undefined && x2 === undefined && x === undefined
    ? {...options, x: identity}
    : options;
}

function maybeIdentityY(options = {}) {
  const {y, y1, y2} = options;
  return y1 === undefined && y2 === undefined && y === undefined
    ? {...options, y: identity}
    : options;
}

function stackX(stackOptions = {}, options = {}) {
  if (arguments.length === 1) ([stackOptions, options] = mergeOptions$1(stackOptions));
  const {y1, y = y1, x, ...rest} = options; // note: consumes x!
  const [transform, Y, x1, x2] = stack(y, x, "x", stackOptions, rest);
  return {...transform, y1, y: Y, x1, x2, x: mid(x1, x2)};
}

function stackX1(stackOptions = {}, options = {}) {
  if (arguments.length === 1) ([stackOptions, options] = mergeOptions$1(stackOptions));
  const {y1, y = y1, x} = options;
  const [transform, Y, X] = stack(y, x, "x", stackOptions, options);
  return {...transform, y1, y: Y, x: X};
}

function stackX2(stackOptions = {}, options = {}) {
  if (arguments.length === 1) ([stackOptions, options] = mergeOptions$1(stackOptions));
  const {y1, y = y1, x} = options;
  const [transform, Y,, X] = stack(y, x, "x", stackOptions, options);
  return {...transform, y1, y: Y, x: X};
}

function stackY(stackOptions = {}, options = {}) {
  if (arguments.length === 1) ([stackOptions, options] = mergeOptions$1(stackOptions));
  const {x1, x = x1, y, ...rest} = options; // note: consumes y!
  const [transform, X, y1, y2] = stack(x, y, "y", stackOptions, rest);
  return {...transform, x1, x: X, y1, y2, y: mid(y1, y2)};
}

function stackY1(stackOptions = {}, options = {}) {
  if (arguments.length === 1) ([stackOptions, options] = mergeOptions$1(stackOptions));
  const {x1, x = x1, y} = options;
  const [transform, X, Y] = stack(x, y, "y", stackOptions, options);
  return {...transform, x1, x: X, y: Y};
}

function stackY2(stackOptions = {}, options = {}) {
  if (arguments.length === 1) ([stackOptions, options] = mergeOptions$1(stackOptions));
  const {x1, x = x1, y} = options;
  const [transform, X,, Y] = stack(x, y, "y", stackOptions, options);
  return {...transform, x1, x: X, y: Y};
}

function maybeStackX({x, x1, x2, ...options} = {}) {
  options = aliasSort(options, "x");
  if (x1 === undefined && x2 === undefined) return stackX({x, ...options});
  ([x1, x2] = maybeZero(x, x1, x2));
  return {...options, x1, x2};
}

function maybeStackY({y, y1, y2, ...options} = {}) {
  options = aliasSort(options, "y");
  if (y1 === undefined && y2 === undefined) return stackY({y, ...options});
  ([y1, y2] = maybeZero(y, y1, y2));
  return {...options, y1, y2};
}

function aliasSort(options, name) {
  let {sort} = options;
  if (!isOptions(sort)) return options;
  for (const x in sort) {
    const {value: y, ...rest} = maybeValue(sort[x]);
    if (y === name) sort = {...sort, [x]: {value: `${y}2`, ...rest}};
  }
  return {...options, sort};
}

// The reverse option is ambiguous: it is both a stack option and a basic
// transform. If only one options object is specified, we interpret it as a
// stack option, and therefore must remove it from the propagated options.
function mergeOptions$1(options) {
  const {offset, order, reverse, ...rest} = options;
  return [{offset, order, reverse}, rest];
}

function stack(x, y = () => 1, ky, {offset, order, reverse}, options) {
  const z = maybeZ(options);
  const [X, setX] = maybeLazyChannel(x);
  const [Y1, setY1] = lazyChannel(y);
  const [Y2, setY2] = lazyChannel(y);
  offset = maybeOffset(offset);
  order = maybeOrder(order, offset, ky);
  return [
    basic(options, (data, facets) => {
      const X = x == null ? undefined : setX(valueof(data, x));
      const Y = valueof(data, y, Float64Array);
      const Z = valueof(data, z);
      const O = order && order(data, X, Y, Z);
      const n = data.length;
      const Y1 = setY1(new Float64Array(n));
      const Y2 = setY2(new Float64Array(n));
      const facetstacks = [];
      for (const facet of facets) {
        const stacks = X ? Array.from(d3.group(facet, i => X[i]).values()) : [facet];
        if (O) applyOrder(stacks, O);
        for (const stack of stacks) {
          let yn = 0, yp = 0;
          if (reverse) stack.reverse();
          for (const i of stack) {
            const y = Y[i];
            if (y < 0) yn = Y2[i] = (Y1[i] = yn) + y;
            else if (y > 0) yp = Y2[i] = (Y1[i] = yp) + y;
            else Y2[i] = Y1[i] = yp; // NaN or zero
          }
        }
        facetstacks.push(stacks);
      }
      if (offset) offset(facetstacks, Y1, Y2, Z);
      return {data, facets};
    }),
    X,
    Y1,
    Y2
  ];
}

function maybeOffset(offset) {
  if (offset == null) return;
  switch (`${offset}`.toLowerCase()) {
    case "expand": case "normalize": return offsetExpand;
    case "center": case "silhouette": return offsetCenter;
    case "wiggle": return offsetWiggle;
  }
  throw new Error(`unknown offset: ${offset}`);
}

// Given a single stack, returns the minimum and maximum values from the given
// Y2 column. Note that this relies on Y2 always being the outer column for
// diverging values.
function extent(stack, Y2) {
  let min = 0, max = 0;
  for (const i of stack) {
    const y = Y2[i];
    if (y < min) min = y;
    if (y > max) max = y;
  }
  return [min, max];
}

function offsetExpand(facetstacks, Y1, Y2) {
  for (const stacks of facetstacks) {
    for (const stack of stacks) {
      const [yn, yp] = extent(stack, Y2);
      for (const i of stack) {
        const m = 1 / (yp - yn || 1);
        Y1[i] = m * (Y1[i] - yn);
        Y2[i] = m * (Y2[i] - yn);
      }
    }
  }
}

function offsetCenter(facetstacks, Y1, Y2) {
  for (const stacks of facetstacks) {
    for (const stack of stacks) {
      const [yn, yp] = extent(stack, Y2);
      for (const i of stack) {
        const m = (yp + yn) / 2;
        Y1[i] -= m;
        Y2[i] -= m;
      }
    }
    offsetZero(stacks, Y1, Y2);
  }
  offsetCenterFacets(facetstacks, Y1, Y2);
}

function offsetWiggle(facetstacks, Y1, Y2, Z) {
  for (const stacks of facetstacks) {
    const prev = new d3.InternMap();
    let y = 0;
    for (const stack of stacks) {
      let j = -1;
      const Fi = stack.map(i => Math.abs(Y2[i] - Y1[i]));
      const Df = stack.map(i => {
        j = Z ? Z[i] : ++j;
        const value = Y2[i] - Y1[i];
        const diff = prev.has(j) ? value - prev.get(j) : 0;
        prev.set(j, value);
        return diff;
      });
      const Cf1 = [0, ...d3.cumsum(Df)];
      for (const i of stack) {
        Y1[i] += y;
        Y2[i] += y;
      }
      const s1 = d3.sum(Fi);
      if (s1) y -= d3.sum(Fi, (d, i) => (Df[i] / 2 + Cf1[i]) * d) / s1;
    }
    offsetZero(stacks, Y1, Y2);
  }
  offsetCenterFacets(facetstacks, Y1, Y2);
}

function offsetZero(stacks, Y1, Y2) {
  const m = d3.min(stacks, stack => d3.min(stack, i => Y1[i]));
  for (const stack of stacks) {
    for (const i of stack) {
      Y1[i] -= m;
      Y2[i] -= m;
    }
  }
}

function offsetCenterFacets(facetstacks, Y1, Y2) {
  const n = facetstacks.length;
  if (n === 1) return;
  const facets = facetstacks.map(stacks => stacks.flat());
  const m = facets.map(I => (d3.min(I, i => Y1[i]) + d3.max(I, i => Y2[i])) / 2);
  const m0 = d3.min(m);
  for (let j = 0; j < n; j++) {
    const p = m0 - m[j];
    for (const i of facets[j]) {
      Y1[i] += p;
      Y2[i] += p;
    }
  }
}

function maybeOrder(order, offset, ky) {
  if (order === undefined && offset === offsetWiggle) return orderInsideOut;
  if (order == null) return;
  if (typeof order === "string") {
    switch (order.toLowerCase()) {
      case "value": case ky: return orderY;
      case "z": return orderZ;
      case "sum": return orderSum;
      case "appearance": return orderAppearance;
      case "inside-out": return orderInsideOut;
    }
    return orderFunction(field(order));
  }
  if (typeof order === "function") return orderFunction(order);
  if (Array.isArray(order)) return orderGiven(order);
  throw new Error("invalid order");
}

// by value
function orderY(data, X, Y) {
  return Y;
}

// by location
function orderZ(order, X, Y, Z) {
  return Z;
}

// by sum of value (a.k.a. “ascending”)
function orderSum(data, X, Y, Z) {
  return orderZDomain(Z, d3.groupSort(range(data), I => d3.sum(I, i => Y[i]), i => Z[i]));
}

// by x = argmax of value
function orderAppearance(data, X, Y, Z) {
  return orderZDomain(Z, d3.groupSort(range(data), I => X[d3.greatest(I, i => Y[i])], i => Z[i]));
}

// by x = argmax of value, but rearranged inside-out by alternating series
// according to the sign of a running divergence of sums
function orderInsideOut(data, X, Y, Z) {
  const I = range(data);
  const K = d3.groupSort(I, I => X[d3.greatest(I, i => Y[i])], i => Z[i]);
  const sums = d3.rollup(I, I => d3.sum(I, i => Y[i]), i => Z[i]);
  const Kp = [], Kn = [];
  let s = 0;
  for (const k of K) {
    if (s < 0) {
      s += sums.get(k);
      Kp.push(k);
    } else {
      s -= sums.get(k);
      Kn.push(k);
    }
  }
  return orderZDomain(Z, Kn.reverse().concat(Kp));
}

function orderFunction(f) {
  return data => valueof(data, f);
}

function orderGiven(domain) {
  return (data, X, Y, Z) => orderZDomain(Z, domain);
}

// Given an explicit ordering of distinct values in z, returns a parallel column
// O that can be used with applyOrder to sort stacks. Note that this is a series
// order: it will be consistent across stacks.
function orderZDomain(Z, domain) {
  domain = new d3.InternMap(domain.map((d, i) => [d, i]));
  return Z.map(z => domain.get(z));
}

function applyOrder(stacks, O) {
  for (const stack of stacks) {
    stack.sort((i, j) => ascendingDefined(O[i], O[j]));
  }
}

const defaults$b = {
  strokeWidth: 1,
  strokeMiterlimit: 1
};

class Area extends Mark {
  constructor(data, options = {}) {
    const {x1, y1, x2, y2, curve, tension} = options;
    super(
      data,
      [
        {name: "x1", value: x1, scale: "x"},
        {name: "y1", value: y1, scale: "y"},
        {name: "x2", value: x2, scale: "x", optional: true},
        {name: "y2", value: y2, scale: "y", optional: true},
        {name: "z", value: maybeZ(options), optional: true}
      ],
      options,
      defaults$b
    );
    this.curve = Curve(curve, tension);
  }
  render(I, {x, y}, channels) {
    const {x1: X1, y1: Y1, x2: X2 = X1, y2: Y2 = Y1, z: Z} = channels;
    const {dx, dy} = this;
    return d3.create("svg:g")
        .call(applyIndirectStyles, this)
        .call(applyTransform, x, y, dx, dy)
        .call(g => g.selectAll()
          .data(Z ? d3.group(I, i => Z[i]).values() : [I])
          .join("path")
            .call(applyDirectStyles, this)
            .call(applyGroupedChannelStyles, this, channels)
            .attr("d", d3.area()
              .curve(this.curve)
              .defined(i => defined(X1[i]) && defined(Y1[i]) && defined(X2[i]) && defined(Y2[i]))
              .x0(i => X1[i])
              .y0(i => Y1[i])
              .x1(i => X2[i])
              .y1(i => Y2[i])))
      .node();
  }
}

function area(data, options) {
  return new Area(data, options);
}

function areaX(data, {y = indexOf, ...options} = {}) {
  return new Area(data, maybeStackX(maybeIdentityX({...options, y1: y, y2: undefined})));
}

function areaY(data, {x = indexOf, ...options} = {}) {
  return new Area(data, maybeStackY(maybeIdentityY({...options, x1: x, x2: undefined})));
}

function maybeInsetX({inset, insetLeft, insetRight, ...options} = {}) {
  ([insetLeft, insetRight] = maybeInset(inset, insetLeft, insetRight));
  return {inset, insetLeft, insetRight, ...options};
}

function maybeInsetY({inset, insetTop, insetBottom, ...options} = {}) {
  ([insetTop, insetBottom] = maybeInset(inset, insetTop, insetBottom));
  return {inset, insetTop, insetBottom, ...options};
}

function maybeInset(inset, inset1, inset2) {
  return inset === undefined && inset1 === undefined && inset2 === undefined
    ? (offset ? [1, 0] : [0.5, 0.5])
    : [inset1, inset2];
}

// TODO Allow the interval to be specified as a string, e.g. “day” or “hour”?
// This will require the interval knowing the type of the associated scale to
// chose between UTC and local time (or better, an explicit timeZone option).
function maybeInterval(interval) {
  if (interval == null) return;
  if (typeof interval === "number") {
    const n = interval;
    // Note: this offset doesn’t support the optional step argument for simplicity.
    interval = {floor: d => n * Math.floor(d / n), offset: d => d + n};
  }
  if (typeof interval.floor !== "function" || typeof interval.offset !== "function") throw new Error("invalid interval");
  return interval;
}

// The interval may be specified either as x: {value, interval} or as {x,
// interval}. The former is used, for example, for Plot.rect.
function maybeIntervalValue(value, {interval}) {
  value = {...maybeValue(value)};
  value.interval = maybeInterval(value.interval === undefined ? interval : value.interval);
  return value;
}

function maybeIntervalK(k, maybeInsetK, options) {
  const {[k]: v, [`${k}1`]: v1, [`${k}2`]: v2} = options;
  const {value, interval} = maybeIntervalValue(v, options);
  if (value == null || interval == null) return options;
  let V1;
  const tv1 = data => V1 || (V1 = valueof(data, value).map(v => interval.floor(v)));
  const label = labelof(v);
  return maybeInsetK({
    ...options,
    [k]: undefined,
    [`${k}1`]: v1 === undefined ? {transform: tv1, label} : v1,
    [`${k}2`]: v2 === undefined ? {transform: () => tv1().map(v => interval.offset(v)), label} : v2
  });
}

function maybeIntervalX(options = {}) {
  return maybeIntervalK("x", maybeInsetX, options);
}

function maybeIntervalY(options = {}) {
  return maybeIntervalK("y", maybeInsetY, options);
}

const defaults$a = {};

class AbstractBar extends Mark {
  constructor(data, channels, options = {}) {
    super(data, channels, options, defaults$a);
    const {inset = 0, insetTop = inset, insetRight = inset, insetBottom = inset, insetLeft = inset, rx, ry} = options;
    this.insetTop = number(insetTop);
    this.insetRight = number(insetRight);
    this.insetBottom = number(insetBottom);
    this.insetLeft = number(insetLeft);
    this.rx = impliedString(rx, "auto"); // number or percentage
    this.ry = impliedString(ry, "auto");
  }
  render(I, scales, channels, dimensions) {
    const {dx, dy, rx, ry} = this;
    const index = filter$1(I, ...this._positions(channels));
    return d3.create("svg:g")
        .call(applyIndirectStyles, this)
        .call(this._transform, scales, dx, dy)
        .call(g => g.selectAll()
          .data(index)
          .join("rect")
            .call(applyDirectStyles, this)
            .attr("x", this._x(scales, channels, dimensions))
            .attr("width", this._width(scales, channels, dimensions))
            .attr("y", this._y(scales, channels, dimensions))
            .attr("height", this._height(scales, channels, dimensions))
            .call(applyAttr, "rx", rx)
            .call(applyAttr, "ry", ry)
            .call(applyChannelStyles, this, channels))
      .node();
  }
  _x(scales, {x: X}, {marginLeft}) {
    const {insetLeft} = this;
    return X ? i => X[i] + insetLeft : marginLeft + insetLeft;
  }
  _y(scales, {y: Y}, {marginTop}) {
    const {insetTop} = this;
    return Y ? i => Y[i] + insetTop : marginTop + insetTop;
  }
  _width({x}, {x: X}, {marginRight, marginLeft, width}) {
    const {insetLeft, insetRight} = this;
    const bandwidth = X ? x.bandwidth() : width - marginRight - marginLeft;
    return Math.max(0, bandwidth - insetLeft - insetRight);
  }
  _height({y}, {y: Y}, {marginTop, marginBottom, height}) {
    const {insetTop, insetBottom} = this;
    const bandwidth = Y ? y.bandwidth() : height - marginTop - marginBottom;
    return Math.max(0, bandwidth - insetTop - insetBottom);
  }
}

class BarX extends AbstractBar {
  constructor(data, options = {}) {
    const {x1, x2, y} = options;
    super(
      data,
      [
        {name: "x1", value: x1, scale: "x"},
        {name: "x2", value: x2, scale: "x"},
        {name: "y", value: y, scale: "y", type: "band", optional: true}
      ],
      options
    );
  }
  _transform(selection, {x}, dx, dy) {
    selection.call(applyTransform, x, null, dx, dy);
  }
  _positions({x1: X1, x2: X2, y: Y}) {
    return [X1, X2, Y];
  }
  _x({x}, {x1: X1, x2: X2}, {marginLeft}) {
    const {insetLeft} = this;
    return isCollapsed(x) ? marginLeft + insetLeft : i => Math.min(X1[i], X2[i]) + insetLeft;
  }
  _width({x}, {x1: X1, x2: X2}, {marginRight, marginLeft, width}) {
    const {insetLeft, insetRight} = this;
    return isCollapsed(x) ? width - marginRight - marginLeft - insetLeft - insetRight : i => Math.max(0, Math.abs(X2[i] - X1[i]) - insetLeft - insetRight);
  }
}

class BarY extends AbstractBar {
  constructor(data, options = {}) {
    const {x, y1, y2} = options;
    super(
      data,
      [
        {name: "y1", value: y1, scale: "y"},
        {name: "y2", value: y2, scale: "y"},
        {name: "x", value: x, scale: "x", type: "band", optional: true}
      ],
      options
    );
  }
  _transform(selection, {y}, dx, dy) {
    selection.call(applyTransform, null, y, dx, dy);
  }
  _positions({y1: Y1, y2: Y2, x: X}) {
    return [Y1, Y2, X];
  }
  _y({y}, {y1: Y1, y2: Y2}, {marginTop}) {
    const {insetTop} = this;
    return isCollapsed(y) ? marginTop + insetTop : i => Math.min(Y1[i], Y2[i]) + insetTop;
  }
  _height({y}, {y1: Y1, y2: Y2}, {marginTop, marginBottom, height}) {
    const {insetTop, insetBottom} = this;
    return isCollapsed(y) ? height - marginTop - marginBottom - insetTop - insetBottom : i => Math.max(0, Math.abs(Y2[i] - Y1[i]) - insetTop - insetBottom);
  }
}

function barX(data, options) {
  return new BarX(data, maybeStackX(maybeIntervalX(maybeIdentityX(options))));
}

function barY(data, options) {
  return new BarY(data, maybeStackY(maybeIntervalY(maybeIdentityY(options))));
}

const {max: max$1, min: min$1} = Math;

const defaults$9 = {};
class Brush extends Mark {
  constructor(data, {x = first$1, y = second, selection, onbrush, ...options} = {}) {
    super(
      data,
      [
        {name: "picker", value: identity},
        {name: "x", value: x, scale: "x", optional: true},
        {name: "y", value: y, scale: "y", optional: true}
      ],
      options,
      defaults$9
    );
    this.initialSelection = selection;
    this.onbrush = onbrush;
  }
  render(
    I,
    {x, y},
    {x: X, y: Y, picker: J},
    {marginLeft, width, marginRight, marginTop, height, marginBottom}
  ) {
    let root;
    const {onbrush} = this;
    const g = d3.create("svg:g");
    const data = this.data;
    const bounds = [
      [Math.floor(marginLeft), Math.floor(marginTop)],
      [Math.ceil(width - marginRight), Math.ceil(height - marginBottom)]
    ];
    const brush = (X && Y ? d3.brush : X ? d3.brushX : d3.brushY)()
      .extent(bounds)
      .on("start brush end", (event) => {
        const {type, selection, sourceEvent} = event;
        let index = filter$1(I, X, Y);
        if (selection) {
          if (X) {
            const [x0, x1] = Y ? [selection[0][0], selection[1][0]] : selection;
            index = index.filter(i => X[i] >= x0 && X[i] <= x1);
          }
          if (Y) {
            const [y0, y1] = X ? [selection[0][1], selection[1][1]] : selection;
            index = index.filter(i => Y[i] >= y0 && Y[i] <= y1);
          }
        }
        const dots = selection ? Array.from(index, i => J[i]) : data;

        if (typeof onbrush === "function") {
          onbrush(event, dots);
        } else if (root) {
          root.value = dots;
          root.dispatchEvent(new CustomEvent('input'));
        }
        if (root) {
          if (sourceEvent && type === "start") {
            for (const {b, g} of root.__brushes) {
              if (b !== brush) g.call(b.clear);
            }
          }
        }
      });
  
    g.call(brush);
    
    /* 🌶 async
     * wait for the ownerSVGElement to:
     * - send the first signal
     * - register the multiple brushes (for faceting) 
     */
    setTimeout(() => {
      const svg = g.node().ownerSVGElement;
      root = svg.parentElement?.nodeName === "FIGURE" ? svg.parentElement : svg;
      if (!root.__brushes) root.__brushes = [];
      root.__brushes.push({b: brush, g});

      // initial setup works only on one facet
      if (root.__brushes.length === 1) {
        if (this.initialSelection) {
          const s = this.initialSelection;
          if (X && Y) {
            const [x0, x1] = d3.extent([x(s[0][0]), x(s[1][0])]);
            const [y0, y1] = d3.extent([y(s[0][1]), y(s[1][1])]);
            g.call(brush.move, [
              [ max$1(x0, bounds[0][0]), max$1(y0, bounds[0][1]) ],
              [ min$1(x1, bounds[1][0]), min$1(y1, bounds[1][1]) ]
            ]);
          } else if (X) {
            const [x0, x1] = d3.extent(s.map(x));
            g.call(brush.move, [ max$1(x0, bounds[0][0]), min$1(x1, bounds[1][0]) ]);
          } else if (Y) {
            const [y0, y1] = d3.extent(s.map(y));
            g.call(brush.move, [ max$1(y0, bounds[0][1]), min$1(y1, bounds[1][1]) ]);
          }
        } else {
          g.call(brush.clear);
        }
      }
    }, 1);
  
    return g.node();
  }
}

function brush(data, options) {
  return new Brush(data, options);
}

function brushX(data, {x = identity, ...options} = {}) {
  return new Brush(data, {...options, x, y: null});
}

function brushY(data, {y = identity, ...options} = {}) {
  return new Brush(data, {...options, x: null, y});
}

class Cell extends AbstractBar {
  constructor(data, {x, y, ...options} = {}) {
    super(
      data,
      [
        {name: "x", value: x, scale: "x", type: "band", optional: true},
        {name: "y", value: y, scale: "y", type: "band", optional: true}
      ],
      options
    );
  }
  _transform() {
    // noop
  }
  _positions({x: X, y: Y}) {
    return [X, Y];
  }
}

function cell(data, {x, y, ...options} = {}) {
  ([x, y] = maybeTuple(x, y));
  return new Cell(data, {...options, x, y});
}

function cellX(data, {x = indexOf, fill, stroke, ...options} = {}) {
  if (fill === undefined && maybeColor(stroke)[0] === undefined) fill = identity;
  return new Cell(data, {...options, x, fill, stroke});
}

function cellY(data, {y = indexOf, fill, stroke, ...options} = {}) {
  if (fill === undefined && maybeColor(stroke)[0] === undefined) fill = identity;
  return new Cell(data, {...options, y, fill, stroke});
}

const defaults$8 = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5
};

class Dot extends Mark {
  constructor(data, options = {}) {
    const {x, y, r} = options;
    const [vr, cr] = maybeNumber(r, 3);
    super(
      data,
      [
        {name: "x", value: x, scale: "x", optional: true},
        {name: "y", value: y, scale: "y", optional: true},
        {name: "r", value: vr, scale: "r", optional: true}
      ],
      options,
      defaults$8
    );
    this.r = cr;
  }
  render(
    I,
    {x, y},
    channels,
    {width, height, marginTop, marginRight, marginBottom, marginLeft}
  ) {
    const {x: X, y: Y, r: R} = channels;
    const {dx, dy} = this;
    let index = filter$1(I, X, Y);
    if (R) index = index.filter(i => positive(R[i]));
    return d3.create("svg:g")
        .call(applyIndirectStyles, this)
        .call(applyTransform, x, y, offset + dx, offset + dy)
        .call(g => g.selectAll()
          .data(index)
          .join("circle")
            .call(applyDirectStyles, this)
            .attr("cx", X ? i => X[i] : (marginLeft + width - marginRight) / 2)
            .attr("cy", Y ? i => Y[i] : (marginTop + height - marginBottom) / 2)
            .attr("r", R ? i => R[i] : this.r)
            .call(applyChannelStyles, this, channels))
      .node();
  }
}

function dot(data, {x, y, ...options} = {}) {
  ([x, y] = maybeTuple(x, y));
  return new Dot(data, {...options, x, y});
}

function dotX(data, {x = identity, ...options} = {}) {
  return new Dot(data, {...options, x});
}

function dotY(data, {y = identity, ...options} = {}) {
  return new Dot(data, {...options, y});
}

const defaults$7 = {
  fill: "none",
  stroke: "currentColor"
};

class Frame extends Mark {
  constructor(options = {}) {
    const {
      inset = 0,
      insetTop = inset,
      insetRight = inset,
      insetBottom = inset,
      insetLeft = inset
    } = options;
    super(undefined, undefined, options, defaults$7);
    this.insetTop = number(insetTop);
    this.insetRight = number(insetRight);
    this.insetBottom = number(insetBottom);
    this.insetLeft = number(insetLeft);
  }
  render(I, scales, channels, dimensions) {
    const {marginTop, marginRight, marginBottom, marginLeft, width, height} = dimensions;
    const {insetTop, insetRight, insetBottom, insetLeft, dx, dy} = this;
    return d3.create("svg:rect")
        .call(applyIndirectStyles, this)
        .call(applyDirectStyles, this)
        .call(applyTransform, null, null, offset + dx, offset + dy)
        .attr("x", marginLeft + insetLeft)
        .attr("y", marginTop + insetTop)
        .attr("width", width - marginLeft - marginRight - insetLeft - insetRight)
        .attr("height", height - marginTop - marginBottom - insetTop - insetBottom)
      .node();
  }
}

function frame(options) {
  return new Frame(options);
}

const defaults$6 = {
  fill: null,
  stroke: null
};

// Tests if the given string is a path: does it start with a dot-slash
// (./foo.png), dot-dot-slash (../foo.png), or slash (/foo.png)?
function isPath(string) {
  return /^\.*\//.test(string);
}

// Tests if the given string is a URL (e.g., https://placekitten.com/200/300).
// The allowed protocols is overly restrictive, but we don’t want to allow any
// scheme here because it would increase the likelihood of a false positive with
// a field name that happens to contain a colon.
function isUrl(string) {
  return /^(blob|data|file|http|https):/i.test(string);
}

// Disambiguates a constant src definition from a channel. A path or URL string
// is assumed to be a constant; any other string is assumed to be a field name.
function maybePath(value) {
  return typeof value === "string" && (isPath(value) || isUrl(value))
    ? [undefined, value]
    : [value, undefined];
}

class Image extends Mark {
  constructor(data, options = {}) {
    let {x, y, width, height, src, preserveAspectRatio, crossOrigin} = options;
    if (width === undefined && height !== undefined) width = height;
    else if (height === undefined && width !== undefined) height = width;
    const [vs, cs] = maybePath(src);
    const [vw, cw] = maybeNumber(width, 16);
    const [vh, ch] = maybeNumber(height, 16);
    super(
      data,
      [
        {name: "x", value: x, scale: "x", optional: true},
        {name: "y", value: y, scale: "y", optional: true},
        {name: "width", value: vw, optional: true},
        {name: "height", value: vh, optional: true},
        {name: "src", value: vs, optional: true}
      ],
      options,
      defaults$6
    );
    this.src = cs;
    this.width = cw;
    this.height = ch;
    this.preserveAspectRatio = impliedString(preserveAspectRatio, "xMidYMid");
    this.crossOrigin = string(crossOrigin);
  }
  render(
    I,
    {x, y},
    channels,
    {width, height, marginTop, marginRight, marginBottom, marginLeft}
  ) {
    const {x: X, y: Y, width: W, height: H, src: S} = channels;
    let index = filter$1(I, X, Y, S);
    if (W) index = index.filter(i => positive(W[i]));
    if (H) index = index.filter(i => positive(H[i]));
    const cx = (marginLeft + width - marginRight) / 2;
    const cy = (marginTop + height - marginBottom) / 2;
    const {dx, dy} = this;
    return d3.create("svg:g")
        .call(applyIndirectStyles, this)
        .call(applyTransform, x, y, offset + dx, offset + dy)
        .call(g => g.selectAll()
          .data(index)
          .join("image")
            .call(applyDirectStyles, this)
            .attr("x", W && X ? i => X[i] - W[i] / 2 : W ? i => cx - W[i] / 2 : X ? i => X[i] - this.width / 2 : cx - this.width / 2)
            .attr("y", H && Y ? i => Y[i] - H[i] / 2 : H ? i => cy - H[i] / 2 : Y ? i => Y[i] - this.height / 2 : cy - this.height / 2)
            .attr("width", W ? i => W[i] : this.width)
            .attr("height", H ? i => H[i] : this.height)
            .call(applyAttr, "href", S ? i => S[i] : this.src)
            .call(applyAttr, "preserveAspectRatio", this.preserveAspectRatio)
            .call(applyAttr, "crossorigin", this.crossOrigin)
            .call(applyChannelStyles, this, channels))
      .node();
  }
}

function image(data, {x, y, ...options} = {}) {
  ([x, y] = maybeTuple(x, y));
  return new Image(data, {...options, x, y});
}

const defaults$5 = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeMiterlimit: 1
};

class Line extends Mark {
  constructor(data, options = {}) {
    const {x, y, curve, tension} = options;
    super(
      data,
      [
        {name: "x", value: x, scale: "x"},
        {name: "y", value: y, scale: "y"},
        {name: "z", value: maybeZ(options), optional: true}
      ],
      options,
      defaults$5
    );
    this.curve = Curve(curve, tension);
  }
  render(I, {x, y}, channels) {
    const {x: X, y: Y, z: Z} = channels;
    const {dx, dy} = this;
    return d3.create("svg:g")
        .call(applyIndirectStyles, this)
        .call(applyTransform, x, y, offset + dx, offset + dy)
        .call(g => g.selectAll()
          .data(Z ? d3.group(I, i => Z[i]).values() : [I])
          .join("path")
            .call(applyDirectStyles, this)
            .call(applyGroupedChannelStyles, this, channels)
            .attr("d", d3.line()
              .curve(this.curve)
              .defined(i => defined(X[i]) && defined(Y[i]))
              .x(i => X[i])
              .y(i => Y[i])))
      .node();
  }
}

function line(data, {x, y, ...options} = {}) {
  ([x, y] = maybeTuple(x, y));
  return new Line(data, {...options, x, y});
}

function lineX(data, {x = identity, y = indexOf, ...options} = {}) {
  return new Line(data, {...options, x, y});
}

function lineY(data, {x = indexOf, y = identity, ...options} = {}) {
  return new Line(data, {...options, x, y});
}

const defaults$4 = {
  fill: "none",
  stroke: "currentColor",
  strokeMiterlimit: 1
};

class Link extends Mark {
  constructor(data, options = {}) {
    const {x1, y1, x2, y2, curve} = options;
    super(
      data,
      [
        {name: "x1", value: x1, scale: "x"},
        {name: "y1", value: y1, scale: "y"},
        {name: "x2", value: x2, scale: "x", optional: true},
        {name: "y2", value: y2, scale: "y", optional: true}
      ],
      options,
      defaults$4
    );
    this.curve = Curve(curve);
  }
  render(I, {x, y}, channels) {
    const {x1: X1, y1: Y1, x2: X2 = X1, y2: Y2 = Y1} = channels;
    const {dx, dy} = this;
    const index = filter$1(I, X1, Y1, X2, Y2);
    return d3.create("svg:g")
        .call(applyIndirectStyles, this)
        .call(applyTransform, x, y, offset + dx, offset + dy)
        .call(g => g.selectAll()
          .data(index)
          .join("path")
            .call(applyDirectStyles, this)
            .attr("d", i => {
              const p = d3.path();
              const c = this.curve(p);
              c.lineStart();
              c.point(X1[i], Y1[i]);
              c.point(X2[i], Y2[i]);
              c.lineEnd();
              return `${p}`;
            })
            .call(applyChannelStyles, this, channels))
      .node();
  }
}

function link(data, {x, x1, x2, y, y1, y2, ...options} = {}) {
  ([x1, x2] = maybeSameValue(x, x1, x2));
  ([y1, y2] = maybeSameValue(y, y1, y2));
  return new Link(data, {...options, x1, x2, y1, y2});
}

// If x1 and x2 are specified, return them as {x1, x2}.
// If x and x1 and specified, or x and x2 are specified, return them as {x1, x2}.
// If only x, x1, or x2 are specified, return it as {x1}.
function maybeSameValue(x, x1, x2) {
  if (x === undefined) {
    if (x1 === undefined) {
      if (x2 !== undefined) return [x2];
    } else {
      if (x2 === undefined) return [x1];
    }
  } else if (x1 === undefined) {
    return x2 === undefined ? [x] : [x, x2];
  } else if (x2 === undefined) {
    return [x, x1];
  }
  return [x1, x2];
}

const defaults$3 = {};

class Rect extends Mark {
  constructor(data, options = {}) {
    const {
      x1,
      y1,
      x2,
      y2,
      inset = 0,
      insetTop = inset,
      insetRight = inset,
      insetBottom = inset,
      insetLeft = inset,
      rx,
      ry
    } = options;
    super(
      data,
      [
        {name: "x1", value: x1, scale: "x", optional: true},
        {name: "y1", value: y1, scale: "y", optional: true},
        {name: "x2", value: x2, scale: "x", optional: true},
        {name: "y2", value: y2, scale: "y", optional: true}
      ],
      options,
      defaults$3
    );
    this.insetTop = number(insetTop);
    this.insetRight = number(insetRight);
    this.insetBottom = number(insetBottom);
    this.insetLeft = number(insetLeft);
    this.rx = impliedString(rx, "auto"); // number or percentage
    this.ry = impliedString(ry, "auto");
  }
  render(I, {x, y}, channels, dimensions) {
    const {x1: X1, y1: Y1, x2: X2, y2: Y2} = channels;
    const {marginTop, marginRight, marginBottom, marginLeft, width, height} = dimensions;
    const {insetTop, insetRight, insetBottom, insetLeft, dx, dy, rx, ry} = this;
    const index = filter$1(I, X1, Y2, X2, Y2);
    return d3.create("svg:g")
        .call(applyIndirectStyles, this)
        .call(applyTransform, x, y, dx, dy)
        .call(g => g.selectAll()
          .data(index)
          .join("rect")
            .call(applyDirectStyles, this)
            .attr("x", X1 && X2 && !isCollapsed(x) ? i => Math.min(X1[i], X2[i]) + insetLeft : marginLeft + insetLeft)
            .attr("y", Y1 && Y2 && !isCollapsed(y) ? i => Math.min(Y1[i], Y2[i]) + insetTop : marginTop + insetTop)
            .attr("width", X1 && X2 && !isCollapsed(x) ? i => Math.max(0, Math.abs(X2[i] - X1[i]) - insetLeft - insetRight) : width - marginRight - marginLeft - insetRight - insetLeft)
            .attr("height", Y1 && Y2 && !isCollapsed(y) ? i => Math.max(0, Math.abs(Y1[i] - Y2[i]) - insetTop - insetBottom) : height - marginTop - marginBottom - insetTop - insetBottom)
            .call(applyAttr, "rx", rx)
            .call(applyAttr, "ry", ry)
            .call(applyChannelStyles, this, channels))
      .node();
  }
}

function rect(data, options) {
  return new Rect(data, maybeIntervalX(maybeIntervalY(options)));
}

function rectX(data, options) {
  return new Rect(data, maybeStackX(maybeIntervalY(maybeIdentityX(options))));
}

function rectY(data, options) {
  return new Rect(data, maybeStackY(maybeIntervalX(maybeIdentityY(options))));
}

const defaults$2 = {
  fill: null,
  stroke: "currentColor"
};

class RuleX extends Mark {
  constructor(data, options = {}) {
    const {
      x,
      y1,
      y2,
      inset = 0,
      insetTop = inset,
      insetBottom = inset
    } = options;
    super(
      data,
      [
        {name: "x", value: x, scale: "x", optional: true},
        {name: "y1", value: y1, scale: "y", optional: true},
        {name: "y2", value: y2, scale: "y", optional: true}
      ],
      options,
      defaults$2
    );
    this.insetTop = number(insetTop);
    this.insetBottom = number(insetBottom);
  }
  render(I, {x, y}, channels, dimensions) {
    const {x: X, y1: Y1, y2: Y2} = channels;
    const {width, height, marginTop, marginRight, marginLeft, marginBottom} = dimensions;
    const {insetTop, insetBottom} = this;
    const index = filter$1(I, X, Y1, Y2);
    return d3.create("svg:g")
        .call(applyIndirectStyles, this)
        .call(applyTransform, X && x, null, offset, 0)
        .call(g => g.selectAll("line")
          .data(index)
          .join("line")
            .call(applyDirectStyles, this)
            .attr("x1", X ? i => X[i] : (marginLeft + width - marginRight) / 2)
            .attr("x2", X ? i => X[i] : (marginLeft + width - marginRight) / 2)
            .attr("y1", Y1 && !isCollapsed(y) ? i => Y1[i] + insetTop : marginTop + insetTop)
            .attr("y2", Y2 && !isCollapsed(y) ? (y.bandwidth ? i => Y2[i] + y.bandwidth() - insetBottom : i => Y2[i] - insetBottom) : height - marginBottom - insetBottom)
            .call(applyChannelStyles, this, channels))
      .node();
  }
}

class RuleY extends Mark {
  constructor(data, options = {}) {
    const {
      x1,
      x2,
      y,
      inset = 0,
      insetRight = inset,
      insetLeft = inset
    } = options;
    super(
      data,
      [
        {name: "y", value: y, scale: "y", optional: true},
        {name: "x1", value: x1, scale: "x", optional: true},
        {name: "x2", value: x2, scale: "x", optional: true}
      ],
      options,
      defaults$2
    );
    this.insetRight = number(insetRight);
    this.insetLeft = number(insetLeft);
  }
  render(I, {x, y}, channels, dimensions) {
    const {y: Y, x1: X1, x2: X2} = channels;
    const {width, height, marginTop, marginRight, marginLeft, marginBottom} = dimensions;
    const {insetLeft, insetRight, dx, dy} = this;
    const index = filter$1(I, Y, X1, X2);
    return d3.create("svg:g")
        .call(applyIndirectStyles, this)
        .call(applyTransform, null, Y && y, dx, offset + dy)
        .call(g => g.selectAll("line")
          .data(index)
          .join("line")
            .call(applyDirectStyles, this)
            .attr("x1", X1 && !isCollapsed(x) ? i => X1[i] + insetLeft : marginLeft + insetLeft)
            .attr("x2", X2 && !isCollapsed(x) ? (x.bandwidth ? i => X2[i] + x.bandwidth() - insetRight : i => X2[i] - insetRight) : width - marginRight - insetRight)
            .attr("y1", Y ? i => Y[i] : (marginTop + height - marginBottom) / 2)
            .attr("y2", Y ? i => Y[i] : (marginTop + height - marginBottom) / 2)
            .call(applyChannelStyles, this, channels))
      .node();
  }
}

function ruleX(data, options) {
  let {x = identity, y, y1, y2, ...rest} = maybeIntervalY(options);
  ([y1, y2] = maybeOptionalZero(y, y1, y2));
  return new RuleX(data, {...rest, x, y1, y2});
}

function ruleY(data, options) {
  let {y = identity, x, x1, x2, ...rest} = maybeIntervalX(options);
  ([x1, x2] = maybeOptionalZero(x, x1, x2));
  return new RuleY(data, {...rest, y, x1, x2});
}

// For marks specified either as [0, x] or [x1, x2], or nothing.
function maybeOptionalZero(x, x1, x2) {
  if (x === undefined) {
    if (x1 === undefined) {
      if (x2 !== undefined) return [0, x2];
    } else {
      if (x2 === undefined) return [0, x1];
    }
  } else if (x1 === undefined) {
    return x2 === undefined ? [0, x] : [x, x2];
  } else if (x2 === undefined) {
    return [x, x1];
  }
  return [x1, x2];
}

const defaults$1 = {
  strokeLinejoin: "round"
};

class Text extends Mark {
  constructor(data, options = {}) {
    const {
      x,
      y,
      text = indexOf,
      textAnchor,
      fontFamily,
      fontSize,
      fontStyle,
      fontVariant,
      fontWeight,
      dx,
      dy = "0.32em",
      rotate
    } = options;
    const [vrotate, crotate] = maybeNumber(rotate, 0);
    const [vfontSize, cfontSize] = maybeNumber(fontSize);
    super(
      data,
      [
        {name: "x", value: x, scale: "x", optional: true},
        {name: "y", value: y, scale: "y", optional: true},
        {name: "fontSize", value: numberChannel(vfontSize), optional: true},
        {name: "rotate", value: numberChannel(vrotate), optional: true},
        {name: "text", value: text}
      ],
      options,
      defaults$1
    );
    this.rotate = crotate;
    this.textAnchor = string(textAnchor);
    this.fontFamily = string(fontFamily);
    this.fontSize = cfontSize;
    this.fontStyle = string(fontStyle);
    this.fontVariant = string(fontVariant);
    this.fontWeight = string(fontWeight);
    this.dx = string(dx);
    this.dy = string(dy);
  }
  render(I, {x, y}, channels, dimensions) {
    const {x: X, y: Y, rotate: R, text: T, fontSize: FS} = channels;
    const {width, height, marginTop, marginRight, marginBottom, marginLeft} = dimensions;
    const {rotate} = this;
    const index = filter$1(I, X, Y, R).filter(i => nonempty(T[i]));
    const cx = (marginLeft + width - marginRight) / 2;
    const cy = (marginTop + height - marginBottom) / 2;
    return d3.create("svg:g")
        .call(applyIndirectTextStyles, this)
        .call(applyTransform, x, y, offset, offset)
        .call(g => g.selectAll()
          .data(index)
          .join("text")
            .call(applyDirectTextStyles, this)
            .call(R ? text => text.attr("transform", X && Y ? i => `translate(${X[i]},${Y[i]}) rotate(${R[i]})`
                : X ? i => `translate(${X[i]},${cy}) rotate(${R[i]})`
                : Y ? i => `translate(${cx},${Y[i]}) rotate(${R[i]})`
                : i => `translate(${cx},${cy}) rotate(${R[i]})`)
              : rotate ? text => text.attr("transform", X && Y ? i => `translate(${X[i]},${Y[i]}) rotate(${rotate})`
                : X ? i => `translate(${X[i]},${cy}) rotate(${rotate})`
                : Y ? i => `translate(${cx},${Y[i]}) rotate(${rotate})`
                : `translate(${cx},${cy}) rotate(${rotate})`)
              : text => text.attr("x", X ? i => X[i] : cx).attr("y", Y ? i => Y[i] : cy))
            .call(applyAttr, "font-size", FS && (i => FS[i]))
            .text(i => T[i])
            .call(applyChannelStyles, this, channels))
      .node();
  }
}

function text(data, {x, y, ...options} = {}) {
  ([x, y] = maybeTuple(x, y));
  return new Text(data, {...options, x, y});
}

function textX(data, {x = identity, ...options} = {}) {
  return new Text(data, {...options, x});
}

function textY(data, {y = identity, ...options} = {}) {
  return new Text(data, {...options, y});
}

function applyIndirectTextStyles(selection, mark) {
  applyIndirectStyles(selection, mark);
  applyAttr(selection, "text-anchor", mark.textAnchor);
  applyAttr(selection, "font-family", mark.fontFamily);
  applyAttr(selection, "font-size", mark.fontSize);
  applyAttr(selection, "font-style", mark.fontStyle);
  applyAttr(selection, "font-variant", mark.fontVariant);
  applyAttr(selection, "font-weight", mark.fontWeight);
}

function applyDirectTextStyles(selection, mark) {
  applyDirectStyles(selection, mark);
  applyAttr(selection, "dx", mark.dx);
  applyAttr(selection, "dy", mark.dy);
}

const defaults = {
  fill: null,
  stroke: "currentColor"
};

class AbstractTick extends Mark {
  constructor(data, channels, options) {
    super(data, channels, options, defaults);
  }
  render(I, scales, channels, dimensions) {
    const {x: X, y: Y} = channels;
    const {dx, dy} = this;
    const index = filter$1(I, X, Y);
    return d3.create("svg:g")
        .call(applyIndirectStyles, this)
        .call(this._transform, scales, dx, dy)
        .call(g => g.selectAll("line")
          .data(index)
          .join("line")
            .call(applyDirectStyles, this)
            .attr("x1", this._x1(scales, channels, dimensions))
            .attr("x2", this._x2(scales, channels, dimensions))
            .attr("y1", this._y1(scales, channels, dimensions))
            .attr("y2", this._y2(scales, channels, dimensions))
            .call(applyChannelStyles, this, channels))
      .node();
  }
}

class TickX extends AbstractTick {
  constructor(data, options = {}) {
    const {
      x,
      y,
      inset = 0,
      insetTop = inset,
      insetBottom = inset
    } = options;
    super(
      data,
      [
        {name: "x", value: x, scale: "x"},
        {name: "y", value: y, scale: "y", type: "band", optional: true}
      ],
      options
    );
    this.insetTop = number(insetTop);
    this.insetBottom = number(insetBottom);
  }
  _transform(selection, {x}, dx, dy) {
    selection.call(applyTransform, x, null, offset + dx, dy);
  }
  _x1(scales, {x: X}) {
    return i => X[i];
  }
  _x2(scales, {x: X}) {
    return i => X[i];
  }
  _y1(scales, {y: Y}, {marginTop}) {
    const {insetTop} = this;
    return Y ? i => Y[i] + insetTop : marginTop + insetTop;
  }
  _y2({y}, {y: Y}, {height, marginBottom}) {
    const {insetBottom} = this;
    return Y ? i => Y[i] + y.bandwidth() - insetBottom : height - marginBottom - insetBottom;
  }
}

class TickY extends AbstractTick {
  constructor(data, options = {}) {
    const {
      x,
      y,
      inset = 0,
      insetRight = inset,
      insetLeft = inset
    } = options;
    super(
      data,
      [
        {name: "y", value: y, scale: "y"},
        {name: "x", value: x, scale: "x", type: "band", optional: true}
      ],
      options
    );
    this.insetRight = number(insetRight);
    this.insetLeft = number(insetLeft);
  }
  _transform(selection, {y}, dx, dy) {
    selection.call(applyTransform, null, y, dx, offset + dy);
  }
  _x1(scales, {x: X}, {marginLeft}) {
    const {insetLeft} = this;
    return X ? i => X[i] + insetLeft : marginLeft + insetLeft;
  }
  _x2({x}, {x: X}, {width, marginRight}) {
    const {insetRight} = this;
    return X ? i => X[i] + x.bandwidth() - insetRight : width - marginRight - insetRight;
  }
  _y1(scales, {y: Y}) {
    return i => Y[i];
  }
  _y2(scales, {y: Y}) {
    return i => Y[i];
  }
}

function tickX(data, {x = identity, ...options} = {}) {
  return new TickX(data, {...options, x});
}

function tickY(data, {y = identity, ...options} = {}) {
  return new TickY(data, {...options, y});
}

// Group on {z, fill, stroke}, then optionally on y, then bin x.
function binX(outputs = {y: "count"}, options = {}) {
  ([outputs, options] = mergeOptions(outputs, options));
  const {x, y} = options;
  return binn(maybeBinValue(x, options, identity), null, null, y, outputs, maybeInsetX(options));
}

// Group on {z, fill, stroke}, then optionally on x, then bin y.
function binY(outputs = {x: "count"}, options = {}) {
  ([outputs, options] = mergeOptions(outputs, options));
  const {x, y} = options;
  return binn(null, maybeBinValue(y, options, identity), x, null, outputs, maybeInsetY(options));
}

// Group on {z, fill, stroke}, then bin on x and y.
function bin(outputs = {fill: "count"}, options = {}) {
  ([outputs, options] = mergeOptions(outputs, options));
  const {x, y} = maybeBinValueTuple(options);
  return binn(x, y, null, null, outputs, maybeInsetX(maybeInsetY(options)));
}

function binn(
  bx, // optionally bin on x (exclusive with gx)
  by, // optionally bin on y (exclusive with gy)
  gx, // optionally group on x (exclusive with bx and gy)
  gy, // optionally group on y (exclusive with by and gx)
  {
    data: reduceData = reduceIdentity,
    filter = reduceCount, // return only non-empty bins by default
    sort,
    reverse,
    ...outputs // output channel definitions
  } = {},
  inputs = {} // input channels and options
) {
  bx = maybeBin(bx);
  by = maybeBin(by);

  // Compute the outputs.
  outputs = maybeOutputs(outputs, inputs);
  reduceData = maybeReduce$1(reduceData, identity);
  sort = sort == null ? undefined : maybeOutput("sort", sort, inputs);
  filter = filter == null ? undefined : maybeEvaluator("filter", filter, inputs);

  // Don’t group on a channel if an output requires it as an input!
  if (gx != null && hasOutput(outputs, "x", "x1", "x2")) gx = null;
  if (gy != null && hasOutput(outputs, "y", "y1", "y2")) gy = null;

  // Produce x1, x2, y1, and y2 output channels as appropriate (when binning).
  const [BX1, setBX1] = maybeLazyChannel(bx);
  const [BX2, setBX2] = maybeLazyChannel(bx);
  const [BY1, setBY1] = maybeLazyChannel(by);
  const [BY2, setBY2] = maybeLazyChannel(by);

  // Produce x or y output channels as appropriate (when grouping).
  const [k, gk] = gx != null ? [gx, "x"] : gy != null ? [gy, "y"] : [];
  const [GK, setGK] = maybeLazyChannel(k);

  // Greedily materialize the z, fill, and stroke channels (if channels and not
  // constants) so that we can reference them for subdividing groups without
  // computing them more than once. We also want to consume options that should
  // only apply to this transform rather than passing them through to the next.
  const {
    x,
    y,
    z,
    fill,
    stroke,
    x1, x2, // consumed if x is an output
    y1, y2, // consumed if y is an output
    domain, // eslint-disable-line no-unused-vars
    cumulative, // eslint-disable-line no-unused-vars
    thresholds, // eslint-disable-line no-unused-vars
    ...options
  } = inputs;
  const [GZ, setGZ] = maybeLazyChannel(z);
  const [vfill] = maybeColor(fill);
  const [vstroke] = maybeColor(stroke);
  const [GF = fill, setGF] = maybeLazyChannel(vfill);
  const [GS = stroke, setGS] = maybeLazyChannel(vstroke);

  return {
    ..."z" in inputs && {z: GZ || z},
    ..."fill" in inputs && {fill: GF || fill},
    ..."stroke" in inputs && {stroke: GS || stroke},
    ...basic(options, (data, facets) => {
      const K = valueof(data, k);
      const Z = valueof(data, z);
      const F = valueof(data, vfill);
      const S = valueof(data, vstroke);
      const G = maybeSubgroup(outputs, Z, F, S);
      const groupFacets = [];
      const groupData = [];
      const GK = K && setGK([]);
      const GZ = Z && setGZ([]);
      const GF = F && setGF([]);
      const GS = S && setGS([]);
      const BX = bx ? bx(data) : [[,, I => I]];
      const BY = by ? by(data) : [[,, I => I]];
      const BX1 = bx && setBX1([]);
      const BX2 = bx && setBX2([]);
      const BY1 = by && setBY1([]);
      const BY2 = by && setBY2([]);
      let i = 0;
      for (const o of outputs) o.initialize(data);
      if (sort) sort.initialize(data);
      if (filter) filter.initialize(data);
      for (const facet of facets) {
        const groupFacet = [];
        for (const o of outputs) o.scope("facet", facet);
        if (sort) sort.scope("facet", facet);
        if (filter) filter.scope("facet", facet);
        for (const [f, I] of maybeGroup(facet, G)) {
          for (const [k, g] of maybeGroup(I, K)) {
            for (const [x1, x2, fx] of BX) {
              const bb = fx(g);
              for (const [y1, y2, fy] of BY) {
                const extent = {x1, x2, y1, y2};
                const b = fy(bb);
                if (filter && !filter.reduce(b, extent)) continue;
                groupFacet.push(i++);
                groupData.push(reduceData.reduce(b, data, extent));
                if (K) GK.push(k);
                if (Z) GZ.push(G === Z ? f : Z[b[0]]);
                if (F) GF.push(G === F ? f : F[b[0]]);
                if (S) GS.push(G === S ? f : S[b[0]]);
                if (BX1) BX1.push(x1), BX2.push(x2);
                if (BY1) BY1.push(y1), BY2.push(y2);
                for (const o of outputs) o.reduce(b, extent);
                if (sort) sort.reduce(b);
              }
            }
          }
        }
        groupFacets.push(groupFacet);
      }
      maybeSort(groupFacets, sort, reverse);
      return {data: groupData, facets: groupFacets};
    }),
    ...!hasOutput(outputs, "x") && (BX1 ? {x1: BX1, x2: BX2, x: mid(BX1, BX2)} : {x, x1, x2}),
    ...!hasOutput(outputs, "y") && (BY1 ? {y1: BY1, y2: BY2, y: mid(BY1, BY2)} : {y, y1, y2}),
    ...GK && {[gk]: GK},
    ...Object.fromEntries(outputs.map(({name, output}) => [name, output]))
  };
}

// Allow bin options to be specified as part of outputs; merge them into options.
function mergeOptions({cumulative, domain, thresholds, ...outputs}, options) {
  return [outputs, {cumulative, domain, thresholds, ...options}];
}

function maybeBinValue(value, {cumulative, domain, thresholds}, defaultValue) {
  value = {...maybeValue(value)};
  if (value.domain === undefined) value.domain = domain;
  if (value.cumulative === undefined) value.cumulative = cumulative;
  if (value.thresholds === undefined) value.thresholds = thresholds;
  if (value.value === undefined) value.value = defaultValue;
  value.thresholds = maybeThresholds(value.thresholds);
  return value;
}

function maybeBinValueTuple(options) {
  let {x, y} = options;
  x = maybeBinValue(x, options);
  y = maybeBinValue(y, options);
  ([x.value, y.value] = maybeTuple(x.value, y.value));
  return {x, y};
}

function maybeBin(options) {
  if (options == null) return;
  const {value, cumulative, domain = d3.extent, thresholds} = options;
  const bin = data => {
    let V = valueof(data, value);
    const bin = d3.bin().value(i => V[i]);
    if (isTemporal(V) || isTimeThresholds(thresholds)) {
      V = V.map(coerceDate);
      let [min, max] = typeof domain === "function" ? domain(V) : domain;
      let t = typeof thresholds === "function" && !isInterval(thresholds) ? thresholds(V, min, max) : thresholds;
      if (typeof t === "number") t = d3.utcTickInterval(min, max, t);
      if (isInterval(t)) {
        if (domain === d3.extent) {
          min = t.floor(min);
          max = t.ceil(new Date(+max + 1));
        }
        t = t.range(min, max);
      }
      bin.thresholds(t).domain([min, max]);
    } else {
      bin.thresholds(thresholds).domain(domain);
    }
    let bins = bin(range(data)).map(binset);
    if (cumulative) bins = (cumulative < 0 ? bins.reverse() : bins).map(bincumset);
    return bins.map(binfilter);
  };
  bin.label = labelof(value);
  return bin;
}

function maybeThresholds(thresholds = thresholdAuto) {
  if (typeof thresholds === "string") {
    switch (thresholds.toLowerCase()) {
      case "freedman-diaconis": return d3.thresholdFreedmanDiaconis;
      case "scott": return d3.thresholdScott;
      case "sturges": return d3.thresholdSturges;
      case "auto": return thresholdAuto;
    }
    throw new Error("invalid thresholds");
  }
  return thresholds; // pass array, count, or function to bin.thresholds
}

function thresholdAuto(values, min, max) {
  return Math.min(200, d3.thresholdScott(values, min, max));
}

function isTimeThresholds(t) {
  return isTimeInterval(t) || t && t[Symbol.iterator] && isTemporal(t);
}

function isTimeInterval(t) {
  return isInterval(t) && typeof t === "function" && t() instanceof Date;
}

function isInterval(t) {
  return t ? typeof t.range === "function" : false;
}

function binset(bin) {
  return [bin, new Set(bin)];
}

function bincumset([bin], j, bins) {
  return [
    bin,
    {
      get size() {
        for (let k = 0; k <= j; ++k) {
          if (bins[k][1].size) {
            return 1; // a non-empty value
          }
        }
        return 0;
      },
      has(i) {
        for (let k = 0; k <= j; ++k) {
          if (bins[k][1].has(i)) {
            return true;
          }
        }
        return false;
      }
    }
  ];
}

function binfilter([{x0, x1}, set]) {
  return [x0, x1, set.size ? I => I.filter(set.has, set) : binempty];
}

function binempty() {
  return new Uint32Array(0);
}

function mapX(m, options = {}) {
  return map(Object.fromEntries(["x", "x1", "x2"]
    .filter(key => options[key] != null)
    .map(key => [key, m])), options);
}

function mapY(m, options = {}) {
  return map(Object.fromEntries(["y", "y1", "y2"]
    .filter(key => options[key] != null)
    .map(key => [key, m])), options);
}

function map(outputs = {}, options = {}) {
  const z = maybeZ(options);
  const channels = Object.entries(outputs).map(([key, map]) => {
    const input = maybeInput(key, options);
    if (input == null) throw new Error(`missing channel: ${key}`);
    const [output, setOutput] = lazyChannel(input);
    return {key, input, output, setOutput, map: maybeMap(map)};
  });
  return {
    ...basic(options, (data, facets) => {
      const Z = valueof(data, z);
      const X = channels.map(({input}) => valueof(data, input));
      const MX = channels.map(({setOutput}) => setOutput(new Array(data.length)));
      for (const facet of facets) {
        for (const I of Z ? d3.group(facet, i => Z[i]).values() : [facet]) {
          channels.forEach(({map}, i) => map.map(I, X[i], MX[i]));
        }
      }
      return {data, facets};
    }),
    ...Object.fromEntries(channels.map(({key, output}) => [key, output]))
  };
}

function maybeMap(map) {
  if (map && typeof map.map === "function") return map;
  if (typeof map === "function") return mapFunction(map);
  switch (`${map}`.toLowerCase()) {
    case "cumsum": return mapCumsum;
    case "rank": return mapFunction(d3.rank);
    case "quantile": return mapFunction(rankQuantile);
  }
  throw new Error("invalid map");
}

function rankQuantile(V) {
  const n = d3.count(V) - 1;
  return d3.rank(V).map(r => r / n);
}

function mapFunction(f) {
  return {
    map(I, S, T) {
      const M = f(take(S, I));
      if (M.length !== I.length) throw new Error("mismatched length");
      for (let i = 0, n = I.length; i < n; ++i) T[I[i]] = M[i];
    }
  };
}

const mapCumsum = {
  map(I, S, T) {
    let sum = 0;
    for (const i of I) T[i] = sum += S[i];
  }
};

function normalizeX(basis, options) {
  if (arguments.length === 1) ({basis, ...options} = basis);
  return mapX(normalize(basis), options);
}

function normalizeY(basis, options) {
  if (arguments.length === 1) ({basis, ...options} = basis);
  return mapY(normalize(basis), options);
}

function normalize(basis) {
  if (basis === undefined) return normalizeFirst;
  if (typeof basis === "function") return normalizeBasis((I, S) => basis(take(S, I)));
  switch (`${basis}`.toLowerCase()) {
    case "deviation": return normalizeDeviation;
    case "first": return normalizeFirst;
    case "last": return normalizeLast;
    case "max": return normalizeMax;
    case "mean": return normalizeMean;
    case "median": return normalizeMedian;
    case "min": return normalizeMin;
    case "sum": return normalizeSum;
    case "extent": return normalizeExtent;
  }
  throw new Error("invalid basis");
}

function normalizeBasis(basis) {
  return {
    map(I, S, T) {
      const b = +basis(I, S);
      for (const i of I) {
        T[i] = S[i] === null ? NaN : S[i] / b;
      }
    }
  };
}

const normalizeExtent = {
  map(I, S, T) {
    const [s1, s2] = d3.extent(I, i => S[i]), d = s2 - s1;
    for (const i of I) {
      T[i] = S[i] === null ? NaN : (S[i] - s1) / d;
    }
  }
};

const normalizeFirst = normalizeBasis((I, S) => {
  for (let i = 0; i < I.length; ++i) {
    const s = S[I[i]];
    if (defined(s)) return s;
  }
});

const normalizeLast = normalizeBasis((I, S) => {
  for (let i = I.length - 1; i >= 0; --i) {
    const s = S[I[i]];
    if (defined(s)) return s;
  }
});

const normalizeDeviation = {
  map(I, S, T) {
    const m = d3.mean(I, i => S[i]);
    const d = d3.deviation(I, i => S[i]);
    for (const i of I) {
      T[i] = S[i] === null ? NaN : d ? (S[i] - m) / d : 0;
    }
  }
};

const normalizeMax = normalizeBasis((I, S) => d3.max(I, i => S[i]));
const normalizeMean = normalizeBasis((I, S) => d3.mean(I, i => S[i]));
const normalizeMedian = normalizeBasis((I, S) => d3.median(I, i => S[i]));
const normalizeMin = normalizeBasis((I, S) => d3.min(I, i => S[i]));
const normalizeSum = normalizeBasis((I, S) => d3.sum(I, i => S[i]));

function windowX(windowOptions = {}, options) {
  if (arguments.length === 1) options = windowOptions;
  return mapX(window$1(windowOptions), options);
}

function windowY(windowOptions = {}, options) {
  if (arguments.length === 1) options = windowOptions;
  return mapY(window$1(windowOptions), options);
}

function window$1(options = {}) {
  if (typeof options === "number") options = {k: options};
  let {k, reduce, shift, anchor = maybeShift(shift)} = options;
  if (!((k = Math.floor(k)) > 0)) throw new Error("invalid k");
  return maybeReduce(reduce)(k, maybeAnchor(anchor, k));
}

function maybeAnchor(anchor = "middle", k) {
  switch (`${anchor}`.toLowerCase()) {
    case "middle": return (k - 1) >> 1;
    case "start": return 0;
    case "end": return k - 1;
  }
  throw new Error("invalid anchor");
}

function maybeShift(shift) {
  if (shift === undefined) return;
  console.warn("shift is deprecated; please use anchor instead");
  switch (`${shift}`.toLowerCase()) {
    case "centered": return "middle";
    case "leading": return "start";
    case "trailing": return "end";
  }
  throw new Error("invalid shift");
}

function maybeReduce(reduce = "mean") {
  if (typeof reduce === "string") {
    switch (reduce.toLowerCase()) {
      case "deviation": return reduceSubarray(d3.deviation);
      case "max": return reduceSubarray(d3.max);
      case "mean": return reduceMean;
      case "median": return reduceSubarray(d3.median);
      case "min": return reduceSubarray(d3.min);
      case "mode": return reduceSubarray(d3.mode);
      case "sum": return reduceSum;
      case "variance": return reduceSubarray(d3.variance);
      case "difference": return reduceDifference;
      case "ratio": return reduceRatio;
      case "first": return reduceFirst;
      case "last": return reduceLast;
    }
  }
  if (typeof reduce !== "function") throw new Error("invalid reduce");
  return reduceSubarray(reduce);
}

function reduceSubarray(f) {
  return (k, s) => ({
    map(I, S, T) {
      const C = Float64Array.from(I, i => S[i] === null ? NaN : S[i]);
      let nans = 0;
      for (let i = 0; i < k - 1; ++i) if (isNaN(C[i])) ++nans;
      for (let i = 0, n = I.length - k + 1; i < n; ++i) {
        if (isNaN(C[i + k - 1])) ++nans;
        T[I[i + s]] = nans === 0 ? f(C.subarray(i, i + k)) : NaN;
        if (isNaN(C[i])) --nans;
      }
    }
  });
}

function reduceSum(k, s) {
  return {
    map(I, S, T) {
      let nans = 0;
      let sum = 0;
      for (let i = 0; i < k - 1; ++i) {
        const v = S[I[i]];
        if (v === null || isNaN(v)) ++nans;
        else sum += +v;
      }
      for (let i = 0, n = I.length - k + 1; i < n; ++i) {
        const a = S[I[i]];
        const b = S[I[i + k - 1]];
        if (b === null || isNaN(b)) ++nans;
        else sum += +b;
        T[I[i + s]] = nans === 0 ? sum : NaN;
        if (a === null || isNaN(a)) --nans;
        else sum -= +a;
      }
    }
  };
}

function reduceMean(k, s) {
  const sum = reduceSum(k, s);
  return {
    map(I, S, T) {
      sum.map(I, S, T);
      for (let i = 0, n = I.length - k + 1; i < n; ++i) {
        T[I[i + s]] /= k;
      }
    }
  };
}

function reduceDifference(k, s) {
  return {
    map(I, S, T) {
      for (let i = 0, n = I.length - k; i < n; ++i) {
        const a = S[I[i]];
        const b = S[I[i + k - 1]];
        T[I[i + s]] = a === null || b === null ? NaN : b - a;
      }
    }
  };
}

function reduceRatio(k, s) {
  return {
    map(I, S, T) {
      for (let i = 0, n = I.length - k; i < n; ++i) {
        const a = S[I[i]];
        const b = S[I[i + k - 1]];
        T[I[i + s]] = a === null || b === null ? NaN : b / a;
      }
    }
  };
}

function reduceFirst(k, s) {
  return {
    map(I, S, T) {
      for (let i = 0, n = I.length - k; i < n; ++i) {
        T[I[i + s]] = S[I[i]];
      }
    }
  };
}

function reduceLast(k, s) {
  return {
    map(I, S, T) {
      for (let i = 0, n = I.length - k; i < n; ++i) {
        T[I[i + s]] = S[I[i + k - 1]];
      }
    }
  };
}

function selectFirst(options) {
  return select(first, undefined, options);
}

function selectLast(options) {
  return select(last, undefined, options);
}

function selectMinX(options = {}) {
  const x = options.x;
  if (x == null) throw new Error("missing channel: x");
  return select(min, x, options);
}

function selectMinY(options = {}) {
  const y = options.y;
  if (y == null) throw new Error("missing channel: y");
  return select(min, y, options);
}

function selectMaxX(options = {}) {
  const x = options.x;
  if (x == null) throw new Error("missing channel: x");
  return select(max, x, options);
}

function selectMaxY(options = {}) {
  const y = options.y;
  if (y == null) throw new Error("missing channel: y");
  return select(max, y, options);
}

// TODO If the value (for some required channel) is undefined, scan forward?
function* first(I) {
  yield I[0];
}

// TODO If the value (for some required channel) is undefined, scan backward?
function* last(I) {
  yield I[I.length - 1];
}

function* min(I, X) {
  yield d3.least(I, i => X[i]);
}

function* max(I, X) {
  yield d3.greatest(I, i => X[i]);
}

function select(selectIndex, v, options) {
  const z = maybeZ(options);
  return basic(options, (data, facets) => {
    const Z = valueof(data, z);
    const V = valueof(data, v);
    const selectFacets = [];
    for (const facet of facets) {
      const selectFacet = [];
      for (const I of Z ? d3.group(facet, i => Z[i]).values() : [facet]) {
        for (const i of selectIndex(I, V)) {
          selectFacet.push(i);
        }
      }
      selectFacets.push(selectFacet);
    }
    return {data, facets: selectFacets};
  });
}

exports.Area = Area;
exports.BarX = BarX;
exports.BarY = BarY;
exports.Cell = Cell;
exports.Dot = Dot;
exports.Frame = Frame;
exports.Image = Image;
exports.Line = Line;
exports.Link = Link;
exports.Mark = Mark;
exports.Rect = Rect;
exports.RuleX = RuleX;
exports.RuleY = RuleY;
exports.Text = Text;
exports.TickX = TickX;
exports.TickY = TickY;
exports.area = area;
exports.areaX = areaX;
exports.areaY = areaY;
exports.barX = barX;
exports.barY = barY;
exports.bin = bin;
exports.binX = binX;
exports.binY = binY;
exports.brush = brush;
exports.brushX = brushX;
exports.brushY = brushY;
exports.cell = cell;
exports.cellX = cellX;
exports.cellY = cellY;
exports.dot = dot;
exports.dotX = dotX;
exports.dotY = dotY;
exports.filter = filter;
exports.formatIsoDate = formatIsoDate;
exports.formatMonth = formatMonth;
exports.formatWeekday = formatWeekday;
exports.frame = frame;
exports.group = group;
exports.groupX = groupX;
exports.groupY = groupY;
exports.groupZ = groupZ;
exports.image = image;
exports.legend = legend;
exports.line = line;
exports.lineX = lineX;
exports.lineY = lineY;
exports.link = link;
exports.map = map;
exports.mapX = mapX;
exports.mapY = mapY;
exports.marks = marks;
exports.normalize = normalize;
exports.normalizeX = normalizeX;
exports.normalizeY = normalizeY;
exports.plot = plot;
exports.rect = rect;
exports.rectX = rectX;
exports.rectY = rectY;
exports.reverse = reverse;
exports.ruleX = ruleX;
exports.ruleY = ruleY;
exports.scale = scale;
exports.selectFirst = selectFirst;
exports.selectLast = selectLast;
exports.selectMaxX = selectMaxX;
exports.selectMaxY = selectMaxY;
exports.selectMinX = selectMinX;
exports.selectMinY = selectMinY;
exports.shuffle = shuffle;
exports.sort = sort;
exports.stackX = stackX;
exports.stackX1 = stackX1;
exports.stackX2 = stackX2;
exports.stackY = stackY;
exports.stackY1 = stackY1;
exports.stackY2 = stackY2;
exports.text = text;
exports.textX = textX;
exports.textY = textY;
exports.tickX = tickX;
exports.tickY = tickY;
exports.valueof = valueof;
exports.version = version;
exports.window = window$1;
exports.windowX = windowX;
exports.windowY = windowY;

Object.defineProperty(exports, '__esModule', { value: true });

}));
