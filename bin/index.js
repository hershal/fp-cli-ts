#!/usr/bin/env node
'use strict';

const path = require('path');

/* Node v8.1.2 does not support ES2015-style modules without --harmony. */
const InputParser = require('../lib/InputParser.js').default;
const Dispatcher = require('../lib/Dispatcher.js').default;

let program = path.basename(process.argv[1], '.js');

if (program == 'index') {
  process.argv.shift();
  program = path.basename(process.argv[1], '.js');
}

const argv = process.argv.slice(2);
const parser = new InputParser();

parser.parse(argv).then((input) => {
  const results = Dispatcher.execute(program, input);

  if (results.error) {
    console.log(results.error);
  } else {
    /* TODO: May have to extract this out. */
    console.log(results.results.join('\n'));
  }
});
