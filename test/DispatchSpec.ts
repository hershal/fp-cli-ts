import Dispatch from '../src/Dispatcher';

import * as chai from 'chai';
const expect = chai.expect;

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
