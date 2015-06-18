all: colorado6 colorado7 colorado8

colorado6:
	cp ../../../colorado6/index.html ./6
	cp ../../../colorado6/co.json ./6
	cp ../../../colorado6/file.json ./6

colorado7:
	cp ../../../colorado7/index.html ./7
	cp ../../../colorado7/file.json ./7
	uglifyjs ../../../colorado7/histogram.js > ./7/histogram.js

colorado8:
	cp ../../../colorado8/index.html ./8
	cp ../../../colorado8/co.json ./8
	cp ../../../colorado8/file.json ./8
	uglifyjs ../../../colorado8/colorado.js > ./8/colorado.js
