import StreamSerializer from '../src/StreamSerializer';

import * as chai from "chai";
const expect = chai.expect;

describe('Stream Serializer', function () {
    it('Seralizes a stream', function () {
        const serializer = new StreamSerializer();

        serializer.serialize(new Buffer('hello'));
        serializer.serialize(new Buffer(' '));
        serializer.serialize(new Buffer('world'));
        const returnValue0 = serializer.flush().toString();

        expect(returnValue0).to.be.equal('hello world');

        /* Also make sure that the internal buffer is cleared: test twice */

        serializer.serialize(new Buffer('foo '));
        serializer.serialize(new Buffer('bar '));
        serializer.serialize(new Buffer('baz'));
        const returnValue1 = serializer.flush().toString();

        expect(returnValue1).to.be.equal('foo bar baz');
    });
});
