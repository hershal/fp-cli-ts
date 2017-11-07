import Dispatch, { DispatcherStandardInputStream } from '../src/Dispatcher';
import * as TextOperations from '../src/TextOperations';
import { BasicStreamHandlerDelegate } from './BasicStreamHandler'

import * as chai from 'chai';
const expect = chai.expect;

import { stdio } from 'stdio-mock';
import * as path from 'path';


describe('Dispatch', function () {
    let dispatch: Dispatch;

    beforeEach(function () {
        dispatch = new Dispatch();
    });

    it('Dispatches to Concatenate', function (done) {
        dispatch
            .dispatch('concat', ['one', 'two']
                      .map((f) => path.resolve(__dirname + '/fixtures/' + f)))
            .then((results) => expect(results).to.be.deep.equal(['1', '2', '2', '3']))
            .then(() => done())
            .catch(done);
    });
});


describe('DispatcherStandardInputStream', function () {
    let dispatch: DispatcherStandardInputStream;
    let handlerDelegate: BasicStreamHandlerDelegate;
    let stdin: any;

    beforeEach(function() {
        handlerDelegate = new BasicStreamHandlerDelegate();
        stdin = stdio().stdin;
        dispatch = new DispatcherStandardInputStream(handlerDelegate, stdin);
    });

    it('Dispatches a basic split async operation', function (done) {
        const split = new TextOperations.Split();
        dispatch
            .dispatch(split, [`--input-delimiter`, ` `, `--output-delimiter`, `,`])
            .then(() => expect(handlerDelegate.buffer).to.deep.equal(['hello,world']))
            .then(() => done())
            .catch((err) => console.log(err));
        stdin.write('hello world');
        stdin.end();
    });

    it('Dispatches to cat', function (done) {
        const cat = new TextOperations.Append();
        dispatch
            .dispatch(cat, [`hello world`])
            .then(() => expect(handlerDelegate.buffer).to.deep.equal(['ellohello world', 'somethinghello world']))
            .then(() => done())
            .catch((err) => console.log(err));
        stdin.write('ello\nsomething');
        stdin.end();
    });

    it('Dispatches to map', function (done) {
        const cat = new TextOperations.Map();
        dispatch
            .dispatch(cat, [`(x) => {const path = require('path'); return x + path.extname(x);}`])
            .then(() => expect(handlerDelegate.buffer).to.deep.equal(['hello.world.world']))
            .then(() => done())
            .catch((err) => console.log(err));
        stdin.write('hello.world');
        stdin.end();
    });
});
