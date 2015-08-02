
all: locations earthquake6 shale3 oklahoma1 oklahoma2

.PHONY: locations earthquake6 shale3

locations:
	cp ~/Sites/gist/ok1/index.html ./locations
	cp ~/Sites/gist/ok1/my.min.js ./locations
	cp ~/Sites/gist/ok1/data.json ./locations

shale3:
	cp ../../../shale3/index.html ./shale3
	cp ../../../shale3/shalegas.json ./shale3
	cp ../../../shale3/us.json ./shale3
	node app ../../../shale3/mymap.js ./shale3
	mv my.min.js ./shale3/mymap.js

earthquake6:
	cp ../../../earthquake6/index.html ./earthquake6
	cp ../../../earthquake6/shalegasplay.json ./earthquake6
	cp ../../../earthquake6/ok.json ./earthquake6
	cp ../../../earthquake6/quakes.json ./earthquake6
	cp ../../../earthquake6/styles.css ./earthquake6
	node app ../../../earthquake6/wells.js ./earthquake6
	mv my.min.js ./earthquake6/wells.js

oklahoma1:
	cp ../../../oklahoma1/index.html ./1
	cp ../../../oklahoma1/ok.json ./1
	node app ../../../oklahoma1/map.js
	mv my.min.js ./1/map.js

oklahoma2:
	cp ../../../oklahoma2/index.html ./2
	cp ../../../oklahoma2/ok.json ./2
	cp ../../../oklahoma2/quakes.json ./2
	cp ../../../oklahoma2/data.json ./2
	cp ../../../oklahoma2/shalegasplay.json ./2
	cp ../../../oklahoma2/wells.csv ./2
	node app ../../../oklahoma2/map.js
	mv my.min.js ./2/map.js
