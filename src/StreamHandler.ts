import Debug from './Debug';
import { IStandardInputStreamHandlerDelegate } from './Interfaces';
import { StreamSerializer } from './StreamSerializer';


class StandardInputStreamHandler {
    public delegate: IStandardInputStreamHandlerDelegate;

    private debug = Debug('InputParserReadFilesOptionalStandardInput');
    private buffer: string[] = [];

    public once(): Promise<string[]> {
        const serializer = new StreamSerializer();
        return new Promise((resolve, reject) => {
            const callback = (serialized: string): string => {
                this.debug(`callback called on string of length ${serialized.length}.`);
                if (!this.delegate) {
                    this.debug(`StandardInputStreamHandlerDelegate not specified; ` +
                               `saving serialized data into internal buffer.`);
                    this.buffer.push(serialized);
                } else {
                    /* flush the buffer */
                    this.buffer.forEach((l) => this.delegate.streamDidReceiveChunk(l));

                    /* flush out the newly serialized data */
                    this.delegate.streamDidReceiveChunk(serialized);

                    /* clear out the buffer */
                    this.buffer = [];
                }

                return serialized;
            };

            process.stdin.on('data', (data: Buffer) => {
                this.debug(`Stdin sent chunk of size ${data.length}.`);
                serializer.serialize(data, (serialized: string) => callback(serialized));
            });

            process.stdin.on('end', () => {
                this.debug(`Stdin ended.`);
                serializer.flush((data: string) => callback(data));

                if (this.delegate) {
                    this.delegate.streamDidEnd([]);
                }

                resolve(this.buffer);
                this.buffer = [];
            });
        });
    }

}
