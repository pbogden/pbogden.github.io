all: colorado6 colorado7 colorado8 colorado9

colorado6:
	cp ../../../colorado6/index.html ./6
	cp ../../../colorado6/co.json ./6
	cp ../../../colorado6/file.json ./6
	cp ../../../colorado6/shalegasplay.json ./6

colorado7:
	cp ../../../colorado7/index.html ./7
	cp ../../../colorado7/file.json ./7
	node app ../../../colorado7/histogram.js
	mv my.min.js ./8/histogram.js

colorado8:
	cp ../../../colorado8/index.html ./8
	cp ../../../colorado8/co.json ./8
	cp ../../../colorado8/file.json ./8
	node app ../../../colorado8/colorado.js
	mv my.min.js ./8/colorado.js

colorado9:
	cp ../../../colorado9/index.html ./9
	cp ../../../colorado9/co.json ./9
	cp ../../../colorado9/file.json ./9
	node app ../../../colorado9/colorado.js
	mv my.min.js ./9/colorado.js
