#!/usr/bin/env node
'use strict';

const debug = require('../dist/Debug.js').default('Index');
const verbose = require('../dist/Debug.js').default('Index:Verbose');

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
  debug(`Returning ${results.length} result(s) via stdout.`);
  /* TODO: May have to extract this out. */
  console.log(results.join('\n'));
}).catch((err) => {
  console.log(err);
});
