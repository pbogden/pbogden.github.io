d3.colorado=function(){function E(t,n,r,i,s,o){t&&console.log(t),console.log("wells",o),console.log("wells[0]",o[0]);var u=Object.keys(i.objects).map(function(e){return topojson.feature(i,i.objects[e])});g.append("path").datum(topojson.merge(n,n.objects.ok.geometries)).attr("class","state").attr("d",h),g.append("path").datum(topojson.mesh(n,n.objects.ok,function(e,t){return e!==t})).attr("class","county").attr("d",h),g.selectAll("path.basin").data(u[0].features).enter().append("path").attr("class","basin").attr("d",h).on("mouseover",L).on("mouseout",M),g.selectAll("path.play").data(u[1].features).enter().append("path").attr("class","play").attr("d",h).on("mouseover",A).on("mouseout",M),o.forEach(function(e){e.location={type:"Point",coordinates:[+e.x,+e.Y]}}),g.selectAll("path.well").data(o).enter().append("path").attr("class","well").attr("d",function(e){return h(e.location)}).on("mouseover",C).on("mouseout",M),g.selectAll("path.quake").data(s.features.filter(function(e){return+e.properties.mag>=2.5})).enter().append("path").attr("class","quake").attr("d",h).on("mouseover",k).on("mouseout",M),N(),e()}function S(){y.text(x(l.invert(d3.mouse(this)),a().scale*2*Math.PI)),O()}function x(e,t){var n=d3.format("."+Math.floor(Math.log(t)/2)+"f");return(e[1]<0?n(-e[1])+"°S":n(e[1])+"°N")+" "+(e[0]<0?n(-e[0])+"°W":n(e[0])+"°E")}function T(){m.selectAll("image").remove(),N()}function N(){function r(e){return url.indexOf("mqcdn")>-1?"http://otile"+["1","2","3","4"][Math.random()*4|0]+url+e[2]+"/"+e[0]+"/"+e[1]+".png":"http://"+["a","b","c"][Math.random()*3|0]+url+e[2]+"/"+e[0]+"/"+e[1]+".png"}var e=a.scale(p.scale()).translate(p.translate())();g.attr("transform","translate("+p.translate()+")scale("+p.scale()/u+")").style("stroke-width",u/p.scale()),h.pointRadius(4.5*u/p.scale()),g.selectAll("path.quake").attr("d",h),g.selectAll("path.well").attr("d",function(e){return h(e.location)}),l.scale(p.scale()/2/Math.PI).translate(p.translate());var t;w.each(function(e,n){this.checked&&(t=n)}),url=i[t];if(!url)return;var n=m.attr("transform","scale("+e.scale+")translate("+e.translate+")").selectAll("image").data(e,function(e){return e});n.exit().remove(),n.enter().append("image").attr("xlink:href",r).attr("width",1).attr("height",1).attr("x",function(e){return e[0]}).attr("y",function(e){return e[1]})}function C(e){var t=Object.keys(e);t.splice(t.indexOf("location"),1);var n=t==null?["No data"]:t.map(function(t){return t+": "+e[t]});b.html(n.join().replace(/,/g,"<br>")).style("visibility","visible").style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px"),d3.selectAll("path.well.active").classed("active",!1),d3.select(this).classed("active",!0)}function k(e){console.log("quakeTooltip:",e);if(d3.select(this).style("visibility")=="hidden")return;b.html(e.properties.title+"<br>Depth: "+e.geometry.coordinates[2]+" km"+"<br>Date: "+s(new Date(e.properties.time))).style("visibility","visible").style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px"),b.style("visibility","visible"),b.style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px")}function L(e){b[0][0].innerHTML=e.properties.NAME+" (basin)",b.style("visibility","visible"),b.style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px")}function A(e){var t=e.properties.Shale_Play+" (play)";b[0][0].innerHTML=t,b.style("visibility","visible"),b.style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px")}function O(e){b.style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px")}function M(e){b.style("visibility","hidden")}var e,t=function(n){return e=n,t},n=700,r=400,i=[".tiles.mapbox.com/v3/examples.map-i86nkdio/",".tiles.mapbox.com/v3/brunosan.map-cyglrrfu/",".mqcdn.com/tiles/1.0.0/map/",".mqcdn.com/tiles/1.0.0/sat/",".tile.thunderforest.com/landscape/",".tile.thunderforest.com/cycle/",".tile.stamen.com/terrain-background/",".tile.stamen.com/toner/",".tile.stamen.com/watercolor/",""],s=d3.time.format("%c"),o=6.75,u=Math.pow(2,8+o),a=d3.geo.tile().size([n,r]),f=d3.geo.mercator().scale(u/2/Math.PI).translate([0,0]),l=d3.geo.mercator(),c=f([-98.75,35.5]),h=d3.geo.path().projection(f),p=d3.behavior.zoom().scale(f.scale()*2*Math.PI).scaleExtent([u,1<<23]).center([n/2,r/2]).translate([n/2-c[0],r/2-c[1]]).on("zoom",N),d=d3.select("body").append("div").attr("class","map").style("width",n+"px").style("height",r+"px").call(p).on("mousemove",S),v=d.append("svg").style("width",n+"px").style("height",r+"px"),m=v.append("g"),g=v.append("g"),y=d.append("div").attr("class","info"),b=d3.select("body").append("div").attr("class","tooltip").style("pointer-events","none").style("visibility","hidden"),w=d3.selectAll("#myRadios input").on("change",T);return queue().defer(d3.json,"ok.json").defer(d3.json,"data.json").defer(d3.json,"shalegasplay.json").defer(d3.json,"quakes.json").defer(d3.csv,"wells.csv").await(E),t.tooltip=function(){d3.select("div.tooltip").remove(),b=d3.select("body").append("div").attr("class","tooltip").style("pointer-events","none").style("visibility","hidden")},t},d3.timeseries=function(){function l(s){function o(n,r,i){if(n)throw n;e=r,i.features=i.features.filter(function(e){return+e.properties.mag>=f}),t=i,v([]),s()}return arguments.length||(s=function(){console.log("Done initializing d3.timeseries")}),d3.select("#wells").node()!==null?e:(i=d3.select("body").append("svg").attr("id","timeseries").attr("width",n).attr("height",r),queue().defer(d3.json,"data.json").defer(d3.json,"quakes.json").await(o),l)}function c(e){tooltip[0][0].innerHTML=e.properties.NAME+" Basin",tooltip.style("visibility","visible"),tooltip.style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px")}function h(e){var t=e.properties.Shale_Play+" Play";e.properties.Current==="Y"&&(t+=" (current)"),e.properties.Current==="N"&&(t+=" (prospective)"),tooltip[0][0].innerHTML=t,tooltip.style("visibility","visible"),tooltip.style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px")}function p(e){tooltip.style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px")}function d(e){tooltip.style("visibility","hidden")}function v(e,t,n){var r={top:20,right:80,bottom:50,left:80},o=+i.attr("width")-r.left-r.right,a=+i.attr("height")/2-r.top-r.bottom,f=d3.extent(e.map(function(e){return e.y})),l=d3.scale.linear().domain(f).range([a,0]),c=d3.extent(e.map(function(e){return e.tbg}));c[1]=d3.max([c[1],t]);var h=d3.scale.linear().domain(c).range([a,0]),p=d3.svg.line().x(function(e){return u(e.x)}).y(function(e){return l(e.y)}),d=d3.svg.area().x(function(e){return u(e.x)}).y0(a).y1(function(e){return l(e.y)});s||(s=i.append("g").attr("id","myTimeSeries").attr("transform","translate("+r.left+","+(+i.attr("height")/2+r.top)+")"),s.append("g").attr("class","x axis").attr("transform","translate(0,"+a+")"),s.append("g").attr("class","y axis"),s.append("g").attr("class","p axis").attr("transform","translate("+o+", 0)"),s.append("text").attr("class","y label").attr("text-anchor","middle").attr("x",-a/2).attr("y",-8-r.left/3).attr("dy","-.75em").attr("transform","rotate(-90)").style("fill","steelblue").text("Injection Volume"),s.append("text").attr("class","y label").attr("text-anchor","end").attr("x",-8).attr("y",6).attr("dy",".75em").attr("transform","rotate(-90)").style("fill","steelblue").text("barrels/month"),s.append("text").attr("class","y label").attr("text-anchor","middle").attr("x",-a/2).attr("y",o+r.right).attr("dy","-.75em").attr("transform","rotate(-90)").style("fill","red").text("Tubing Pressure"),s.append("text").attr("class","p label").attr("text-anchor","end").attr("x",-8).attr("y",o-18).attr("dy",".75em").attr("transform","rotate(-90)").style("fill","red").text("PSI"),s.append("text").attr("class","maxp label").attr("text-anchor","end").attr("x",o).attr("y","0em").style("fill","red").style("font-size","0.7em"),s.append("text").attr("class","api-number").style("text-anchor","end").attr("x",o).attr("y","-2.2em").text("select a well (on map)"),s.append("text").attr("class","formation-code").style("text-anchor","end").attr("y","-1.2em").attr("x",o).text("")),typeof u=="undefined"&&(u=d3.time.scale().domain(d3.extent(e.map(function(e){return e.x}))).range([0,o]));var v=s,m=v.selectAll("path.injection-volume").data([e]);m.attr("d",p),m.enter().append("path").attr("class","injection-volume").attr("d",p),m.exit().remove();var g=v.selectAll("path.area").data([e]);g.enter().append("path").attr("class","area").style("fill-opacity",.8).style("fill","steelblue").attr("d",d),g.attr("d",d),g.exit().remove();var y=v.selectAll("path.pressure").data([e]);p.y(function(e){return h(e.tbg)}),y.enter().append("path").attr("class","pressure").attr("d",p),y.attr("d",p),y.exit().remove();var b=t?[{x:u.domain()[0],tbg:t},{x:u.domain()[1],tbg:t}]:[],w=v.selectAll("path.pressure-limit").data([b]);w.attr("d",p),w.enter().append("path").attr("class","pressure-limit").attr("d",p),w.exit().remove();var E=d3.select(".maxp.label").text("");t&&E.attr("y",h(t)-5).text("maximum pressure limit");var S=d3.svg.axis().scale(u).ticks(5).orient("bottom"),T=d3.svg.axis().scale(l).ticks(5).tickFormat(d3.format("s")).orient("left"),N=d3.svg.axis().scale(h).ticks(5).tickFormat(d3.format("s")).orient("right");v.selectAll("g.y.axis").call(T),v.selectAll("g.x.axis").call(S),v.selectAll("g.p.axis").call(N),v.selectAll(".y.axis text").style("fill","steelblue"),v.selectAll(".p.axis text").style("fill","red")}var e,t,n=360,r=500,i,s,o=d3.format(",.0f"),u,a=4,f=2.5;return l.plotem=function(){function s(e){function r(t){var n=e.formationCodes[t],r=e[n].ts.map(function(e){return{x:new Date(+e.year,+e.month-1),y:+e.vol,tbg:+e.tbg,csg:e.csg}}),i=+e[n].max_wat_inj_press,s=+e[n].max_inj_volume;v(r,i,s),d3.select(".api-number").text("API Number: "+e.api),d3.select(".formation-code").text("Formation code: "+n);var o=e[n].metadata==null?null:Object.keys(e[n].metadata),u=o==null?["No data"]:o.map(function(t){return t+": "+e[n].metadata[t]})}console.log("mousedWell",e);var t=e[formationCode].metadata==null?null:Object.keys(e[formationCode].metadata),n=t==null?["No data"]:t.map(function(t){return t+": "+e[formationCode].metadata[t]});n="Formation codes: "+e.formationCodes.join().replace(/,/g,", ")+"<br>"+n.join().replace(/,/g,"<br>"),d3.select(".tooltip").html(n).style("visibility","visible").style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px"),d3.selectAll("path.well.active").classed("active",!1),d3.select(this).classed("active",!0),d3.select(this).on("click",function(){formationIndex=++formationIndex<e.formationCodes.length?formationIndex:0,console.log("clicked well, formationIndex:",formationIndex),r(formationIndex)}),r(0)}var t=i.selectAll(".formationLabel").data([o(e.length)+" wells"]);return t.enter().append("text").attr("class","formationLabel").attr("x",.7*n).attr("y",.1*r).style("font-size","20px").text(String),t.text(String),l},l.plotQuakes=function(){var e=i.select("g").selectAll("path.quake").data(t.features);e.exit().remove(),e.attr("d",function(e){return path(e.values.location)}),e.enter().append("path").attr("class","quake").attr("d",path).on("mouseover",u);var s=i.selectAll(".quakesLabel").data([o(t.features.length)+" earthquakes"]);s.enter().append("text").attr("class","quakesLabel").attr("x",.7*n).attr("y",.1*r).attr("dy","1.1em").style("font-size","20px").text(String),s.text(String);return l;var u},l.plotQuakeSeries=function(){function h(){function n(t){return t.properties.time>e[0][0]&&t.properties.time<e[1][0]&&t.properties.mag>=e[0][1]&&t.properties.mag<=e[1][1]?1:0}var e=c.extent();c.empty()&&(e=p(e[0][0]),d3.selectAll(".brush").call(c.extent(e))),d3.selectAll("path.quake").style("pointer-events",function(e){return n(e)==1?"all":"none"}).style("visibility",function(e){return n(e)==1?"visible":"hidden"});var t=d3.selectAll("path.quake").filter(n)[0].length;d3.select(".quakesLabel").html(t+" earthquakes")}function p(e){var t,n;return n=new Date(e),n.setFullYear(e.getFullYear()+1),n=n<u.domain()[1]?n:u.domain()[1],t=new Date(n),t.setFullYear(n.getFullYear()-2),[[t,o.domain()[0]],[n,o.domain()[1]]]}var e={top:30,right:80,bottom:80,left:80},n=+i.attr("width")-e.left-e.right,r=+i.attr("height")/2-e.top-e.bottom,s=i.append("g").attr("transform","translate("+e.left+","+e.top+")");u=d3.time.scale().domain(d3.extent(t.features.map(function(e){return e.properties.time}))).nice().range([0,n]);var o=d3.scale.linear().domain(d3.extent(t.features.map(function(e){return+e.properties.mag}))).range([r,0]),a=d3.svg.axis().scale(u).ticks(5).orient("bottom"),f=d3.svg.axis().scale(o).ticks(5).orient("left");s.append("text").attr("class","y label").attr("text-anchor","end").attr("x",-6).attr("y",6).attr("dy",".75em").attr("transform","rotate(-90)").text("magnitude"),s.append("text").attr("class","x label").attr("text-anchor","middle").attr("x",n/2).attr("y",-e.top/2).attr("dy","+.75em").text("Earthquakes");var c=d3.svg.brush().x(u).y(o).extent(p(u.domain()[1])).on("brush",h);return s.selectAll("circle.quake").data(t.features).enter().append("circle").attr("class","quake").attr("cx",function(e){return u(+e.properties.time)}).attr("cy",function(e){return o(+e.properties.mag)}).attr("r",3),s.append("g").attr("class","x axis").attr("transform","translate(0,"+r+")").call(a),s.append("g").attr("class","q axis").call(f),s.attr("class","brush").call(c),h(),l},l.quakes=function(e){return arguments.length?(t=e,l):t},l.wells=function(t){return arguments.length?(e=t,l):e},l},d3.geo.tile=function(){function i(){var i=Math.max(Math.log(t)/Math.LN2-8,0),s=Math.round(i+r),o=Math.pow(2,i-s+8),u=[(n[0]-t/2)/o,(n[1]-t/2)/o],a=[],f=d3.range(Math.max(0,Math.floor(-u[0])),Math.max(0,Math.ceil(e[0]/o-u[0]))),l=d3.range(Math.max(0,Math.floor(-u[1])),Math.max(0,Math.ceil(e[1]/o-u[1])));return l.forEach(function(e){f.forEach(function(t){a.push([t,e,s])})}),a.translate=u,a.scale=o,a}var e=[960,500],t=256,n=[e[0]/2,e[1]/2],r=0;return i.size=function(t){return arguments.length?(e=t,i):e},i.scale=function(e){return arguments.length?(t=e,i):t},i.translate=function(e){return arguments.length?(n=e,i):n},i.zoomDelta=function(e){return arguments.length?(r=+e,i):r},i}