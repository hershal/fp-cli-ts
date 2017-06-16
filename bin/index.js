#!/usr/bin/env node
'use strict';

const path = require('path');
const ArgumentParser = require('../lib/ArgumentParser.js');
const Executor = require('../lib/Executor.js');

const program = path.basename(process.argv[1], '.js');
const argv = process.argv.slice(2);

const parsedArguments = ArgumentParser.parse(program, argv);
console.log(Executor.execute(program, parsedArguments));
