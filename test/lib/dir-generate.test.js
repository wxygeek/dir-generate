/*!
 * dir-generate - test/lib/dir-generate.test.js
 * Author: GKuChan <gkuchan_root@outlook.com>
 */

'use strict';

/**
 * Module dependencies.
 */

var mm = require('mm');
var should = require('should');
var md = require( "markdown" ).markdown;
var path = require('path');
var dg = require('../../');
var fse = require('fs-extra');

var filePath = path.join(__dirname, 'test.md');
var dirPath = path.join(__dirname);

describe('/lib/dir-generate.js: runMarkdownFile', function () {
  afterEach(function (done) {
    mm.restore();
    fse.remove(path.join(__dirname, 'hello'), function (err) {
      done();
    });
  });

  it('should run with markdown ok', function (done) {
    var num = 0;

    function check () {
      if(!--num) {
        done();
      }
    }

    dg.runMarkdownFile(filePath, dirPath, function (err, dirPath) {
      should.not.exist(err);
      num += 5;

      fse.readdir(path.join(dirPath, 'hello'), function (err, files) {
        should.not.exist(err);
        check();
      });

      fse.readFile(path.join(dirPath, 'hello', '123.txt'), function (err, files) {
        should.not.exist(err);
        check();
      });

      fse.readdir(path.join(dirPath, 'hello', 'ok'), function (err, files) {
        should.not.exist(err);
        check();
      });

      fse.readFile(path.join(dirPath, 'hello', 'ok', 'abc.md'), function (err, files) {
        should.not.exist(err);
        check();
      });

      fse.readFile(path.join(dirPath, 'hello', 'ok', 'good.js'), function (err, files) {
        should.not.exist(err);
        check();
      });
    });
  });

  describe('should run error', function () {
    it('Arguments wrong.', function (done) {
      dg.runMarkdownFile(null, null, function (err) {
        err.message.should.equal('Arguments wrong.');
        done();
      });
    });

    it('fse.readFile', function (done) {
      mm.error(fse, 'readFile', 'mock error');
      dg.runMarkdownFile(filePath, dirPath, function (err) {
        should(err).Error;
        done();
      });
    });

    it('fse.ensureDir', function (done) {
      mm.error(fse, 'ensureDir', 'mock error');
      dg.runMarkdownFile(filePath, dirPath, function (err) {
        should(err).Error;
        done();
      });
    });
  });
});

