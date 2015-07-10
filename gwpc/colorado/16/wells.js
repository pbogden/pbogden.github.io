d3.wells=function(){function b(n){function r(e,r,i,s,u){if(e)throw e;t=i,u.features=u.features.filter(function(e){return+e.properties.mag>=v}),d=u;var a=r.objects.co,f=topojson.merge(r,a.geometries),l=Object.keys(s.objects).map(function(e){return topojson.feature(s,s.objects[e])}),c=o.append("g");c.append("path").datum(f).attr("class","state").attr("d",g).on("click",w),c.append("defs").append("clipPath").attr("id","state-clip").append("path").datum(f).attr("d",g),c.append("path").datum(topojson.mesh(r,a,function(e,t){return e!==t})).attr("class","county-border").attr("d",g).on("click",w),c.selectAll(".basin").data(l[0].features).enter().append("path").attr("class","basin").attr("clip-path","url(#state-clip)").attr("d",g).on("mouseover",E).on("mousemove",x).on("mouseout",T).on("click",w),c.selectAll(".play").data(l[1].features).enter().append("path").attr("class","play").classed("prospective",function(e){return e.properties.Current==="N"}).attr("clip-path","url(#state-clip)").attr("d",g).on("mouseover",S).on("mousemove",x).on("mouseout",T).on("click",w),N([]),n()}return arguments.length||(n=function(){console.log("Done initializing d3.wells")}),d3.select("#wells").node()!==null?b:(i=e[0],s=e[1],o=d3.select("body").append("svg").attr("width",i).attr("height",s),u=d3.select("body").append("svg").attr("width",960-i).attr("height",s),f=d3.select("body").append("div").attr("class","wellinfo").style("visibility","hidden").style("padding","5px").style("background-color","#ddd"),queue().defer(d3.json,"co.json").defer(d3.json,"data.json").defer(d3.json,"shalegasplay.json").defer(d3.json,"quakes.json").await(r),o.append("text").attr("x",.4*i).attr("y",.1*s).attr("dy","-1em").style("font-size","20px").text("Disposal Wells"),b)}function w(e){var t,n,r;h?(t=i/2,n=s/2,r=1,h=!1):(t=d3.event.pageX,n=d3.event.pageY,r=6,h=!0),o.select("g").transition().duration(750).attr("transform","translate("+i/2+","+s/2+") scale("+r+") translate("+ -t+","+ -n+")").style("stroke-width",1/r+"px"),g.pointRadius(p/r),o.select("g").selectAll("path.well").transition().duration(750).attr("d",function(e){return g(e.location)}),o.select("g").selectAll("path.quake").transition().duration(750).attr("d",g)}function E(e){y[0][0].innerHTML=e.properties.NAME+" Basin",y.style("visibility","visible"),y.style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px")}function S(e){var t=e.properties.Shale_Play+" Play";e.properties.Current==="Y"&&(t+=" (current)"),e.properties.Current==="N"&&(t+=" (prospective)"),y[0][0].innerHTML=t,y.style("visibility","visible"),y.style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px")}function x(e){y.style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px")}function T(e){y.style("visibility","hidden")}function N(e,t,n){var r={top:20,right:80,bottom:50,left:80},i=+u.attr("width")-r.left-r.right,s=+u.attr("height")/2-r.top-r.bottom,o=d3.extent(e.map(function(e){return e.y})),f=d3.scale.linear().domain(o).range([s,0]),l=d3.extent(e.map(function(e){return e.tbg}));l[1]=d3.max([l[1],t]);var h=d3.scale.linear().domain(l).range([s,0]),p=d3.svg.line().x(function(e){return c(e.x)}).y(function(e){return f(e.y)}),d=d3.svg.area().x(function(e){return c(e.x)}).y0(s).y1(function(e){return f(e.y)});a||(a=u.append("g").attr("id","myTimeSeries").attr("transform","translate("+r.left+","+(+u.attr("height")/2+r.top)+")"),a.append("g").attr("class","x axis").attr("transform","translate(0,"+s+")"),a.append("g").attr("class","y axis"),a.append("g").attr("class","p axis").attr("transform","translate("+i+", 0)"),a.append("text").attr("class","y label").attr("text-anchor","middle").attr("x",-s/2).attr("y",-8-r.left/3).attr("dy","-.75em").attr("transform","rotate(-90)").style("fill","steelblue").text("Injection Volume"),a.append("text").attr("class","y label").attr("text-anchor","end").attr("x",-8).attr("y",6).attr("dy",".75em").attr("transform","rotate(-90)").style("fill","steelblue").text("barrels/month"),a.append("text").attr("class","y label").attr("text-anchor","middle").attr("x",-s/2).attr("y",i+r.right).attr("dy","-.75em").attr("transform","rotate(-90)").style("fill","red").text("Tubing Pressure"),a.append("text").attr("class","p label").attr("text-anchor","end").attr("x",-8).attr("y",i-18).attr("dy",".75em").attr("transform","rotate(-90)").style("fill","red").text("PSI"),a.append("text").attr("class","maxp label").attr("text-anchor","end").attr("x",i).attr("y","0em").style("fill","red").style("font-size","0.7em"),a.append("text").attr("class","api-number").style("text-anchor","end").attr("x",i).attr("y","-2.2em").text("select a well (on map)"),a.append("text").attr("class","formation-code").style("text-anchor","end").attr("y","-1.2em").attr("x",i).text("")),typeof c=="undefined"&&(c=d3.time.scale().domain(d3.extent(e.map(function(e){return e.x}))).range([0,i]));var v=a,m=v.selectAll("path.line").data([e]);m.attr("d",p),m.enter().append("path").attr("class","line").attr("d",p),m.exit().remove();var g=v.selectAll("path.area").data([e]);g.enter().append("path").attr("class","area").style("fill-opacity",.8).style("fill","steelblue").attr("d",d),g.attr("d",d),g.exit().remove(),p.y(function(e){return 5+f(e.y)});var y=n?[{x:c.domain()[0],y:n},{x:c.domain()[1],y:n}]:[],b=v.selectAll("path.volume-limit").data([y]);b.attr("d",p),b.enter().append("path").attr("class","volume-limit").attr("d",p),b.exit().remove();var w=v.selectAll("path.pressure").data([e]);p.y(function(e){return h(e.tbg)}),w.enter().append("path").attr("class","pressure").attr("d",p),w.attr("d",p),w.exit().remove();var y=t?[{x:c.domain()[0],tbg:t},{x:c.domain()[1],tbg:t}]:[],E=v.selectAll("path.pressure-limit").data([y]);E.attr("d",p),E.enter().append("path").attr("class","pressure-limit").attr("d",p),E.exit().remove();var S=d3.select(".maxp.label").text("");t&&S.attr("y",h(t)-5).text("maximum pressure limit");var x=d3.svg.axis().scale(c).ticks(5).orient("bottom"),T=d3.svg.axis().scale(f).ticks(5).tickFormat(d3.format("s")).orient("left"),N=d3.svg.axis().scale(h).ticks(5).tickFormat(d3.format("s")).orient("right");v.selectAll("g.y.axis").call(T),v.selectAll("g.x.axis").call(x),v.selectAll("g.p.axis").call(N),v.selectAll(".y.axis text").style("fill","steelblue"),v.selectAll(".p.axis text").style("fill","red")}var e=[550,500],t,n=5198,r=[905,314],i,s,o,u,a,f,l=d3.format(",.0f"),c,h,p=4,d,v=2.5,m=d3.geo.albers().scale(n).translate(r),g=d3.geo.path().pointRadius(p).projection(m),y=d3.select("body").append("div").attr("class","tooltip").style("pointer-events","none").style("visibility","hidden");return b.plotem=function(){function r(e){function n(t){var n=e.formationCodes[t],r=e[n].ts.map(function(e){return{x:new Date(+e.year,+e.month-1),y:+e.vol,tbg:+e.tbg,csg:e.csg}}),i=+e[n].max_wat_inj_press,s=+e[n].max_inj_volume;N(r,i,s),d3.select(".api-number").text("API Number: "+e.api),d3.select(".formation-code").text("Formation code: "+n);var o=e[n].metadata==null?null:Object.keys(e[n].metadata),u=o==null?["No data"]:o.map(function(t){return t+": "+e[n].metadata[t]});f.style("visibility","visible").html(u.join().replace(/,/g,"<br>"))}console.log("mousedWell",e.formationCodes,e);var t=0;o.selectAll("path.well").classed("active",!1),d3.select(this).classed("active",!0),d3.select(this).on("click",function(){t++,t=t<e.formationCodes.length?t:0,console.log("clicked well, formationIndex:",t),n(t)}),n(0)}var e=o.selectAll(".formationLabel").data([l(t.length)+" wells"]);e.enter().append("text").attr("class","formationLabel").attr("x",.7*i).attr("y",.1*s).style("font-size","20px").text(String),e.text(String);var n=o.select("g").selectAll("path.well").data(t);return n.exit().remove(),n.attr("d",function(e){return g(e.location)}),n.enter().append("path").attr("class","well").attr("d",function(e){return g(e.location)}).on("mouseover",r),b},b.plotQuakes=function(){var e=o.select("g").selectAll("path.quake").data(d.features);e.exit().remove(),e.attr("d",function(e){return g(e.values.location)}),e.enter().append("path").attr("class","quake").attr("d",g).on("mouseover",n);var t=o.selectAll(".quakesLabel").data([l(d.features.length)+" earthquakes"]);t.enter().append("text").attr("class","quakesLabel").attr("x",.7*i).attr("y",.1*s).attr("dy","1.1em").style("font-size","20px").text(String),t.text(String);return b;var n},b.plotQuakeSeries=function(){function f(){function n(t){return t.properties.time>e[0][0]&&t.properties.time<e[1][0]&&t.properties.mag>=e[0][1]&&t.properties.mag<=e[1][1]?1:0}var e=a.extent();a.empty()&&(e=l(e[0][0]),d3.selectAll(".brush").call(a.extent(e))),d3.selectAll("path.quake").style("visibility",function(e){return n(e)==1?"visible":"hidden"});var t=d3.selectAll("path.quake").filter(n)[0].length;d3.select(".quakesLabel").html(t+" earthquakes")}function l(e){var t,n;return n=new Date(e),n.setFullYear(e.getFullYear()+1),n=n<c.domain()[1]?n:c.domain()[1],t=new Date(n),t.setFullYear(n.getFullYear()-2),[[t,i.domain()[0]],[n,i.domain()[1]]]}var e={top:30,right:80,bottom:80,left:80},t=+u.attr("width")-e.left-e.right,n=+u.attr("height")/2-e.top-e.bottom,r=u.append("g").attr("transform","translate("+e.left+","+e.top+")");c=d3.time.scale().domain(d3.extent(d.features.map(function(e){return e.properties.time}))).range([0,t]);var i=d3.scale.linear().domain(d3.extent(d.features.map(function(e){return+e.properties.mag}))).range([n,0]),s=d3.svg.axis().scale(c).ticks(6).orient("bottom"),o=d3.svg.axis().scale(i).ticks(5).orient("left");r.append("text").attr("class","y label").attr("text-anchor","end").attr("x",-6).attr("y",6).attr("dy",".75em").attr("transform","rotate(-90)").text("magnitude"),r.append("text").attr("class","x label").attr("text-anchor","middle").attr("x",t/2).attr("y",-e.top/2).attr("dy","+.75em").text("Earthquakes");var a=d3.svg.brush().x(c).y(i).extent(l(c.domain()[1])).on("brush",f);return r.selectAll("circle.quake-series").data(d.features).enter().append("circle").attr("class","quake-series").attr("cx",function(e){return c(+e.properties.time)}).attr("cy",function(e){return i(+e.properties.mag)}).attr("r",3),r.append("g").attr("class","x axis").attr("transform","translate(0,"+n+")").call(s),r.append("g").attr("class","q axis").call(o),r.attr("class","brush").call(a),f(),b},b.size=function(t){return arguments.length?(e=t,b):e},b.data=function(e){return arguments.length?(t=e,b):t},b}
