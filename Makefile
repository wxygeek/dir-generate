TESTS = $(shell ls -S `find test -type f -name "*.test.js" -print`)
REPORTER = tap

install:
	@npm install

jshint:
	@npm install
	@./node_modules/.bin/jshint ./

test: install
	@$(NODE) ./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		$(TESTS)

test-all: jshint test

.PHONY: jshint test test-all
