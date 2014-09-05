/*!
 * dir-generate - lib/dir-generate.js
 * Author: GKuChan <gkuchan_root@outlook.com>
 */

'use strict';

/**
 * Module dependencies.
 */

var commander = require('commander');
var process = require('process');
var md = require( "markdown" ).markdown;
var fse = require('fs-extra');
var path = require('path');

exports.run = function () {
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


  fse.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      throw new Error('Failed to open file.');
    }

    var json = md.parse(data);
    if (json.shift() !== 'markdown') {
      throw new Error('Markdown init wrong.');
    }
    initDir(json.shift(), dirPath);
    console.log('dir-generate finish.');
  });

  function initDir (json, dirPath) {
    if(json.length === 0) {
      return;
    }
    var type = json.shift();
    if (type === 'bulletlist') {
      json.forEach(function (item) {
        initDir(item, dirPath);
      });
    } else if(type === 'listitem') {
      var data = json.shift();
      if(!data) {
        throw new Error('Wrong parse.');
      }
      var outputPath = path.join(dirPath, data);
      if (/\b\w*\.\w+$/.test(data)) {
        fse.outputFile(outputPath, '');
      } else {
        fse.ensureDir(outputPath);
        var next = json.shift();
        if(next) {
          initDir(next, outputPath);
        }
      }
    } else {
      throw new Error('Wrong input.');
    }
  }
};