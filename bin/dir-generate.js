#!/usr/bin/env node

'use strict';

/**
 * Module dependencies.
 */

var commander = require('commander');
var process = require('process');
var md = require( "markdown" ).markdown;
var fse = require('fs-extra');
var path = require('path');
var dg = require('../lib/dir-generate');

commander
  .option('-d, --dir [source_dir] ',
    'set target dir path. defaults to ./',
    './')
  .option('-f, --file [source_file]',
    'set config file path. defaults to ./index.md',
    './index.md');

commander.parse(process.argv);

var filePath = commander.file;
var dirPath = commander.dir;

dg.run(filePath, dirPath, function (err, path) {
  if(err) {
    return err;
  }
  console.log('dir-generate finish.');
  console.log('the target dir path: ' + path);
});
