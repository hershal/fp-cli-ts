import StreamSerializer from './StreamSerializer';
import * as fs from 'fs';

import * as debugImport from 'debug';
const debug = debugImport('InputParser');

/* Argument Parser. */
/* This parser is asynchronous because reading multiple files synchronously is
 * such a bore. As such, it returns an ES2015 Promise. */
export default class InputParser {
    private serializer: StreamSerializer;

    constructor() {
        this.serializer = new StreamSerializer();
    }

    public parse(files: string[]): Promise<string[][]> {

        /* TODO: I'm probably going to have to extract out logic here to support
         * more complex transformations. */
        const readFilePromises = files.map((f) => {
            return new Promise<string[]>((resolve, reject) => {
                fs.readFile(f, (error: any, data: Buffer) => {
                    if (error) { reject(error); return; }

                    const formattedData = data
                        .toString()
                        .split('\n')
                        .filter((s: string) => s.length > 0);

                    resolve(formattedData);
                });
            });
        });

        if (process.stdin.isTTY) {
            debug(`Process is an interactive TTY.`);
            return Promise.all(readFilePromises);
        }

        debug(`Process is a pipe. Reading from stdin...`);
        const stdin = new Promise((resolve, reject) => {
            const serializer = new StreamSerializer();

            process.stdin.on('data', (data: Buffer) => {
                debug(`Stdin sent chunk of size ${data.length}.`);
                serializer.serialize(data);
            });

            process.stdin.on('end', () => {
                debug(`Stdin ended.`);
                const returnString = serializer.flush().toString().split('\n');
                debug(`Serialized chunks. Total size ${returnString.length}.`);
                resolve(returnString);
            });
        });

        return Promise.all([stdin, ...readFilePromises]);
    }
}
