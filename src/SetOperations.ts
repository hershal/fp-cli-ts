/// <reference path="../typings/index.d.ts" />

import { SetOperation } from './Interfaces';
import * as _ from 'lodash';

/* Computes the Symmetric Difference of the input arrays. */
/* https://en.wikipedia.org/wiki/Symmetric_difference */
export class XOR implements SetOperation {
    public run(first: string[], rest: string[][]): string[] {
        return _.xor(first, ...rest);
    }
}

/* Concatenates lists together */
export class Cat implements SetOperation {
    public run(first: string[], rest: string[][]): string[] {
        return _.concat(first, ...rest);
    }
}
