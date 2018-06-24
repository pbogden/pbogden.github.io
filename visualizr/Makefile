FILES = ../js/d3.min.js \
        script.js \
        ../js/ga.js

all: bundle.min.js

bundle.min.js: $(FILES)
	uglifyjs $^ -c -m -o bundle.min.js
