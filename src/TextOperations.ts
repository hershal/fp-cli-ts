import { IOperation } from './Interfaces';
import { StreamSerializerNewline } from './StreamSerializer';

import * as debugImport from 'debug';
import * as _ from 'lodash';
import * as yargs from 'yargs';

export class TextOperation {
    private debug: any;
    private serializer: StreamSerializerNewline;

    constructor() {
        this.serializer = new StreamSerializerNewline();
        this.debug = debugImport('TextOperation');
    }

    public parse(args: string[]): ITextOperationOptions {
        const parser = yargs
            .option('i', {
                alias: 'input-delimiter',
                describe: 'Input delimiter regex',
                nargs: 1,
                type: 'string',
                default: ' '
            })
            .option('o', {
                alias: 'output-delimiter',
                describe: 'Output delimiter string',
                nargs: 1,
                type: 'string',
                default: '\n'
            })
            .option('f', {
                alias: 'fields',
                describe: 'Fields number(s) to extract',
                type: 'array',
                default: undefined
            })
            .parse(args);

        this.debug(parser);

        if (Array.isArray(parser.i)) {
            parser.i = parser.i.pop();
        }

        if (Array.isArray(parser.o)) {
            parser.o = parser.o.pop();
        }

        return {
            inputDelimeterRegex: parser.i,
            outputDelimeter: parser.o,
            fields: _.split(parser.f, ',').map((s) => Number.parseInt(s))
        };
    }
}


export interface ITextOperationOptions {
    inputDelimeterRegex: string;
    outputDelimeter: string;
    fields: number[];
}