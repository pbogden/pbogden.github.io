function mousemoved(){info.text(formatLocation(projection.invert(d3.mouse(this)),tiler().scale*2*Math.PI))}function matrix3d(e,t){var n=e/256,r=e%1?Number:Math.round;return"matrix3d("+[n,0,0,0,0,n,0,0,0,0,n,0,r(t[0]*e),r(t[1]*e),0,1]+")"}function prefixMatch(e){var t=-1,n=e.length,r=document.body.style;while(++t<n)if(e[t]+"Transform"in r)return"-"+e[t].toLowerCase()+"-";return""}function formatLocation(e,t){var n=d3.format("."+Math.floor(Math.log(t)/2)+"f");return(e[1]<0?n(-e[1])+"°S":n(e[1])+"°N")+" "+(e[0]<0?n(-e[0])+"°W":n(e[0])+"°E")}function changed(){layer.selectAll(".tile").remove(),zoomed()}function checked(){vectors.style("visibility",this.checked?"visible":"hidden")}function zoomed(){function i(e){var t=urls[r];return t.indexOf("mqcdn")>-1?"http://otile"+["1","2","3","4"][Math.random()*4|0]+t+e[2]+"/"+e[0]+"/"+e[1]+".png":"http://"+["a","b","c"][Math.random()*3|0]+t+e[2]+"/"+e[0]+"/"+e[1]+".png"}var e=tiler.scale(zoom.scale()).translate(zoom.translate())(),t=layer.style(prefix+"transform",matrix3d(e.scale,e.translate)).selectAll(".tile").data(e,function(e){return e});projection.scale(zoom.scale()/2/Math.PI).translate(zoom.translate()),d3.select("#myCheckbox").style("visibility",function(){return e[0][2]>=10?"visible":"hidden"});var n=vectors.style(prefix+"transform",matrix3d(e.scale,e.translate)).selectAll(".tile").data(e,function(e){return e});n.exit().each(function(e){this._xhr.abort()}).remove(),n.enter().append("svg").attr("class","tile").style("left",function(e){return e[0]*256+"px"}).style("top",function(e){return e[1]*256+"px"}).each(function(e,t){var n=d3.select(this);this._xhr=d3.json("http://"+["a","b","c"][(e[0]*31+e[1])%3]+".tile.openstreetmap.us/vectiles-highroad/"+e[2]+"/"+e[0]+"/"+e[1]+".json",function(t,r){t&&console.log("can't get vector tile for",e[2]);var i=Math.pow(2,e[2])*256;tilePath.projection().translate([i/2-e[0]*256,i/2-e[1]*256]).scale(i/2/Math.PI),n.selectAll("path").data(r.features.sort(function(e,t){return e.properties.sort_key-t.properties.sort_key})).enter().append("path").attr("class",function(e){return e.properties.kind}).attr("d",tilePath),n.append("path").datum(state).attr("class","state").attr("d",tilePath),n.append("path").datum(counties).attr("class","county").attr("d",tilePath)})});var r;myRadios.each(function(e,t){this.checked&&(r=t)}),url=urls[r];if(!url)return;t.enter().append("img").attr("class","tile").style("left",function(e){return(e[0]<<8)+"px"}).style("top",function(e){return(e[1]<<8)+"px"}).attr("src",i),t.exit().remove()}function clicked(e){console.log("Clicked"),d3.select("#myCheckbox").style("visibility","visible");if(projection.scale()>=4e4){console.log("Clicked returning early");return}projection.scale(1).translate([0,0]);var t=path.bounds(e),n=Math.max(.95/Math.max((t[1][0]-t[0][0])/width,(t[1][1]-t[0][1])/height),4e4),r=[(width-n*(t[1][0]+t[0][0]))/2,(height-n*(t[1][1]+t[0][1]))/2];projection.scale(n).translate(r),zoom.scale(n).translate(r)}var width=700,height=500,prefix=prefixMatch(["webkit","ms","Moz","O"]),urls=[".tiles.mapbox.com/v3/examples.map-i86nkdio/",".tiles.mapbox.com/v3/brunosan.map-cyglrrfu/",".mqcdn.com/tiles/1.0.0/map/",".mqcdn.com/tiles/1.0.0/sat/",".tile.thunderforest.com/landscape/",".tile.thunderforest.com/cycle/",".tile.stamen.com/terrain-background/",".tile.stamen.com/toner/",".tile.stamen.com/watercolor/",""],osm=".tile.openstreetmap.us/vectiles-highroad/",state,counties,tiler=d3.geo.tile().size([width,height]),projection=d3.geo.mercator().scale(16384/Math.PI).translate([-width/2,-height/2]),tileProjection=d3.geo.mercator(),tilePath=d3.geo.path().projection(tileProjection),path=d3.geo.path().projection(projection),zoom=d3.behavior.zoom().scale(projection.scale()*2*Math.PI).scaleExtent([32768,1<<20]).translate(projection([-105.5,39]).map(function(e){return-e})).on("zoom",zoomed),map=d3.select("body").append("div").attr("class","map").style("width",width+"px").style("height",height+"px").call(zoom).on("mousemove",mousemoved),layer=map.append("div").attr("class","layer"),vectors=map.append("div").attr("class","layer"),info=map.append("div").attr("class","info"),myRadios=d3.selectAll("#myRadios input").on("change",changed),myCheckbox=d3.selectAll("#myCheckbox input").on("change",checked);d3.json("https://gist.githubusercontent.com/pbogden/48418ad20456b251e5a8/raw/co.json",function(e,t){e&&console.log(e),state=topojson.merge(t,t.objects.co.geometries),counties=topojson.mesh(t,t.objects.co,function(e,t){return e!==t}),zoomed()})