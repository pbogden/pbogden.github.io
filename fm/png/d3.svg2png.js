  var sx = 0, sy = 0, sWidth = 960, sHeight = 500;  // Dimensions of full-size SVG
  var dx = 0, dy = 0, dWidth = 960, dHeight = 500;  // Save this part of SVG as PNG

  var svg;

  // Create the desination image
  var img = new Image();

  function my(selection) {
    svg = selection.node();

    img.onload = image2canvas;

    // Configure the link that loads the SVG into the Image element
    d3.select('#download-link')
        .attr("href", "#")
        .style("padding", "5px")
        .style("background-color", "#eee")
        .html("Download image")
        .on('click', function() {
          console.log('clicked');

          // Get the computed dimensions of the SVG
          var w = window.parseInt( window.getComputedStyle( svg ).getPropertyValue('width'), 10);
          var h = window.parseInt( window.getComputedStyle( svg ).getPropertyValue('height'), 10);
          console.log('Computed svg dimensions', w, h)

          img.width = w;
          img.height = h;

          d3.select(svg).attr('width', w).attr('height', h); // Firefox needs SVG with absolute widths
          var svgString = new XMLSerializer().serializeToString( svg );
          d3.select(svg).attr('width', null).attr('height', null);  // Remove absolute widths

          var svgBlob = new Blob([svgString], {type: "image/svg+xml"});
          var svgURL = URL.createObjectURL(svgBlob);
          img.src = svgURL;
        });
  }

  // Draw the image on a canvas, then download the canvas as a PNG
  function image2canvas() {

    // Create the canvas at the desired source dimensions
    var canvas = document.createElement('canvas')
    canvas.width = sWidth;
    canvas.height = sHeight;

    // Draw the image on the canvas -- scale it up to full size
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, sWidth, sHeight);

    // Subsample the canvas (get rid of the buttons)
    var canvas2 = document.createElement('canvas')
    canvas2.width = dWidth;
    canvas2.height = dHeight;
    var ctx2 = canvas2.getContext("2d");
    ctx2.drawImage(canvas, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

    // Resize the canvas
//    ctx.canvas.height = 100;

    // Convert the canvas to a PNG
    var png = canvas2.toDataURL("image/png");

    // Download the PNG
    d3.select('body').append('a')
        .attr("download", "hpsi.png")
        .attr("href", png)
        .each(function() { this.click() })
  }

  my.sx = function(_) {
    if (!arguments.length) return sx;
    sx = _;
    return my;
  };

  my.sy = function(_) {
    if (!arguments.length) return sy;
    sy = _;
    return my;
  };

  my.sWidth = function(_) {
    if (!arguments.length) return sWidth;
    sWidth = _;
    return my;
  };

  my.sHeight = function(_) {
    if (!arguments.length) return sHeight;
    sHeight = _;
    return my;
  };

  my.dx = function(_) {
    if (!arguments.length) return dx;
    dx = _;
    return my;
  };

  my.dy = function(_) {
    if (!arguments.length) return dy;
    dy = _;
    return my;
  };

  my.dWidth = function(_) {
    if (!arguments.length) return dWidth;
    dWidth = _;
    return my;
  };

  my.dHeight = function(_) {
    if (!arguments.length) return dHeight;
    dHeight = _;
    return my;
  };

  return my;
}
