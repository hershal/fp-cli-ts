# fp-cli

[![Build Status](https://travis-ci.org/{{github-user-name}}/{{github-app-name}}.svg?branch=master)](https://travis-ci.org/{{github-user-name}}/{{github-app-name}}.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/{{github-user-name}}/{{github-app-name}}/badge.svg?branch=master)](https://coveralls.io/github/{{github-user-name}}/{{github-app-name}}?branch=master)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

​
If stdin provided, remaining args are files
If no stdin, then first source is special in difference/subtract. Much like lodash

Set progs api
<stdin> | <tool> <args>
Or
<tool> <arg0> <arg1..n>

Map/filter is
<stdin> | <tool> <code>
Or
<tool> <file> <code>

Files are local variables!
