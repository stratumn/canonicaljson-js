#!/usr/bin/env node

const stringify = require('../lib/index');
const fs = require('fs');

const stdout = process.stdout;
const srcFiles = process.argv.slice(2);

srcFiles.forEach(srcFile => {
  fs.readFile(srcFile, 'utf8', (err, data) => {
    if (err) throw err;
    const obj = JSON.parse(data);
    stdout.write(stringify(obj));
  });
});
