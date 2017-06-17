import { ISetOperation } from './Interfaces';

import * as _ from 'lodash';

/* Computes the Symmetric Difference of the input arrays. */
/* https://en.wikipedia.org/wiki/Symmetric_difference */
export class XOR implements ISetOperation {
    public run(data: string[][]): string[] {
        return _.xor(...data);
    }
}

/* Unions lists together. */
export class Union implements ISetOperation {
    public run(data: string[][]): string[] {
        return _.union(...data);
    }
}

/* Concatenates lists together. */
export class Cat implements ISetOperation {
    public run(data: string[][]): string[] {
        return _.concat(...data);
    }
}
