import { IOperation } from './Interfaces';
import { InputParserReadFilesOptionalStandardInput } from './InputParser';

import * as _ from 'lodash';

export class SetOperation {
    private parser: InputParserReadFilesOptionalStandardInput;

    constructor() {
        this.parser = new InputParserReadFilesOptionalStandardInput();
    }

    public parse(argv: string[]): Promise<string[][]> {
        return this.parser.parse(argv);
    }
}

/* Computes the Symmetric Difference of the input arrays. */
/* https://en.wikipedia.org/wiki/Symmetric_difference */
export class XOR extends SetOperation implements IOperation {
    public run(data: string[][]): Promise<string[]> {
        return new Promise((resolve, reject) => resolve(_.xor(...data)));
    }
}

/* Unions lists together. */
export class Union extends SetOperation implements IOperation {
    public run(data: string[][]): Promise<string[]> {
        return new Promise((resolve, reject) => resolve(_.union(...data)));
    }
}

/* Concatenates lists together. */
export class Cat extends SetOperation implements IOperation {
    public run(data: string[][]): Promise<string[]> {
        return new Promise((resolve, reject) => resolve(_.concat(...data)));
    }
}
