#!/usr/bin/env node

const { parse, stringify } = require("../lib/canonicaljson.js");
const fs = require("fs");

const stdout = process.stdout;
const srcFiles = process.argv.slice(2);

srcFiles.forEach(srcFile => {
  fs.readFile(srcFile, "utf8", (err, data) => {
    if (err) throw err;
    const obj = parse(data);
    stdout.write(stringify(obj));
  });
});
