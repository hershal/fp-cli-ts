import { StandardInputStreamHandler } from '../src/StreamHandler'
import { IStreamHandlerDelegate } from '../src/Interfaces'

import * as chai from "chai";
const expect = chai.expect;

import { stdio } from 'stdio-mock';

class BasicStreamHandlerDelegate implements IStreamHandlerDelegate {
    public streamSerializationString: string;
    public buffer: string[];

    constructor() {
        this.buffer = [];
    }

    /* Delegate methods */
    public streamChunkTrigger(): string {
        return this.streamSerializationString;
    }

    public streamDidReceiveChunk(chunk: string) {
        this.buffer.push(chunk);
    }

    public streamDidEnd() { }
}

describe('Stream Handler', function () {
    describe('StandardInputStreamHandler', function () {
        let handler: StandardInputStreamHandler;
        let handlerDelegate: BasicStreamHandlerDelegate;
        let stdin: any;

        beforeEach(function () {
            handler = new StandardInputStreamHandler();
            handlerDelegate = new BasicStreamHandlerDelegate();
            handler.delegate = handlerDelegate;
            handler.delegate
            stdin = stdio().stdin;
        });

        it('Serializes a simple hello world', function (done) {
            handlerDelegate.streamSerializationString = '\n';
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
    });
});
