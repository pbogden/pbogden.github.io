
# Disruptive Data Visualization with Web Technologies

### What do I mean by web technologies?

* I mean HTML5
* I don't mean the latest version of a markup language (HTML) for rendering text and images in a browser.
* I mean [HTML5](https://developer.mozilla.org/en-US/docs/Glossary/HTML5), 
the buzzword that represents a whole lot more...
  * It's a collection of modern technologies that includes HTML, CSS and other living web standards.
  * It includes the increasingly powerful JavaScript (not Java!) language that's built into all modern browsers.
  * And a powerful APIs (Application Programming Interfaces) for sophisticated hardware and data access.
  * "And the depth of modern web technologies is staggering." -- [Mike Bostock](https://observablehq.com/@observablehq/future-of-data-work-q-a-with-mike-bostock)

### What's disruptive about HTML5?

* HTML5 is to the modern web as Steve Jobs was to the rotary phone.
  * With Steve Jobs, the disruptive combination was: Art + STEM.
* With HTML5, the disruptive combination is: Art + STEM + Data
* New disciplines
  * Data Journalism (e.g., [NY Times](https://archive.nytimes.com/www.nytimes.com/interactive/2012/02/13/us/politics/2013-budget-proposal-graphic.html))
* New business models
  * BI (interactive charting) moved from desktop to the browser (Tableau, PowerBI, etc.)
  * 3-D desktop graphics moved to the browser (WebGL is OpenGL. And IE is dead, finally:-)
  * ICYMI, 3-D Geospatial is in the browser ([google maps](https://www.google.com/maps/place/Portland,+ME/@43.6669249,-70.3515984,11z/data=!3m1!4b1!4m5!3m4!1s0x4cb29c72aab0ee2d:0x7e9db6b53372fa29!8m2!3d43.6590993!4d-70.2568189), mapbox, etc.) 
* But none of this is really new.

### Data science in a browser

Python & R, meet JavaScript. The barrier between web dev and data science has never been lower. That's really new.

* Python
  * [Google Colab](https://colab.research.google.com/) -- Jupyter notebook on steroids, with a big-data back end and no configuration.
  * [Data visualization with Python](https://www.anaconda.com/blog/python-data-visualization-2018-why-so-many-libraries)
  * [Plotly.com](https://plotly.com/) -- "AI, ML, and Python analytics for business at 5% the cost of a full-stack approach."
    * Under the hood, data visualization uses web technologies.
* [R](https://ggplot2.tidyverse.org/) -- R Studio, R Shiny
  * [R Studio](https://shiny.rstudio.com/) is the R counterpart.
  * "Shiny apps are easy to write. No web development skills are required."
  * Under the hood, data visualization uses web technologies.
* JavaScript -- [Observable](https://observablehq.com/) -- by Mike Bostock (creator of D3)
  * This is it -- there's no hood to look under!

### So what's new?

* [Plotly.com](https://plotly.com/) is new and evolving.
  * Started as [plotly.js](https://github.com/plotly/plotly.js) (and plotly.py and plotly.r)
  * Now it's AI, ML and Python analytics at less than "5% of the cost of a full-stack" development approach.
  * [Data science vs dashboards](https://plotly.com/comparing-dash-tableau-powerbi-einstein-analytics/) -- no comparison
  * They just got some VC funding to go big.
  * BTW, it's not free.
* [Observable, Inc](http://observablehq.com) by Mike Bostock
  * "Building a better computational medium." 
  * Founder @observablehq. Creator @d3. Former @nytgraphics. Pronounced BOSS-tock.
  * [Mike Bostock's vision](https://observablehq.com/@observablehq/future-of-data-work-q-a-with-mike-bostock) -- Published 7 Dec 2021
  * A new IDE -- an integrated *discovery* environment rather than *development* environment.
  * "I didn’t want to introduce limitations on the displays themselves.
Constraints would make the problem easier, but uninteresting.
I wanted to preserve creativity and expressiveness.
As a kid and as an adult, I never want to do what someone tells me to do; I want freedom to make up my own mind.
This necessitated a low-level approach at the beginning.
Code for everything, even paragraphs of text! And the depth of modern web technologies is staggering."

## What can you do with Observable?

* Exploratory data analysis
  * [Scatterplot matrix](https://observablehq.com/@d3/brushable-scatterplot-matrix?collection=@d3/d3-brush)
  * [Observable Plot](https://observablehq.com/@observablehq/plot)
  * [Dashboards](https://observablehq.com/@mbostock/dashboard)
  * [Mona Lisa Histogram](https://observablehq.com/@d3/mona-lisa-histogram)
* Teaching
  * [Sorting algorithms](https://observablehq.com/@tmcw/sorting-overview?collection=@tmcw/sorting-algorithms)
  * [Bridgeson's algorithm](https://observablehq.com/@mbostock/bridsons-algorithm)
  * [Shuffling algorithm](https://observablehq.com/@mbostock/visualizing-order)
  * [Linked Lists](https://observablehq.com/@mbostock/linked-lists?collection=@mbostock/data-structures)
  * [Golden ratio](https://observablehq.com/@mbostock/golden-mona-lisa)
* Geospatial, modeling, collaboration, etc., etc.
  * [Streaming shapefiles](https://observablehq.com/@mbostock/streaming-shapefiles)
  * [Fluid physics](https://observablehq.com/@mbostock/liquidfun)
  * [Dynamical systems](https://observablehq.com/@mbostock/de-jong-attractor-ii?collection=@observablehq/webgl)
  * [Hello, Three.js!](https://observablehq.com/@mbostock/hello-three-js)
  * [Deck.gl](https://observablehq.com/@pessimistress/deck-gl-tutorial?collection=@pessimistress/deck-gl-tutorials)
  * [Scatter-gl](https://observablehq.com/d/386845a4a17cfb25?collection=@pbogden/3d) from [tensorflow.org](http://projector.tensorflow.org/)
* "We’re building from the bottom up to retain expressiveness, creativity, and flexibility."
  * "We can reduce effort...Less work to prepare, and less to perform."
  * "Reducing effort is incredibly exciting because it doesn’t just save time, it changes who engages in a task, and when!"
