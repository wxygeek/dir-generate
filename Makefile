TESTS = $(shell ls -S `find test -type f -name "*.test.js" -print`)

install:
	@npm install

jshint:
	@npm install
	@./node_modules/.bin/jshint ./

test: install
	@NODE_ENV=test node ./node_modules/.bin/mocha \
		$(TESTS)

test-cov cov: install
	@NODE_ENV=test ./node_modules/.bin/istanbul cover --preserve-comments \
		./node_modules/.bin/_mocha \
		$(TESTS)

test-all: jshint test cov

.PHONY: jshint test test-all cov test-cov
