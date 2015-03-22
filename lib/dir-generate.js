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

var isFileName =  function(name) {
  return /\b\w*\.\w+$/.test(name);
}

var isMarkdownFile = function(name) {
  return path.extname(name) === '.md';
}

var isJSONFile = function (name) {
  return path.extname(name) == '.json';
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
    if (isMarkdownFile(filePath)) {
      return runWithMarkdown(data, dirPath, callback);
    } else if (isJSONFile(filePath)) {
      return runWithJSON(data, dirPath, callback);
    }
  });
};

var runWithMarkdown = function (data, dirPath, callback) {
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

var runWithJSON = function (data, dirPath, callback) {
  var json;
  try {
    json = JSON.parse(data);
  } catch (e) {
    return callback(new Error('JSON is not valid.'), null);
  }

  if (! json instanceof Array) {
    return callback(new Error('JSON format is incorrect.'), null);
  }
  exports._generateWithJSON(json, dirPath, function (err) {
    if(err) {
      return callback(err, null);
    }
    return callback(null, dirPath);
  });
}

exports._generateWithJSON = function (json, dirPath, callback) {
  json.forEach(function (e) {
    if (typeof(e) == 'string') {
      var data = e;
      var outputPath = path.join(dirPath, data);
      fse.ensureFile(outputPath, function (err) {
        return callback(err);
      });
    }
    else if (typeof(e) == 'object') {
      for ( var key in e ) {
        var outputPath = path.join(dirPath, key);
        fse.ensureDir(outputPath, function (err) {
          if(err) {
            return callback(err);
          }
          exports._generateWithJSON(e[key], outputPath, callback);
        });
      }
    }
  });
}

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
        checkEOF();
      });
    });
  } else if(type === 'listitem') {
    var data = json.shift();

    if(!data) {
      return callback(new Error('Wrong parse.'));
    }

    var outputPath = path.join(dirPath, data);

    if (isFileName(data)) {
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

  function checkEOF () {
    if(!--num) {
      return callback();
    }
  }
};
