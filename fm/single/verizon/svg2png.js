
function svg2png() {
  // Serialize the SVG to a String
  var svgString = new XMLSerializer().serializeToString( svg.node() );

  // Convert SVG to a Blob
  var svgBlob = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});

  // Convert Blob to an Object URL
  var svgURL = URL.createObjectURL(svgBlob);

  // Load the SVG URL in an image
  // Then draw the image on a canvas
  // Then save the canvas (i.e., the SVG) as a PNG
  var img = new Image();
  img.onload = image2canvas;
  img.src = svgURL;

  // Load the image
  function image2canvas() {
    var canvas = d3.select('body').append('canvas').attr('width', 2 * width).attr('height', 2 * height).remove().node();
    var ctx = canvas.getContext("2d");

    // Draw the image on a canvas
    ctx.drawImage(img, 0, 0);
    var png = canvas.toDataURL("image/png");
    d3.select('body').append('img').style('top', height + "px").attr('src', png)
    URL.revokeObjectURL(png);

    // Download link uses .toBlob() to allow large images
    ctx.canvas.toBlob(function(blob){
      d3.select("#download-link").attr("href", URL.createObjectURL(blob));
    });
  }
}
