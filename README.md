dir-generate
===============

a easy tool to make dir with markdown

[![NPM](https://nodei.co/npm/dir-generate.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/dir-generate/)

###usage for require

===============

####install
	npm install dir-generate

####usage
	var dg = require('dir-generate');
	dg.runMarkdownFile('/Users/gkuchan/Documents/index.md', '/Users/gkuchan/Documents', function (err) {
	  if(err) {
	    console.log('Oh no!');
	    return;
	  }
	  console.log('Everything is ok.')
	});

####methods
* runMarkdownFile(filePath, dirPath, callback)

###usage for command-line

===============

####install
	npm install -g dir-generate

####help
	dir-generate -help

####usage
	Usage: dir-generate [options]
  	Options:
    -h, --help                output usage information
    -d, --dir [source_dir]    set target dir path. defaults to ./
    -f, --file [source_file]  set config file path. defaults to ./index.md

###usage for dev

* make jshint
* make test
* make cov
* make test-all

###example file

===============

	index.md
	--------------------------
	* folder1
		* hello.html
		* 1-1
			* abc.txt
		* 1-2
	* folder2
		* 233.md
	* folder3
		* 3-1
			* 3-1-1
				* 3-1-1-1
					* hehe.js
	--------------------------

	dir-generate -d ./ -f ./index.md

###tip

===============

* the folder name cannot have a **Filename Extension**
* the file name must have a **Filename Extension**

###TODO

===============

* use json to generate dir

###Lincense

===============

MIT
