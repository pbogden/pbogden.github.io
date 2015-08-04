function ready(t,e,o){if(t)return console.error(t);features=Object.keys(e.objects).map(function(t){return topojson.feature(e,e.objects[t])}),svg.selectAll("path").data(topojson.feature(o,o.objects.us).features).enter().append("path").attr("d",function(t){return"United States of America"==t.properties.admin?path(t):null}).style("fill","lightgray").style("stroke","black").style("stroke-width","1px").on("click",clicked),svg.selectAll(".basin").data(features[0].features).enter().append("path").attr("class","basin").attr("d",path).on("mouseover",basinTooltip).on("mousemove",moveTooltip).on("mouseout",hideTooltip),svg.selectAll(".play").data(features[1].features).enter().append("path").attr("class","play").classed("prospective",function(t){return"N"===t.properties.Current}).attr("d",path).on("mouseover",playTooltip).on("mousemove",moveTooltip).on("mouseout",hideTooltip);var a="http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson",i=d3.scale.linear().domain([2.5,7]).range([0,15]);path.pointRadius(function(t){return i(+t.properties.mag)}),d3.json(a,function(t,e){t&&console.log(t),svg.selectAll("path.quake").data(e.features).enter().append("path").attr("class","quake").attr("fill","crimson").attr("fill-opacity",.5).attr("d",path)})}function basinTooltip(t){tooltip[0][0].innerHTML=t.properties.NAME+" Basin",tooltip.style("visibility","visible"),tooltip.style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px")}function playTooltip(t){var e=t.properties.Shale_Play+" Play";"Y"===t.properties.Current&&(e+=" (current)"),"N"===t.properties.Current&&(e+=" (prospective)"),tooltip[0][0].innerHTML=e,tooltip.style("visibility","visible"),tooltip.style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px")}function moveTooltip(){tooltip.style("top",d3.event.pageY-10+"px").style("left",d3.event.pageX+20+"px")}function hideTooltip(){tooltip.style("visibility","hidden")}function clicked(t){var e,o,a;if(t&&centered!==t){var i=path.centroid(t);e=i[0],o=i[1],a=4,centered=t}else e=width/2,o=height/2,a=1,centered=null;svg.selectAll("path").classed("active",centered&&function(t){return t===centered}),svg.transition().duration(750).attr("transform","translate("+width/2+","+height/2+")scale("+a+")translate("+-e+","+-o+")").style("stroke-width",1.5/a+"px")}var width=960,height=500,centered,svg=d3.select("body").append("svg").attr("width",width).attr("height",height).append("g"),path=d3.geo.path(),tooltip=d3.select("body").append("div").attr("class","tooltip").style("visibility","hidden").text("a simple tooltip");queue().defer(d3.json,"shalegas.json").defer(d3.json,"us.json").await(ready);