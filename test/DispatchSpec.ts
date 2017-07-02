import Dispatch, { DispatcherStandardInputStream } from '../src/Dispatcher';
import { Split } from '../src/TextOperations';
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

    it('Dispatches to Cat', function (done) {
        dispatch
            .dispatch('cat', ['one', 'two']
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
        const split = new Split();
        dispatch
            .dispatch(split, [`--input-delimiter`, ` `, `--output-delimiter`, `,`])
            .then(() => expect(handlerDelegate.buffer).to.deep.equal(['hello,world']))
            .then(() => done())
            .catch((err) => console.log(err));
        stdin.write('hello world');
        stdin.end();
    });
});
