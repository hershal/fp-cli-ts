import { TextOperation } from '../src/TextOperations';

import * as chai from "chai";
const expect = chai.expect;


describe('TextOperation Parser', function () {
    it('Parses empty arguments', function () {
        const op = new TextOperation();
        const parsed = op.parse([]);
        expect(parsed).to.deep.equal({
            inputDelimeterRegex: ' ',
            outputDelimeter: '\n',
            fields: [NaN]
        })
    });

    it('Parses short arguments', function () {
        const op = new TextOperation();
        const parsed = op.parse(['-i', 'asdf',
                                 '-i', 'jkl',
                                 '-o', 'fdas',
                                 '-o', 'lkj',
                                 '-f', '1,2,3',
                                 '-f', '4,5']);
        expect(parsed).to.deep.equal({
            inputDelimeterRegex: 'jkl',
            outputDelimeter: 'lkj',
            fields: [1, 2, 3, 4, 5]
        })
    });

    it('Parses long arguments', function () {
        const op = new TextOperation();
        const parsed = op.parse(['--input-delimiter', 'asdf',
                                 '--output-delimiter', 'fdas',
                                 '--fields', '1,2,3',
                                 '--fields', '4,5,6']);
        expect(parsed).to.deep.equal({
            inputDelimeterRegex: 'asdf',
            outputDelimeter: 'fdas',
            fields: [1, 2, 3, 4, 5, 6]
        })
    });
});
