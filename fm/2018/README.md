
# 2018 Loan Acquisitions

Various map products

## observable notebooks

* Note that only selected cells from the notebooks are added, and I removed margins from the body element
* Reference: [Downloading and embedding notebooks](https://observablehq.com/@observablehq/downloading-and-embedding-notebooks)

For example, the bubble displays only two cells: objectView and chart. So I added the following HTML:

    <body style='margin:0'>

    <div id='container'>
        <div id='objectView' style="position: absolute; left: 50%; top: 5%">
        </div>
        <div id='chart'>
        </div>
    </div>

And updated the script to:

    new Runtime().module(define, name => {
      if (name === "chart") {
        return new Inspector(document.querySelector("#chart"));
      }
      if (name === "objectView") {
        return new Inspector(document.querySelector("#objectView"));
      }
    });
