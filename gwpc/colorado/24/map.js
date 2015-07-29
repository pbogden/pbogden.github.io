d3.colorado=function(){function w(t,n,r,i,s){t&&console.log(t);var o=Object.keys(i.objects).map(function(e){return topojson.feature(i,i.objects[e])});m.append("path").datum(topojson.merge(n,n.objects.co.geometries)).attr("class","state").attr("d",c),m.append("path").datum(topojson.mesh(n,n.objects.co,function(e,t){return e!==t})).attr("class","county").attr("d",c),m.selectAll("path.basin").data(o[0].features).enter().append("path").attr("class","basin").attr("d",c).on("mouseover",k).on("mouseout",O),m.selectAll("path.play").data(o[1].features).enter().append("path").attr("class","play").attr("d",c).on("mouseover",L).on("mouseout",O),m.selectAll("path.well").data(r).enter().append("path").attr("class","well").attr("d",function(e){return c(e.location)}).on("mouseover",N).on("mouseout",O),m.selectAll("path.quake").data(s.features.filter(function(e){return+e.properties.mag>=2.5})).enter().append("path").attr("class","quake").attr("d",c).on("mouseover",C).on("mouseout",O),T(),e()}function E(){g.text(S(f.invert(d3.mouse(this)),u().scale*2*Math.PI)),A()}function S(e,t){var n=d3.format("."+Math.floor(Math.log(t)/2)+"f");return(e[1]<0?n(-e[1])+"°S":n(e[1])+"°N")+" "+(e[0]<0?n(-e[0])+"°W":n(e[0])+"°E")}function x(){v.selectAll("image").remove(),T()}function T(){function r(e){return url.indexOf("mqcdn")>-1?"http://otile"+["1","2","3","4"][Math.random()*4|0]+url+e[2]+"/"+e[0]+"/"+e[1]+".png":"http://"+["a","b","c"][Math.random()*3|0]+url+e[2]+"/"+e[0]+"/"+e[1]+".png"}var e=u.scale(h.scale()).translate(h.translate())();m.attr("transform","translate("+h.translate()+")scale("+h.scale()/o+")").style("stroke-width",o/h.scale()),c.pointRadius(4.5*o/h.scale()),m.selectAll("path.quake").attr("d",c),m.selectAll("path.well").attr("d",function(e){return c(e.location)}),f.scale(h.scale()/2/Math.PI).translate(h.translate());var t;b.each(function(e,n){this.checked&&(t=n)}),url=i[t];if(!url)return;var n=v.attr("transform","scale("+e.scale+")translate("+e.translate+")").selectAll("image").data(e,function(e){return e});n.exit().remove(),n.enter().append("image").attr("xlink:href",r).attr("width",1).attr("height",1).attr("x",function(e){return e[0]}).attr("y",function(e){return e[1]})}function N(e){var t=0,n=e.formationCodes[t],r=e[n].metadata==null?null:Object.keys(e[n].metadata),i=r==null?["No data"]:r.map(function(t){return t+": "+e[n].metadata[t]});y.html(i.join().replace(/,/g,"<br>")).style("visibility","visible").style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px"),d3.selectAll("path.well.active").classed("active",!1),d3.select(this).classed("active",!0)}function C(e){console.log("quakeTooltip:",e);if(d3.select(this).style("visibility")=="hidden")return;y[0][0].innerHTML=e.properties.title+" (earthquake)",y.style("visibility","visible"),y.style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px")}function k(e){y[0][0].innerHTML=e.properties.NAME+" (basin)",y.style("visibility","visible"),y.style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px")}function L(e){var t=e.properties.Shale_Play+" (play)";y[0][0].innerHTML=t,y.style("visibility","visible"),y.style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px")}function A(e){y.style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px")}function O(e){y.style("visibility","hidden")}var e,t=function(n){return e=n,t},n=700,r=500,i=[".tiles.mapbox.com/v3/examples.map-i86nkdio/",".tiles.mapbox.com/v3/brunosan.map-cyglrrfu/",".mqcdn.com/tiles/1.0.0/map/",".mqcdn.com/tiles/1.0.0/sat/",".tile.thunderforest.com/landscape/",".tile.thunderforest.com/cycle/",".tile.stamen.com/terrain-background/",".tile.stamen.com/toner/",".tile.stamen.com/watercolor/",""],s=7,o=1<<8+s,u=d3.geo.tile().size([n,r]),a=d3.geo.mercator().scale(o/2/Math.PI).translate([0,0]),f=d3.geo.mercator(),l=a([-105.55,39]),c=d3.geo.path().projection(a),h=d3.behavior.zoom().scale(a.scale()*2*Math.PI).scaleExtent([o,1<<23]).center([n/2,r/2]).translate([n/2-l[0],r/2-l[1]]).on("zoom",T),p=d3.select("body").append("div").attr("class","map").style("width",n+"px").style("height",r+"px").call(h).on("mousemove",E),d=p.append("svg").style("width",n+"px").style("height",r+"px"),v=d.append("g"),m=d.append("g"),g=p.append("div").attr("class","info"),y=d3.select("body").append("div").attr("class","tooltip").style("pointer-events","none").style("visibility","hidden"),b=d3.selectAll("#myRadios input").on("change",x);return queue().defer(d3.json,"co.json").defer(d3.json,"data.json").defer(d3.json,"shalegasplay.json").defer(d3.json,"quakes.json").await(w),t.tooltip=function(){d3.select("div.tooltip").remove(),y=d3.select("body").append("div").attr("class","tooltip").style("pointer-events","none").style("visibility","hidden")},t},d3.timeseries=function(){function l(s){function o(n,r,i){if(n)throw n;e=r,i.features=i.features.filter(function(e){return+e.properties.mag>=f}),t=i,v([]),s()}return arguments.length||(s=function(){console.log("Done initializing d3.timeseries")}),d3.select("#wells").node()!==null?e:(i=d3.select("body").append("svg").attr("id","timeseries").attr("width",n).attr("height",r),queue().defer(d3.json,"data.json").defer(d3.json,"quakes.json").await(o),l)}function c(e){tooltip[0][0].innerHTML=e.properties.NAME+" Basin",tooltip.style("visibility","visible"),tooltip.style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px")}function h(e){var t=e.properties.Shale_Play+" Play";e.properties.Current==="Y"&&(t+=" (current)"),e.properties.Current==="N"&&(t+=" (prospective)"),tooltip[0][0].innerHTML=t,tooltip.style("visibility","visible"),tooltip.style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px")}function p(e){tooltip.style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px")}function d(e){tooltip.style("visibility","hidden")}function v(e,t,n){var r={top:20,right:80,bottom:50,left:80},o=+i.attr("width")-r.left-r.right,a=+i.attr("height")/2-r.top-r.bottom,f=d3.extent(e.map(function(e){return e.y})),l=d3.scale.linear().domain(f).range([a,0]),c=d3.extent(e.map(function(e){return e.tbg}));c[1]=d3.max([c[1],t]);var h=d3.scale.linear().domain(c).range([a,0]),p=d3.svg.line().x(function(e){return u(e.x)}).y(function(e){return l(e.y)}),d=d3.svg.area().x(function(e){return u(e.x)}).y0(a).y1(function(e){return l(e.y)});s||(s=i.append("g").attr("id","myTimeSeries").attr("transform","translate("+r.left+","+(+i.attr("height")/2+r.top)+")"),s.append("g").attr("class","x axis").attr("transform","translate(0,"+a+")"),s.append("g").attr("class","y axis"),s.append("g").attr("class","p axis").attr("transform","translate("+o+", 0)"),s.append("text").attr("class","y label").attr("text-anchor","middle").attr("x",-a/2).attr("y",-8-r.left/3).attr("dy","-.75em").attr("transform","rotate(-90)").style("fill","steelblue").text("Injection Volume"),s.append("text").attr("class","y label").attr("text-anchor","end").attr("x",-8).attr("y",6).attr("dy",".75em").attr("transform","rotate(-90)").style("fill","steelblue").text("barrels/month"),s.append("text").attr("class","y label").attr("text-anchor","middle").attr("x",-a/2).attr("y",o+r.right).attr("dy","-.75em").attr("transform","rotate(-90)").style("fill","red").text("Tubing Pressure"),s.append("text").attr("class","p label").attr("text-anchor","end").attr("x",-8).attr("y",o-18).attr("dy",".75em").attr("transform","rotate(-90)").style("fill","red").text("PSI"),s.append("text").attr("class","maxp label").attr("text-anchor","end").attr("x",o).attr("y","0em").style("fill","red").style("font-size","0.7em"),s.append("text").attr("class","api-number").style("text-anchor","end").attr("x",o).attr("y","-2.2em").text("select a well (on map)"),s.append("text").attr("class","formation-code").style("text-anchor","end").attr("y","-1.2em").attr("x",o).text("")),typeof u=="undefined"&&(u=d3.time.scale().domain(d3.extent(e.map(function(e){return e.x}))).range([0,o]));var v=s,m=v.selectAll("path.injection-volume").data([e]);m.attr("d",p),m.enter().append("path").attr("class","injection-volume").attr("d",p),m.exit().remove();var g=v.selectAll("path.area").data([e]);g.enter().append("path").attr("class","area").style("fill-opacity",.8).style("fill","steelblue").attr("d",d),g.attr("d",d),g.exit().remove();var y=v.selectAll("path.pressure").data([e]);p.y(function(e){return h(e.tbg)}),y.enter().append("path").attr("class","pressure").attr("d",p),y.attr("d",p),y.exit().remove();var b=t?[{x:u.domain()[0],tbg:t},{x:u.domain()[1],tbg:t}]:[],w=v.selectAll("path.pressure-limit").data([b]);w.attr("d",p),w.enter().append("path").attr("class","pressure-limit").attr("d",p),w.exit().remove();var E=d3.select(".maxp.label").text("");t&&E.attr("y",h(t)-5).text("maximum pressure limit");var S=d3.svg.axis().scale(u).ticks(5).orient("bottom"),T=d3.svg.axis().scale(l).ticks(5).tickFormat(d3.format("s")).orient("left"),N=d3.svg.axis().scale(h).ticks(5).tickFormat(d3.format("s")).orient("right");v.selectAll("g.y.axis").call(T),v.selectAll("g.x.axis").call(S),v.selectAll("g.p.axis").call(N),v.selectAll(".y.axis text").style("fill","steelblue"),v.selectAll(".p.axis text").style("fill","red")}var e,t,n=360,r=500,i,s,o=d3.format(",.0f"),u,a=4,f=2.5;return l.plotem=function(){function u(e){function s(t){var n=e.formationCodes[t],r=e[n].ts.map(function(e){return{x:new Date(+e.year,+e.month-1),y:+e.vol,tbg:+e.tbg,csg:e.csg}}),i=+e[n].max_wat_inj_press,s=+e[n].max_inj_volume;v(r,i,s),d3.select(".api-number").text("API Number: "+e.api),d3.select(".formation-code").text("Formation code: "+n);var o=e[n].metadata==null?null:Object.keys(e[n].metadata),u=o==null?["No data"]:o.map(function(t){return t+": "+e[n].metadata[t]})}console.log("mousedWell",e.formationCodes,e);var t=0,n=e.formationCodes[t],r=e[n].metadata==null?null:Object.keys(e[n].metadata),i=r==null?["No data"]:r.map(function(t){return t+": "+e[n].metadata[t]});i="Formation codes: "+e.formationCodes.join().replace(/,/g,", ")+"<br>"+i.join().replace(/,/g,"<br>"),d3.select(".tooltip").html(i).style("visibility","visible").style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px"),d3.selectAll("path.well.active").classed("active",!1),d3.select(this).classed("active",!0),d3.select(this).on("click",function(){t=++t<e.formationCodes.length?t:0,console.log("clicked well, formationIndex:",t),s(t)}),s(0)}var t=i.selectAll(".formationLabel").data([o(e.length)+" wells"]);t.enter().append("text").attr("class","formationLabel").attr("x",.7*n).attr("y",.1*r).style("font-size","20px").text(String),t.text(String);var s=d3.selectAll("path.well").on("mouseover",u);return l},l.plotQuakes=function(){var e=i.select("g").selectAll("path.quake").data(t.features);e.exit().remove(),e.attr("d",function(e){return path(e.values.location)}),e.enter().append("path").attr("class","quake").attr("d",path).on("mouseover",u);var s=i.selectAll(".quakesLabel").data([o(t.features.length)+" earthquakes"]);s.enter().append("text").attr("class","quakesLabel").attr("x",.7*n).attr("y",.1*r).attr("dy","1.1em").style("font-size","20px").text(String),s.text(String);return l;var u},l.plotQuakeSeries=function(){function h(){function n(t){return t.properties.time>e[0][0]&&t.properties.time<e[1][0]&&t.properties.mag>=e[0][1]&&t.properties.mag<=e[1][1]?1:0}var e=c.extent();c.empty()&&(e=p(e[0][0]),d3.selectAll(".brush").call(c.extent(e))),d3.selectAll("path.quake").style("pointer-events",function(e){return n(e)==1?"all":"none"}).style("visibility",function(e){return n(e)==1?"visible":"hidden"});var t=d3.selectAll("path.quake").filter(n)[0].length;d3.select(".quakesLabel").html(t+" earthquakes")}function p(e){var t,n;return n=new Date(e),n.setFullYear(e.getFullYear()+1),n=n<u.domain()[1]?n:u.domain()[1],t=new Date(n),t.setFullYear(n.getFullYear()-2),[[t,o.domain()[0]],[n,o.domain()[1]]]}var e={top:30,right:80,bottom:80,left:80},n=+i.attr("width")-e.left-e.right,r=+i.attr("height")/2-e.top-e.bottom,s=i.append("g").attr("transform","translate("+e.left+","+e.top+")");u=d3.time.scale().domain(d3.extent(t.features.map(function(e){return e.properties.time}))).range([0,n]);var o=d3.scale.linear().domain(d3.extent(t.features.map(function(e){return+e.properties.mag}))).range([r,0]),a=d3.svg.axis().scale(u).ticks(6).orient("bottom"),f=d3.svg.axis().scale(o).ticks(5).orient("left");s.append("text").attr("class","y label").attr("text-anchor","end").attr("x",-6).attr("y",6).attr("dy",".75em").attr("transform","rotate(-90)").text("magnitude"),s.append("text").attr("class","x label").attr("text-anchor","middle").attr("x",n/2).attr("y",-e.top/2).attr("dy","+.75em").text("Earthquakes");var c=d3.svg.brush().x(u).y(o).extent(p(u.domain()[1])).on("brush",h);return s.selectAll("circle.quake").data(t.features).enter().append("circle").attr("class","quake").attr("cx",function(e){return u(+e.properties.time)}).attr("cy",function(e){return o(+e.properties.mag)}).attr("r",3),s.append("g").attr("class","x axis").attr("transform","translate(0,"+r+")").call(a),s.append("g").attr("class","q axis").call(f),s.attr("class","brush").call(c),h(),l},l.quakes=function(e){return arguments.length?(t=e,l):t},l.wells=function(t){return arguments.length?(e=t,l):e},l}