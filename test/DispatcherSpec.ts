import  Dispatcher from '../src/Dispatcher';

import * as chai from 'chai';
const expect = chai.expect;

import * as path from 'path';

describe('Dispatcher', function () {
    it('Dispatches to fcat', function (done) {
        Dispatcher
            .dispatch('fcat', ['one', 'two']
                      .map((f) => path.resolve(__dirname + '/fixtures/' + f)))
            .then((results) => expect(results).to.be.deep.equal(['1', '2', '2', '3']))
            .then(() => done())
            .catch(done);
    })
})