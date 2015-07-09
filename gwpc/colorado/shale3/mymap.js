function ready(e,t,n){if(e)return console.error(e);features=Object.keys(t.objects).map(function(e){return topojson.feature(t,t.objects[e])}),svg.selectAll("path").data(topojson.feature(n,n.objects.us).features).enter().append("path").attr("d",function(e){return e.properties.admin=="United States of America"?path(e):null}).style("fill","lightgray").style("stroke","black").style("stroke-width","1px").on("click",clicked),svg.selectAll(".basin").data(features[0].features).enter().append("path").attr("class","basin").attr("d",path).on("mouseover",basinTooltip).on("mousemove",moveTooltip).on("mouseout",hideTooltip),svg.selectAll(".play").data(features[1].features).enter().append("path").attr("class","play").classed("prospective",function(e){return e.properties.Current==="N"}).attr("d",path).on("mouseover",playTooltip).on("mousemove",moveTooltip).on("mouseout",hideTooltip);var r="http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson",i=d3.scale.linear().domain([2.5,7]).range([0,15]);path.pointRadius(function(e){return i(+e.properties.mag)}),d3.json(r,function(e,t){e&&console.log(e),svg.selectAll("path.quake").data(t.features).enter().append("path").attr("class","quake").attr("fill","crimson").attr("fill-opacity",.5).attr("d",path)})}function basinTooltip(e){tooltip[0][0].innerHTML=e.properties.NAME+" Basin",tooltip.style("visibility","visible"),tooltip.style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px")}function playTooltip(e){var t=e.properties.Shale_Play+" Play";e.properties.Current==="Y"&&(t+=" (current)"),e.properties.Current==="N"&&(t+=" (prospective)"),tooltip[0][0].innerHTML=t,tooltip.style("visibility","visible"),tooltip.style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px")}function moveTooltip(e){tooltip.style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px")}function hideTooltip(e){tooltip.style("visibility","hidden")}function clicked(e){var t,n,r;if(e&&centered!==e){var i=path.centroid(e);t=i[0],n=i[1],r=4,centered=e}else t=width/2,n=height/2,r=1,centered=null;svg.selectAll("path").classed("active",centered&&function(e){return e===centered}),svg.transition().duration(750).attr("transform","translate("+width/2+","+height/2+")scale("+r+")translate("+ -t+","+ -n+")").style("stroke-width",1.5/r+"px")}var width=960,height=500,centered,svg=d3.select("body").append("svg").attr("width",width).attr("height",height).append("g"),path=d3.geo.path(),tooltip=d3.select("body").append("div").attr("class","tooltip").style("visibility","hidden").text("a simple tooltip");queue().defer(d3.json,"shalegas.json").defer(d3.json,"us.json").await(ready)