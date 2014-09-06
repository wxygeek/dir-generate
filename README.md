dir-generate
============

a easy tool to make dir with markdown

[![NPM](https://nodei.co/npm/dir-generate.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/dir-generate/)

###install
	npm install -g dir-generate
	
###help
	dir-generate -help

###how to use
	Usage: dir-generate [options]
  	Options:
    -h, --help                output usage information
    -d, --dir [source_dir]    set target dir path. defaults to ./
    -f, --file [source_file]  set config file path. defaults to ./index.md

###example
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
* the folder name cannot have a **Filename Extension**
* the file name must have a **Filename Extension**