#!/usr/bin/env node
'use strict';

const debug = require('debug')('Index');
const verbose = require('debug')('Index:Verbose');

const path = require('path');

/* Node v8.1.2 does not support ES2015-style modules without --harmony. */
const Dispatcher = require('../dist/Dispatcher.js').default;

let program = path.basename(process.argv[1], '.js');

debug('Starting up');

if (program == 'index') {
  process.argv.shift();
  program = path.basename(process.argv[1], '.js');
}

debug(`Decoded program ${program}`);

const argv = process.argv.slice(2);

debug('Parsing arguments...');
verbose(`Got argv %O`, argv);

debug(`Dispatching ${argv.length} input argument(s) to ${program}.`);

Dispatcher.dispatch(program, argv).then((results) => {
  if (results.error) {
    console.log(results.error);
    debug(`Error: %O`, results.error);
  } else {
    debug(`Returning ${results.results.length} result(s) via stdout.`);
    verbose(`%O`, results.results);
    /* TODO: May have to extract this out. */
    console.log(results.results.join('\n'));
  }
});
