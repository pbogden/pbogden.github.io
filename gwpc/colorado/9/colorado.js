d3.colorado=function(){function h(){return d3.select("#colorado").node()!==null?h:(r=e[0],i=e[1],o=d3.behavior.zoom().scaleExtent([.4,10]).on("zoom",v),s=d3.select("body").append("div").attr("id","colorado").append("svg").attr("width",r).attr("height",i).style("stroke-width",1).call(o),s=s.append("g"),s.append("g").attr("class","voronoi"),s.append("g").attr("class","well-clip"),s.append("g").attr("class","well-location"),d3.select("#colorado").select("svg").append("g").attr("class","color-scale"),s.append("g").append("circle").attr("id","well-dot").attr("cx",null).attr("cy",null).attr("r",f),s.append("g").append("circle").attr("id","well-highlight").style("stroke","none").style("stroke-opacity",.5).style("stroke-width",8).style("fill","none").style("pointer-events","none").attr("cx",null).attr("cy",null).attr("r",5),l.scale(1).translate([0,0]),d3.json("co.json",function(e,t){var n=t.objects.co,o=topojson.merge(t,n.geometries),u=c.bounds(o),a=.95/Math.max((u[1][0]-u[0][0])/r,(u[1][1]-u[0][1])/i),f=[(r-a*(u[1][0]+u[0][0]))/2,(i-a*(u[1][1]+u[0][1]))/2];a=12490,f=[1783,541],l.scale(a).translate(f),s.append("path").datum(o).attr("class","state").attr("d",c),s.append("path").datum(topojson.mesh(t,n,function(e,t){return e!==t})).attr("class","county-border").attr("d",c)}),h)}function p(){var e=d3.select("#colorado").select(".color-scale"),t=20,n=2*t,r=.66*i,s=e.selectAll(".colors").data(a.range());s.exit().remove(),s.enter().append("rect").attr("class","colors").attr("width",t).attr("height",t).style("stroke","#666").style("stroke-width","1px"),s.attr("x",n).attr("y",function(e,n){return r-n*t}).style("fill",function(e){return e});var o=e.selectAll(".color-labels").data(a.domain());o.exit().remove(),o.enter().append("text").attr("class","color-labels").attr("dx","1em").attr("dy","1em").attr("font-size","14px"),o.attr("x",n+t).attr("y",function(e,n){return r-n*t}).text(function(e){return e==-9?"no data":e})}function d(e,t){return typeof e=="undefined"&&console.log("bad polygon for i = ",t,e),typeof e=="undefined"&&console.log(),typeof e!="undefined"?"M"+e.join("L")+"Z":null}function v(){s.attr("transform","translate("+d3.event.translate+")scale("+d3.event.scale+")")}var e=[600,500],t,n=d3.format(",.0f"),r,i,s,o,u,a,f=1,l=d3.geo.albers(),c=d3.geo.path().pointRadius(2).projection(l);return h.clear=function(){return d3.select("#colorado").remove(),h},h.plotem=function(){return s.selectAll("path.circle").remove(),s.selectAll("path.circle").data(t.map(function(e){return e.location})).enter().append("path").attr("class","circle").style("fill","steelblue").style("stroke","black").attr("d",c),s.call(o.event),h},h.voronoi=function(){function g(e,n){var r=t[n],i=Object.getOwnPropertyNames(r),s=i.map(function(e){return e==="location"?"location: "+r.location.coordinates+"<br>":e==="more_information"?"more_information: <a href='"+r.more_information+"'>link</a><br>":e+": "+r[e]+"<br>"});d3.select("#well-info").html(s.join(""))}d3.select("#well-info").html(" "),s.select("#well-dot").style("fill","none"),s.select("#well-highlight").style("stroke","none");var e=t.map(function(e){return d3.merge([l(e.location.coordinates),[e.value]])}),n=d3.extent(e,function(e){return e[0]}),r=d3.extent(e,function(e){return e[1]}),i=d3.geom.voronoi().clipExtent([[n[0]-20,r[0]-20],[n[1]+20,r[1]+20]]),u=e.map(function(e){return+e[2]});u=u.sort(d3.descending);var c=d3.extent(u);console.log("range before",c),c=d3.extent(u.filter(function(e,t,n){return t>5&&t<n.length-5})),console.log("range after",c),a=d3.scale.linear().domain(c).nice();var h=a.domain();h=d3.merge([[h[0]-500],h,[h[1]+500]]),a.domain(h).range(["blue","yellow","red","green"]);var v=s.select(".well-clip").selectAll("clipPath").data(e);v.exit().remove(),v.enter().append("clipPath").attr("id",function(e,t){return"clip-"+t}).append("circle").attr("r",20),v.select("circle").attr("cx",function(e){return e[0]}).attr("cy",function(e){return e[1]});var m=s.select(".voronoi").selectAll("path").data(i(e));m.exit().remove(),m.enter().append("path"),m.attr("clip-path",function(e,t){return"url(#clip-"+t+")"}).style("fill",function(t,n){return a(e[n][2])}).attr("d",d).on("mouseover",function(t,n){var r=s.select(".well-location #well-"+n);s.select("#well-dot").attr("cx",r.attr("cx")).attr("cy",r.attr("cy")).style("fill",a(e[n][2])),s.select("#well-highlight").style("stroke","black").attr("cx",r.attr("cx")).attr("cy",r.attr("cy")),g(t,n)});var y=s.select(".well-location").selectAll("circle").data(e);y.exit().remove(),y.enter().append("circle").style("fill","black").attr("r",f),y.attr("id",function(e,t){return"well-"+t}).attr("cx",function(e){return e[0]}).attr("cy",function(e){return e[1]}),p(),s.call(o.event)},h.size=function(t){return arguments.length?(e=t,h):e},h.data=function(e){return arguments.length?(t=e,h):t},h}