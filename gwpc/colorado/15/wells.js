d3.wells=function(){function v(u){function a(e,s,o,a,p){console.log(o[0]),t=o,p.features=p.features.filter(function(e){return+e.properties.mag>=l}),f=p;var d=s.objects.co,v=topojson.merge(s,d.geometries),E=Object.keys(a.objects).map(function(e){return topojson.feature(a,a.objects[e])}),S=h.bounds(v),x=.95/Math.max((S[1][0]-S[0][0])/n,(S[1][1]-S[0][1])/r),T=[(n-x*(S[1][0]+S[0][0]))/2,(r-x*(S[1][1]+S[0][1]))/2];c.scale(x).translate(T);var N=i.append("g");N.append("path").datum(v).attr("class","state").attr("d",h),N.append("defs").append("clipPath").attr("id","state-clip").append("path").datum(v).attr("d",h),N.append("path").datum(topojson.mesh(s,d,function(e,t){return e!==t})).attr("class","county-border").attr("d",h),N.selectAll(".basin").data(E[0].features).enter().append("path").attr("class","basin").attr("clip-path","url(#state-clip)").attr("d",h).on("mouseover",m).on("mousemove",y).on("mouseout",b),N.selectAll(".play").data(E[1].features).enter().append("path").attr("class","play").classed("prospective",function(e){return e.properties.Current==="N"}).attr("clip-path","url(#state-clip)").attr("d",h).on("mouseover",g).on("mousemove",y).on("mouseout",b),w([]),u()}return arguments.length||(u=function(){console.log("Done initializing d3.wells")}),d3.select("#wells").node()!==null?v:(n=e[0],r=e[1],i=d3.select("body").append("svg").attr("width",n).attr("height",r),s=d3.select("body").append("svg").attr("width",960-n).attr("height",r),o=d3.select("body").append("div").attr("class","wellinfo").style("visibility","hidden").style("padding","5px").style("background-color","#ddd"),queue().defer(d3.json,"co.json").defer(d3.json,"data.json").defer(d3.json,"shalegasplay.json").defer(d3.json,"quakes.json").await(a),i.append("text").attr("x",.4*n).attr("y",.1*r).attr("dy","-1em").style("font-size","20px").text("Disposal Wells"),v)}function m(e){p[0][0].innerHTML=e.properties.NAME+" Basin",p.style("visibility","visible"),p.style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px")}function g(e){var t=e.properties.Shale_Play+" Play";e.properties.Current==="Y"&&(t+=" (current)"),e.properties.Current==="N"&&(t+=" (prospective)"),p[0][0].innerHTML=t,p.style("visibility","visible"),p.style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px")}function y(e){p.style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px")}function b(e){p.style("visibility","hidden")}function w(e){var t={top:10,right:20,bottom:50,left:80},n=+s.attr("width")-t.left-t.right,r=+s.attr("height")/2-t.top-t.bottom;d3.select("#myTimeSeries").remove();var i=s.append("g").attr("id","myTimeSeries").attr("transform","translate("+t.left+","+(+s.attr("height")/2+t.top)+")");typeof a=="undefined"&&(a=d3.time.scale().domain(d3.extent(e.map(function(e){return e.x}))).range([0,n]));var o=d3.scale.linear().domain([0,35e4]).range([r,0]),u=d3.svg.axis().scale(a).ticks(5).orient("bottom"),f=d3.svg.axis().scale(o).ticks(5).orient("left"),l=d3.svg.line().x(function(e){return a(e.x)}).y(function(e){return o(e.y)}),c=d3.svg.area().x(function(e){return a(e.x)}).y0(r).y1(function(e){return o(e.y)});i.selectAll("path.line").data([e]).enter().append("path").attr("class","line").attr("d",l),i.selectAll("path.area").data([e]).enter().append("path").attr("class","area").style("fill","steelblue").attr("d",c),i.append("g").attr("class","x axis").attr("transform","translate(0,"+r+")").call(u),i.append("g").attr("class","y axis").call(f),i.append("text").attr("class","y label").attr("text-anchor","end").attr("x",-6).attr("y",6).attr("dy",".75em").attr("transform","rotate(-90)").text("barrels/month"),i.append("text").attr("class","x label").attr("text-anchor","middle").attr("x",n/2).attr("y",-t.top).text("Injection Volume"),i.append("text").attr("class","api-number").style("text-anchor","end").attr("x",n).attr("dy","+1em").text("select a well (on map)"),i.append("text").attr("class","formation-code").style("text-anchor","end").attr("x",n).attr("dy","+2.2em").text("")}var e=[550,500],t,n,r,i,s,o,u=d3.format(",.0f"),a,f,l=2.5,c=d3.geo.albers().scale(1).translate([0,0]),h=d3.geo.path().pointRadius(5).projection(c),p=d3.select("body").append("div").attr("class","tooltip").style("visibility","hidden"),d=d3.select("body").append("div").attr("class","welltip").style("visibility","hidden");return v.plotem=function(){function a(e,t){console.log("moused",e),i.selectAll("path.well").classed("active",!1),d3.select(this).classed("active",!0),values=e.data.map(function(e){return{x:new Date(+e.year,+e.month-1),y:+e.vol}}),console.log("values.length before",values.length),values=values.filter(function(e){return!isNaN(e.y)}),console.log("values.length after",values.length),w(values),d3.select(".api-number").text("API Number: "+e.api),console.log("d.metadata",e.metadata);var n=e.metadata==null?null:Object.keys(e.metadata),r=n==null?["No data"]:n.map(function(t){return t+": "+e.metadata[t]});o.style("visibility","visible").html(r.join().replace(/,/g,"<br>"))}var e=i.selectAll(".formationLabel").data([u(t.length)+" wells"]);e.enter().append("text").attr("class","formationLabel").attr("x",.7*n).attr("y",.1*r).style("font-size","20px").text(String),e.text(String);var s=i.selectAll("path.well").data(t);return s.exit().remove(),s.attr("d",function(e){return h(e.location)}),s.enter().append("path").attr("class","well").attr("d",function(e){return h(e.location)}).on("mouseover",a),v},v.plotQuakes=function(){var e,t=i.selectAll("path.quake").data(f.features);t.exit().remove(),t.attr("d",function(e){return h(e.values.location)}),t.enter().append("path").attr("class","quake").attr("d",h).on("mouseover",e);var s=i.selectAll(".quakesLabel").data([u(f.features.length)+" earthquakes"]);return s.enter().append("text").attr("class","quakesLabel").attr("x",.7*n).attr("y",.1*r).attr("dy","1.1em").style("font-size","20px").text(String),s.text(String),v},v.plotQuakeSeries=function(){function c(){function n(t){return t.properties.time>e[0][0]&&t.properties.time<e[1][0]&&t.properties.mag>=e[0][1]&&t.properties.mag<=e[1][1]?1:0}var e=l.extent();l.empty()&&(e=h(e[0][0]),d3.selectAll(".brush").call(l.extent(e))),d3.selectAll("path.quake").style("visibility",function(e){return n(e)==1?"visible":"hidden"});var t=d3.selectAll("path.quake").filter(n)[0].length;d3.select(".quakesLabel").html(t+" earthquakes")}function h(e){var t,n;return n=new Date(e),n.setFullYear(e.getFullYear()+1),n=n<a.domain()[1]?n:a.domain()[1],t=new Date(n),t.setFullYear(n.getFullYear()-2),[[t,i.domain()[0]],[n,i.domain()[1]]]}var e={top:30,right:20,bottom:80,left:80},t=+s.attr("width")-e.left-e.right,n=+s.attr("height")/2-e.top-e.bottom,r=s.append("g").attr("transform","translate("+e.left+","+e.top+")");a=d3.time.scale().domain(d3.extent(f.features.map(function(e){return e.properties.time}))).range([0,t]);var i=d3.scale.linear().domain(d3.extent(f.features.map(function(e){return+e.properties.mag}))).range([n,0]),o=d3.svg.axis().scale(a).ticks(6).orient("bottom"),u=d3.svg.axis().scale(i).ticks(5).orient("left");r.append("text").attr("class","y label").attr("text-anchor","end").attr("x",-6).attr("y",6).attr("dy",".75em").attr("transform","rotate(-90)").text("magnitude"),r.append("text").attr("class","x label").attr("text-anchor","middle").attr("x",t/2).attr("y",-e.top/2).attr("dy","+.75em").text("Earthquakes");var l=d3.svg.brush().x(a).y(i).extent(h(a.domain()[1])).on("brush",c);return r.selectAll("circle.quake-series").data(f.features).enter().append("circle").attr("class","quake-series").attr("cx",function(e){return a(+e.properties.time)}).attr("cy",function(e){return i(+e.properties.mag)}).attr("r",3),r.append("g").attr("class","x axis").attr("transform","translate(0,"+n+")").call(o),r.append("g").attr("class","y axis").call(u),r.attr("class","brush").call(l),c(),v},v.size=function(t){return arguments.length?(e=t,v):e},v.data=function(e){return arguments.length?(t=e,v):t},v}