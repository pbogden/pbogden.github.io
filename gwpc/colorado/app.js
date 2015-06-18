var jsp = require("../../../node_modules/uglify-js").parser;
var pro = require("../../../node_modules/uglify-js").uglify;
var fs = require("fs");

fs.readFile(process.argv[2], "utf8", function(err, file) {
    if (err) return console.log('Error reading file', err);
    var ast = jsp.parse(file); // parse code and get the initial AST (Abstract Syntax Tree)
    ast = pro.ast_mangle(ast); // get a new AST with mangled names
    ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
    var final_code = pro.gen_code(ast); // compressed code here
  
    fs.writeFile("my.min.js", final_code, function(err) {
        if (err) return console.log("Error writing output", err);
        console.log("Done");
    });
});
