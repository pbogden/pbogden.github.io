
all: injection locations quakes earthquake6 shale3 oklahoma0 oklahoma1 oklahoma2 oklahoma3

.PHONY: injection locations quakes earthquake6 shale3

locations:
	cp ~/Sites/gist/ok1/index.html ./locations
	cp ~/Sites/gist/ok1/my.min.js ./locations
	cp ~/Sites/gist/ok1/data.json ./locations

injection:
	cp ~/Sites/projects/frac/drafts/12/index.html ./injection
	cp ~/Sites/projects/frac/drafts/12/my.min.js ./injection
	cp ~/Sites/projects/frac/drafts/12/ok.json ./injection
	cp ~/Sites/projects/frac/drafts/12/InjectionVolume.tsv ./injection
	cp ~/Sites/projects/frac/drafts/12/fracfocus.json ./injection

quakes:
	cp ~/Sites/projects/frac/drafts/10/index.html ./quakes
	cp ~/Sites/projects/frac/drafts/10/my.min.js ./quakes
	cp ~/Sites/projects/frac/drafts/10/ok.json ./quakes
	cp ~/Sites/projects/frac/drafts/10/InjectionVolume.tsv ./quakes
	cp ~/Sites/projects/frac/drafts/10/quakes.json ./quakes

shale3:
	cp ../../../shale3/index.html ./shale3
	cp ../../../shale3/shalegas.json ./shale3
	cp ../../../shale3/us.json ./shale3
	../../../d3/bin/uglify ../../../shale3/mymap.js > ./shale3/mymap.js

earthquake6:
	cp ../../../earthquake6/index.html ./earthquake6
	cp ../../../earthquake6/shalegasplay.json ./earthquake6
	cp ../../../earthquake6/ok.json ./earthquake6
	cp ../../../earthquake6/quakes.json ./earthquake6
	cp ../../../earthquake6/styles.css ./earthquake6
	../../../d3/bin/uglify ../../../earthquake6/wells.js > ./earthquake6/wells.js

oklahoma0:
	cp ../../../oklahoma/index.html ./0
	cp ../../../oklahoma/ok.json ./0
	cp ../../../oklahoma/quakes.json ./0
	cp ../../../oklahoma/data.json ./0
	cp ../../../oklahoma/shalegasplay.json ./0
	cp ../../../oklahoma/bundle.min.js ./0

oklahoma1:
	cp ../../../oklahoma1/index.html ./1
	cp ../../../oklahoma1/ok.json ./1
	cp ../../../oklahoma1/bundle.min.js ./1

oklahoma2:
	cp ../../../oklahoma2/index.html ./2
	cp ../../../oklahoma2/ok.json ./2
	cp ../../../oklahoma2/quakes.json ./2
	cp ../../../oklahoma2/data.json ./2
	cp ../../../oklahoma2/shalegasplay.json ./2
	cp ../../../oklahoma2/wells.csv ./2
	cp ../../../oklahoma2/bundle.min.js ./2

oklahoma3:
	cp ../../../oklahoma3/index.html ./3
	cp ../../../oklahoma3/ok.json ./3
	cp ../../../oklahoma3/quakes.json ./3
	cp ../../../oklahoma3/junk.json ./3
	cp ../../../oklahoma3/shalegasplay.json ./3
	cp ../../../oklahoma3/wells.csv ./3
	cp ../../../oklahoma3/bundle.min.js ./3
