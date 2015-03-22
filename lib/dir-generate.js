/*!
 * dir-generate - lib/dir-generate.js
 * Author: GKuChan <gkuchan_root@outlook.com>
 */

'use strict';

/**
 * Module dependencies.
 */

var debug = require('debug')('dir-generate');
var process = require('process');
var md = require( "markdown" ).markdown;
var fse = require('fs-extra');
var path = require('path');

var isFile =  function(name) {
  return /\b\w*\.\w+$/.test(name);
}

var runWithMarkdown = function(data, dirPath, callback) {
  var json = md.parse(data);

  if (json.shift() !== 'markdown') {
    return callback(new Error('Markdown init wrong.'), null);
  }

  exports._generateWithMarkdown(json.shift(), dirPath, function (err) {
    if(err) {
      return callback(err, null);
    }
    return callback(null, dirPath);
  });
}

exports.run = function (filePath, dirPath, callback) {

  debug('dir-generate begin with: [filePath] %s [dirPath] %s', filePath, dirPath);

  callback = callback || function () {};

  if(!filePath || !dirPath) {
    return callback(new Error('Arguments wrong.'));
  }

  fse.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      return callback(err, null);
    }
    return runWithMarkdown(data, dirPath, callback);
  });
};

exports._generateWithMarkdown = function (json, dirPath, callback) {
  var num = 0;

  callback = callback || function () {};

  if(json.length === 0) {
    return callback(null);
  }

  var type = json.shift();

  if (type === 'bulletlist') {
    json.forEach(function (item) {
      num++;
      exports._generateWithMarkdown(item, dirPath, function (err) {
        if(err) {
          return callback(err);
        }
        check();
      });
    });
  } else if(type === 'listitem') {
    var data = json.shift();

    if(!data) {
      return callback(new Error('Wrong parse.'));
    }

    var outputPath = path.join(dirPath, data);

    if (isFile(data)) {
      fse.ensureFile(outputPath, function (err) {
        return callback(err);
      });
    } else {
      fse.ensureDir(outputPath, function (err) {
        if(err) {
          return callback(err);
        }
        var next = json.shift();
        if(next) {
          exports._generateWithMarkdown(next, outputPath, function (err) {
            return callback(err);
          });
        } else {
          return callback();
        }
      });
    }
  } else {
    return callback(new Error('Wrong input.'));
  }

  function check () {
    if(!--num) {
      return callback();
    }
  }
};
