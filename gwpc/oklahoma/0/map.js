d3.colorado=function(){function t(t,e,a,r,c){t&&console.log(t);var u=Object.keys(r.objects).map(function(t){return topojson.feature(r,r.objects[t])});Y.append("path").datum(topojson.merge(e,e.objects.ok.geometries)).attr("class","state").attr("d",j),Y.append("path").datum(topojson.mesh(e,e.objects.ok,function(t,e){return t!==e})).attr("class","county").attr("d",j),Y.selectAll("path.basin").data(u[0].features).enter().append("path").attr("class","basin").attr("d",j).on("mouseover",o).on("mouseout",d),Y.selectAll("path.play").data(u[1].features).enter().append("path").attr("class","play").attr("d",j).on("mouseover",i).on("mouseout",d),Y.selectAll("path.well").data(a).enter().append("path").attr("class","well").attr("d",function(t){return j(t.location)}).on("mouseover",l).on("mouseout",d),Y.selectAll("path.quake").data(c.features.filter(function(t){return+t.properties.mag>=2.5})).enter().append("path").attr("class","quake").attr("d",j).on("mouseover",s).on("mouseout",d),n(),p()}function e(){z.text(a(b.invert(d3.mouse(this)),2*y().scale*Math.PI)),c()}function a(t,e){var a=d3.format("."+Math.floor(Math.log(e)/2)+"f");return(t[1]<0?a(-t[1])+"\xb0S":a(t[1])+"\xb0N")+" "+(t[0]<0?a(-t[0])+"\xb0W":a(t[0])+"\xb0E")}function r(){M.selectAll("image").remove(),n()}function n(){function t(t){return url.indexOf("mqcdn")>-1?"http://otile"+["1","2","3","4"][0|4*Math.random()]+url+t[2]+"/"+t[0]+"/"+t[1]+".png":"http://"+["a","b","c"][0|3*Math.random()]+url+t[2]+"/"+t[0]+"/"+t[1]+".png"}var e=y.scale(A.scale()).translate(A.translate())();Y.attr("transform","translate("+A.translate()+")scale("+A.scale()/g+")").style("stroke-width",g/A.scale()),j.pointRadius(4.5*g/A.scale()),Y.selectAll("path.quake").attr("d",j),Y.selectAll("path.well").attr("d",function(t){return j(t.location)}),b.scale(A.scale()/2/Math.PI).translate(A.translate());var a;if(S.each(function(t,e){this.checked&&(a=e)}),url=h[a]){var r=M.attr("transform","scale("+e.scale+")translate("+e.translate+")").selectAll("image").data(e,function(t){return t});r.exit().remove(),r.enter().append("image").attr("xlink:href",t).attr("width",1).attr("height",1).attr("x",function(t){return t[0]}).attr("y",function(t){return t[1]})}}function l(t){var e=0,a=t.formationCodes[e],r=null==t[a].metadata?null:Object.keys(t[a].metadata),n=null==r?["No data"]:r.map(function(e){return e+": "+t[a].metadata[e]});L.html(n.join().replace(/,/g,"<br>")).style("visibility","visible").style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px"),d3.selectAll("path.well.active").classed("active",!1),d3.select(this).classed("active",!0)}function s(t){console.log("quakeTooltip:",t),"hidden"!=d3.select(this).style("visibility")&&(L[0][0].innerHTML=t.properties.title+" (earthquake)",L.style("visibility","visible"),L.style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px"))}function o(t){L[0][0].innerHTML=t.properties.NAME+" (basin)",L.style("visibility","visible"),L.style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px")}function i(t){var e=t.properties.Shale_Play+" (play)";L[0][0].innerHTML=e,L.style("visibility","visible"),L.style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px")}function c(){L.style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px")}function d(){L.style("visibility","hidden")}var p,u=function(t){return p=t,u},m=700,f=400,h=[".tiles.mapbox.com/v3/examples.map-i86nkdio/",".tiles.mapbox.com/v3/brunosan.map-cyglrrfu/",".mqcdn.com/tiles/1.0.0/map/",".mqcdn.com/tiles/1.0.0/sat/",".tile.thunderforest.com/landscape/",".tile.thunderforest.com/cycle/",".tile.stamen.com/terrain-background/",".tile.stamen.com/toner/",".tile.stamen.com/watercolor/",""],x=6.75,g=Math.pow(2,8+x),y=d3.geo.tile().size([m,f]),v=d3.geo.mercator().scale(g/2/Math.PI).translate([0,0]),b=d3.geo.mercator(),k=v([-98.75,35.5]),j=d3.geo.path().projection(v),A=d3.behavior.zoom().scale(2*v.scale()*Math.PI).scaleExtent([g,1<<23]).center([m/2,f/2]).translate([m/2-k[0],f/2-k[1]]).on("zoom",n),w=d3.select("body").append("div").attr("class","map").style("width",m+"px").style("height",f+"px").call(A).on("mousemove",e),q=w.append("svg").style("width",m+"px").style("height",f+"px"),M=q.append("g"),Y=q.append("g"),z=w.append("div").attr("class","info"),L=d3.select("body").append("div").attr("class","tooltip").style("pointer-events","none").style("visibility","hidden"),S=d3.selectAll("#myRadios input").on("change",r);return queue().defer(d3.json,"ok.json").defer(d3.json,"data.json").defer(d3.json,"shalegasplay.json").defer(d3.json,"quakes.json").await(t),u.tooltip=function(){d3.select("div.tooltip").remove(),L=d3.select("body").append("div").attr("class","tooltip").style("pointer-events","none").style("visibility","hidden")},u},d3.timeseries=function(){function t(l){function s(t,n,s){if(t)throw t;a=n,s.features=s.features.filter(function(t){return+t.properties.mag>=d}),r=s,e([]),l()}return arguments.length||(l=function(){console.log("Done initializing d3.timeseries")}),null!==d3.select("#wells").node()?a:(n=d3.select("body").append("svg").attr("id","timeseries").attr("width",o).attr("height",i),queue().defer(d3.json,"data.json").defer(d3.json,"quakes.json").await(s),t)}function e(t,e){var a={top:20,right:80,bottom:50,left:80},r=+n.attr("width")-a.left-a.right,o=+n.attr("height")/2-a.top-a.bottom,i=d3.extent(t.map(function(t){return t.y})),c=d3.scale.linear().domain(i).range([o,0]),d=d3.extent(t.map(function(t){return t.tbg}));d[1]=d3.max([d[1],e]);var p=d3.scale.linear().domain(d).range([o,0]),u=d3.svg.line().x(function(t){return s(t.x)}).y(function(t){return c(t.y)}),m=d3.svg.area().x(function(t){return s(t.x)}).y0(o).y1(function(t){return c(t.y)});l||(l=n.append("g").attr("id","myTimeSeries").attr("transform","translate("+a.left+","+(+n.attr("height")/2+a.top)+")"),l.append("g").attr("class","x axis").attr("transform","translate(0,"+o+")"),l.append("g").attr("class","y axis"),l.append("g").attr("class","p axis").attr("transform","translate("+r+", 0)"),l.append("text").attr("class","y label").attr("text-anchor","middle").attr("x",-o/2).attr("y",-8-a.left/3).attr("dy","-.75em").attr("transform","rotate(-90)").style("fill","steelblue").text("Injection Volume"),l.append("text").attr("class","y label").attr("text-anchor","end").attr("x",-8).attr("y",6).attr("dy",".75em").attr("transform","rotate(-90)").style("fill","steelblue").text("barrels/month"),l.append("text").attr("class","y label").attr("text-anchor","middle").attr("x",-o/2).attr("y",r+a.right).attr("dy","-.75em").attr("transform","rotate(-90)").style("fill","red").text("Tubing Pressure"),l.append("text").attr("class","p label").attr("text-anchor","end").attr("x",-8).attr("y",r-18).attr("dy",".75em").attr("transform","rotate(-90)").style("fill","red").text("PSI"),l.append("text").attr("class","maxp label").attr("text-anchor","end").attr("x",r).attr("y","0em").style("fill","red").style("font-size","0.7em"),l.append("text").attr("class","api-number").style("text-anchor","end").attr("x",r).attr("y","-2.2em").text("select a well (on map)"),l.append("text").attr("class","formation-code").style("text-anchor","end").attr("y","-1.2em").attr("x",r).text("")),"undefined"==typeof s&&(s=d3.time.scale().domain(d3.extent(t.map(function(t){return t.x}))).range([0,r]));var f=l,h=f.selectAll("path.injection-volume").data([t]);h.attr("d",u),h.enter().append("path").attr("class","injection-volume").attr("d",u),h.exit().remove();var x=f.selectAll("path.area").data([t]);x.enter().append("path").attr("class","area").style("fill-opacity",.8).style("fill","steelblue").attr("d",m),x.attr("d",m),x.exit().remove();var g=f.selectAll("path.pressure").data([t]);u.y(function(t){return p(t.tbg)}),g.enter().append("path").attr("class","pressure").attr("d",u),g.attr("d",u),g.exit().remove();var y=e?[{x:s.domain()[0],tbg:e},{x:s.domain()[1],tbg:e}]:[],v=f.selectAll("path.pressure-limit").data([y]);v.attr("d",u),v.enter().append("path").attr("class","pressure-limit").attr("d",u),v.exit().remove();var b=d3.select(".maxp.label").text("");e&&b.attr("y",p(e)-5).text("maximum pressure limit");var k=d3.svg.axis().scale(s).ticks(5).orient("bottom"),j=d3.svg.axis().scale(c).ticks(5).tickFormat(d3.format("s")).orient("left"),A=d3.svg.axis().scale(p).ticks(5).tickFormat(d3.format("s")).orient("right");f.selectAll("g.y.axis").call(j),f.selectAll("g.x.axis").call(k),f.selectAll("g.p.axis").call(A),f.selectAll(".y.axis text").style("fill","steelblue"),f.selectAll(".p.axis text").style("fill","red")}var a,r,n,l,s,o=360,i=500,c=d3.format(",.0f"),d=2.5;return t.plotem=function(){function r(t){function a(a){var r=t.formationCodes[a],n=t[r].ts.map(function(t){return{x:new Date(+t.year,+t.month-1),y:+t.vol,tbg:+t.tbg,csg:t.csg}}),l=+t[r].max_wat_inj_press,s=+t[r].max_inj_volume;e(n,l,s),d3.select(".api-number").text("API Number: "+t.api),d3.select(".formation-code").text("Formation code: "+r);var o=null==t[r].metadata?null:Object.keys(t[r].metadata);null==o?["No data"]:o.map(function(e){return e+": "+t[r].metadata[e]})}console.log("mousedWell",t.formationCodes,t);var r=0,n=t.formationCodes[r],l=null==t[n].metadata?null:Object.keys(t[n].metadata),s=null==l?["No data"]:l.map(function(e){return e+": "+t[n].metadata[e]});s="Formation codes: "+t.formationCodes.join().replace(/,/g,", ")+"<br>"+s.join().replace(/,/g,"<br>"),d3.select(".tooltip").html(s).style("visibility","visible").style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px"),d3.selectAll("path.well.active").classed("active",!1),d3.select(this).classed("active",!0),d3.select(this).on("click",function(){r=++r<t.formationCodes.length?r:0,console.log("clicked well, formationIndex:",r),a(r)}),a(0)}var l=n.selectAll(".formationLabel").data([c(a.length)+" wells"]);return l.enter().append("text").attr("class","formationLabel").attr("x",.7*o).attr("y",.1*i).style("font-size","20px").text(String),l.text(String),d3.selectAll("path.well").on("mouseover",r),t},t.plotQuakes=function(){var e=n.select("g").selectAll("path.quake").data(r.features);e.exit().remove(),e.attr("d",function(t){return path(t.values.location)}),e.enter().append("path").attr("class","quake").attr("d",path).on("mouseover",l);var a=n.selectAll(".quakesLabel").data([c(r.features.length)+" earthquakes"]);return a.enter().append("text").attr("class","quakesLabel").attr("x",.7*o).attr("y",.1*i).attr("dy","1.1em").style("font-size","20px").text(String),a.text(String),t;var l},t.plotQuakeSeries=function(){function e(){function t(t){return t.properties.time>e[0][0]&&t.properties.time<e[1][0]&&t.properties.mag>=e[0][1]&&t.properties.mag<=e[1][1]?1:0}var e=m.extent();m.empty()&&(e=a(e[0][0]),d3.selectAll(".brush").call(m.extent(e))),d3.selectAll("path.quake").style("pointer-events",function(e){return 1==t(e)?"all":"none"}).style("visibility",function(e){return 1==t(e)?"visible":"hidden"});var r=d3.selectAll("path.quake").filter(t)[0].length;d3.select(".quakesLabel").html(r+" earthquakes")}function a(t){var e,a;return a=new Date(t),a.setFullYear(t.getFullYear()+1),a=a<s.domain()[1]?a:s.domain()[1],e=new Date(a),e.setFullYear(a.getFullYear()-2),[[e,d.domain()[0]],[a,d.domain()[1]]]}var l={top:30,right:80,bottom:80,left:80},o=+n.attr("width")-l.left-l.right,i=+n.attr("height")/2-l.top-l.bottom,c=n.append("g").attr("transform","translate("+l.left+","+l.top+")");s=d3.time.scale().domain(d3.extent(r.features.map(function(t){return t.properties.time}))).range([0,o]);var d=d3.scale.linear().domain(d3.extent(r.features.map(function(t){return+t.properties.mag}))).range([i,0]),p=d3.svg.axis().scale(s).ticks(6).orient("bottom"),u=d3.svg.axis().scale(d).ticks(5).orient("left");c.append("text").attr("class","y label").attr("text-anchor","end").attr("x",-6).attr("y",6).attr("dy",".75em").attr("transform","rotate(-90)").text("magnitude"),c.append("text").attr("class","x label").attr("text-anchor","middle").attr("x",o/2).attr("y",-l.top/2).attr("dy","+.75em").text("Earthquakes");var m=d3.svg.brush().x(s).y(d).extent(a(s.domain()[1])).on("brush",e);return c.selectAll("circle.quake").data(r.features).enter().append("circle").attr("class","quake").attr("cx",function(t){return s(+t.properties.time)}).attr("cy",function(t){return d(+t.properties.mag)}).attr("r",3),c.append("g").attr("class","x axis").attr("transform","translate(0,"+i+")").call(p),c.append("g").attr("class","q axis").call(u),c.attr("class","brush").call(m),e(),t},t.quakes=function(e){return arguments.length?(r=e,t):r},t.wells=function(e){return arguments.length?(a=e,t):a},t},d3.geo.tile=function(){function t(){var t=Math.max(Math.log(a)/Math.LN2-8,0),l=Math.round(t+n),s=Math.pow(2,t-l+8),o=[(r[0]-a/2)/s,(r[1]-a/2)/s],i=[],c=d3.range(Math.max(0,Math.floor(-o[0])),Math.max(0,Math.ceil(e[0]/s-o[0]))),d=d3.range(Math.max(0,Math.floor(-o[1])),Math.max(0,Math.ceil(e[1]/s-o[1])));return d.forEach(function(t){c.forEach(function(e){i.push([e,t,l])})}),i.translate=o,i.scale=s,i}var e=[960,500],a=256,r=[e[0]/2,e[1]/2],n=0;return t.size=function(a){return arguments.length?(e=a,t):e},t.scale=function(e){return arguments.length?(a=e,t):a},t.translate=function(e){return arguments.length?(r=e,t):r},t.zoomDelta=function(e){return arguments.length?(n=+e,t):n},t};