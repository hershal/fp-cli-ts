#!/usr/bin/env node
/* Node v8.1.2 does not support ES2015-style modules without --harmony. */
'use strict';

const debug = require('../dist/Debug.js').default('Index');
const verbose = require('../dist/Debug.js').default('Index:Verbose');

const path = require('path');

const Dispatch = require('../dist/Dispatcher.js').default;
const DispatchDelegateConsoleLog = require('../dist/Dispatcher.js').DispatchDelegateConsoleLog;

let program = path.basename(process.argv[1], '.js');

debug('Starting up');
const dispatch = new Dispatch(new DispatchDelegateConsoleLog());

if (program == 'index' || program == 'f') {
  process.argv.shift();
  program = path.basename(process.argv[1], '.js');
}

debug(`Decoded program ${program}`);

const argv = process.argv.slice(2);

debug('Parsing arguments...');
verbose(`Got argv %O`, argv);

debug(`Dispatching ${argv.length} input argument(s) to ${program}.`);

dispatch.dispatch(program, argv).then((results) => {
  if (!results) {
    debug('No results returned. Successful exit.');
    return;
  }

  debug(`Returning ${results.length} result(s) via stdout.`);
  /* TODO: May have to extract this out. */
  console.log(results.join('\n'));
}).catch((err) => {
  console.log(err);
});
