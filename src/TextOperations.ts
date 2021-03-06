import { IStreamingOperation } from './Interfaces';
import { StreamSerializer } from './StreamSerializer';
import Debug from './Debug';

import * as _ from 'lodash';
import * as yargs from 'yargs';


export class TextOperation {
    protected options: ITextOperationOptions;
    private debug = Debug('TextOperation');

    public parse(args: string[]): ITextOperationOptions {
        this.options = undefined;
        const parser = yargs
            .option('i', {
                alias: 'input-delimiter',
                describe: 'The per-line input delimiter regex.',
                nargs: 1,
                type: 'string',
                default: ' '
            })
            .option('o', {
                alias: 'output-delimiter',
                describe: 'The output delimiter string.',
                nargs: 1,
                type: 'string',
                default: '\n'
            })
            .option('f', {
                alias: 'fields',
                describe: 'Fields number(s) to extract, zero-indexed.',
                type: 'array',
                default: undefined
            })
            .option('t', {
                alias: 'trim',
                describe: 'Trim the split strings.',
                type: 'boolean',
                default: true
            })
            .parse(args);

        this.debug(parser);

        if (Array.isArray(parser.i)) {
            parser.i = parser.i.pop();
        }

        if (Array.isArray(parser.o)) {
            parser.o = parser.o.pop();
        }

        this.options = {
            inputDelimeterRegex: parser.i,
            outputDelimeter: parser.o,
            fields: _.split(parser.f, ',').map((s) => Number.parseInt(s))
        };

        return this.options;
    }

    public run(data: string, callback: (data: string) => string): string {
        return callback(data);
    }
}


export interface ITextOperationOptions {
    inputDelimeterRegex: string;
    outputDelimeter: string;
    fields: number[];
}


export class Split extends TextOperation implements IStreamingOperation {
    public run(data: string): string {
        const inputDelim = this.options.inputDelimeterRegex;
        const processed = _.split(data.replace(/\s+/g, ' ').trim(), new RegExp(inputDelim));

        /* If you're asking for a specific field, then return that. */
        if (this.options.fields.length > 0
            && this.options.fields[0] !== undefined
            && !isNaN(this.options.fields[0])) {

            return _(this.options.fields).map((num) => processed[num])
                .join(this.options.outputDelimeter);
        }
        /* Otherwise return the entire string */
        return _.join(processed, this.options.outputDelimeter);
    }
}


export class Trim extends TextOperation implements IStreamingOperation {
    public run(data: string): string {
        return _.trim(data);
    }
}


export class Cat implements IStreamingOperation {
    private debug = Debug('Cat');
    private stringToConcatenate: string;

    public parse(args: string[]): void {
        this.stringToConcatenate = args.join(' ');
        this.debug('Parsed arguments: %o', this.stringToConcatenate);
    }

    public run(data: string): string {
        this.debug('Received string');
        return data + this.stringToConcatenate;
    }
}


export class Map implements IStreamingOperation {
    private debug = Debug('Map');
    private func: any;

    public parse(args: string[]): void {
        this.func = args.join(' ');
    }

    public run(data: string): string {
        return eval(this.func)(data);
    }
}
