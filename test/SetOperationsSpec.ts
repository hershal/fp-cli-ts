import {Cat, Union, XOR} from '../src/SetOperations';

import * as chai from "chai";
const expect = chai.expect;

describe('Set Operations', function() {
    let list0 = ['one', 'two', 'three'];
    let list1 = ['one', 'two', 'four'];
    let list2 = ['five', 'two', 'four'];
    let args = [list0, list1, list2];

    describe('XOR', function() {
        it('Returns the identity with one list', function () {
            let xorOperation = new XOR();
            let xorList = xorOperation.run([list0]);
            expect(xorList).to.deep.equal(list0);
        });

        it('Computes the Symmetric Difference between lists', function () {
            let xorOperation = new XOR();
            let xorList = xorOperation.run(args);
            expect(xorList).to.deep.equal(['three', 'five']);
        });
    });

    describe('Union', function () {
        it('Returns the identity with one list', function () {
            let unionOperation = new Union();
            let unionList = unionOperation.run([list0]);
            expect(unionList).to.deep.equal(list0);
        });

        it('Unionizes two lists', function () {
            let unionOperation = new Union();
            let unionList = unionOperation.run([list0, list1]);
            expect(unionList).to.deep.equal(['one', 'two', 'three', 'four']);
        });

        it('Unionizes three lists', function () {
            let unionOperation = new Union();
            let unionList = unionOperation.run(args);
            expect(unionList).to.deep.equal(['one', 'two', 'three', 'four', 'five']);
        });
    });

    describe('Cat', function () {
        it('Returns the identity with one list', function () {
            let catOperation = new Cat();
            let catList = catOperation.run([list0]);
            expect(catList).to.deep.equal(list0);
        });

        it('Concatenates two lists', function () {
            let catOperation = new Cat();
            let catList = catOperation.run([list0, list1]);
            expect(catList).to.deep.equal(['one', 'two', 'three',
                                           'one', 'two', 'four']);
        });

        it('Concatenates three lists', function () {
            let catOperation = new Cat();
            let catList = catOperation.run(args);
            expect(catList).to.deep.equal(['one', 'two', 'three',
                                           'one', 'two', 'four',
                                           'five', 'two', 'four']);
        });
    });

});
