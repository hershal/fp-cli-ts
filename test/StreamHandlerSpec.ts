import { StreamHandler } from '../src/StreamHandler'
import { IStreamHandlerDelegate } from '../src/Interfaces'

import { BasicStreamHandlerDelegate } from './BasicStreamHandler'

import * as chai from "chai";
const expect = chai.expect;

import { stdio } from 'stdio-mock';

describe('Stream Handler', function () {
    describe('StandardInputStreamHandler', function () {
        let handler: StreamHandler;
        let handlerDelegate: BasicStreamHandlerDelegate;
        let stdin: any;

        beforeEach(function () {
            handler = new StreamHandler();
            handlerDelegate = new BasicStreamHandlerDelegate();
            handler.delegate = handlerDelegate;
            stdin = stdio().stdin;
        });

        it('Serializes a simple hello world', function (done) {
            handler.once(stdin).then(() => {
                expect(handlerDelegate.buffer).to.deep.equal(['hello world']);
                done();
            });
            stdin.write('hello world');
            stdin.end();
        });

        it('Serializes a simple hello world with a space chunk string', function (done) {
            handlerDelegate.streamSerializationString = ' ';
            handler.once(stdin).then(() => {
                expect(handlerDelegate.buffer).to.deep.equal(['hello', 'world']);
                done();
            });
            stdin.write('hello world');
            stdin.end();
        });

        it('Serializes a block of input', function (done) {
            handler.once(stdin).then(() => {
                expect(handlerDelegate.buffer).to.deep.equal(['hello world',
                                                              'mellow world']);
                done();
            });
            stdin.write('hello world\nmellow world');
            stdin.end();
        });

        it('Serializes a block of input with a space chunk string', function (done) {
            handlerDelegate.streamSerializationString = ' ';
            handler.once(stdin).then(() => {
                expect(handlerDelegate.buffer).to.deep.equal(['hello', 'world\nmellow', 'world']);
                done();
            });
            stdin.write('hello world\nmellow world');
            stdin.end();
        });
    });
});
