import { IOperation } from '../src/Interfaces';
import {Cat, Union, XOR} from '../src/SetOperations';

import * as chai from "chai";
const expect = chai.expect;

function checkOperation(operation: IOperation, input: string[][], expected: string[], callback: any) {
    operation
        .run(input)
        .then((results) => expect(results).to.deep.equal(expected))
        .then(() => callback())
        .catch(callback);
}

describe('Set Operations', function() {
    let list0 = ['one', 'two', 'three'];
    let list1 = ['one', 'two', 'four'];
    let list2 = ['five', 'two', 'four'];
    let args = [list0, list1, list2];

    describe('XOR', function() {
        it('Returns the identity with one list', function (done) {
            checkOperation(new XOR(), [list0], list0, done);
        });

        it('Computes the Symmetric Difference between lists', function (done) {
            checkOperation(new XOR(), args, ['three', 'five'], done);
        });
    });

    describe('Union', function () {
        it('Returns the identity with one list', function (done) {
            checkOperation(new Union(), [list0], list0, done);
        });

        it('Unionizes two lists', function (done) {
            checkOperation(new Union(), [list0, list1], ['one', 'two', 'three', 'four'], done);
        });

        it('Unionizes three lists', function (done) {
            checkOperation(new Union(), args, ['one', 'two', 'three', 'four', 'five'], done);
        });
    });

    describe('Cat', function () {
        it('Returns the identity with one list', function (done) {
            checkOperation(new Cat(), [list0], list0, done);
        });

        it('Concatenates two lists', function (done) {
            checkOperation(new Cat(), [list0, list1], ['one', 'two', 'three',
                                                       'one', 'two', 'four'], done);
        });

        it('Concatenates three lists', function (done) {
            checkOperation(new Cat(), args, ['one', 'two', 'three',
                                             'one', 'two', 'four',
                                             'five', 'two', 'four'], done);
        });
    });

});
