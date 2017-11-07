import { ISynchronousOperation } from './Interfaces';
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
export class XOR extends SetOperation implements ISynchronousOperation {
    public run(data: string[][]): Promise<string[]> {
        return Promise.resolve(_.xor(...data));
    }
}

/* Unions lists together. */
export class Union extends SetOperation implements ISynchronousOperation {
    public run(data: string[][]): Promise<string[]> {
        return Promise.resolve(_.union(...data));
    }
}

/* Concatenates lists together. */
export class Concatenate extends SetOperation implements ISynchronousOperation {
    public run(data: string[][]): Promise<string[]> {
        return Promise.resolve(_.concat(...data));
    }
}

/* Computes the difference between the first list and the remaining lists. */
export class Difference extends SetOperation implements ISynchronousOperation {
    public run(data: string[][]): Promise<string[]> {
        return Promise.resolve(_.difference(data.shift(), ...data));
    }
}


interface IShortestUniqueSearchElement {
    str: string;
    found: boolean;
}

/* Computes the shortest string necessary to uniquely address every element */
export class ShortestUnique extends SetOperation implements ISynchronousOperation {
    public run(data: string[][]): Promise<string[]> {
        console.log(data);
        return Promise.resolve(this.shortestName(data[0]));
    }

    private shortestName(strings: string[]) {
        const ds = strings.map((s) => ({str: s, found: false}));
        let counter = 1;
        const uniquenames: string[] = [];
        do {
            const groupedNames = _(ds)
                .filter((d: IShortestUniqueSearchElement) => !d.found)
                .groupBy((s) => s.str.substr(0, counter))
                .value();

            Object.keys(groupedNames).forEach((key) => {
                const value = groupedNames[key];
                if (value.length === 1) {
                    uniquenames.push(key);
                    value[0].found = true;
                }
            });
            counter++;
        } while (uniquenames.length !== strings.length);

        return uniquenames;
    }
}
