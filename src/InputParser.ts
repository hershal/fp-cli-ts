import StreamSerializer from './StreamSerializer';
import * as fs from 'fs';

/* Argument Parser. */
/* This parser is asynchronous because reading multiple files synchronously is
 * such a bore. As such, it returns an ES2015 Promise. */
export default class InputParser {
    private serializer: StreamSerializer;

    constructor() {
        this.serializer = new StreamSerializer();
    }

    public async parse(files: string[]): Promise<string[][]> {

        /* TODO: I'm probably going to have to extract out logic here to support
         * more complex transformations. */
        const readFilePromises = files.map((f) => {
            return new Promise<string[]>((resolve, reject) => {
                fs.readFile(f, (error, data) => {
                    if (error) { reject(error); return; }

                    const formattedData = data
                        .toString()
                        .split('\n')
                        .filter((s) => s.length > 0);

                     resolve(formattedData);
                });
            });
        });

        if (process.stdin.isTTY) {
            return await Promise.all(readFilePromises);
        }

        let stdin;

        const serializer = new StreamSerializer();
        process.stdin.on('data', (data: Buffer) => {
            serializer.serialize(data);
        });
        process.stdin.on('close', (data: Buffer) => {
            stdin = serializer.flush(data).toString();
        });

        return await Promise.all([stdin, ...readFilePromises]);
    }
}
