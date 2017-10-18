#!/usr/bin/env node

var canonicaljson = require("../lib/index");
var fs = require("fs");
var stdout = process.stdout;
var srcFiles = process.argv.slice(2);

srcFiles.forEach(srcFile => {
  fs.readFile(srcFile, "utf8", function(err, data) {
    if (err) throw err;
    var obj = JSON.parse(data);
    stdout.write(canonicaljson.stringify(obj));
  });
});
