import Debug from './Debug';
import { IStreamHandlerDelegate } from './Interfaces';
import { StreamSerializer } from './StreamSerializer';


export class StandardInputStreamHandler {
    public delegate: IStreamHandlerDelegate;

    private debug = Debug('InputParserReadFilesOptionalStandardInput');

    public once(stream: any): Promise<string[]> {
        const chunkString = this.delegate.stdinStreamSerializeCharacter();
        const serializer = new StreamSerializer(chunkString);

        return new Promise((resolve, reject) => {
            stream.on('data', (data: Buffer) => {
                this.debug(`Stream sent chunk of size ${data.length}.`);
                serializer.serialize(data,
                    (serialized: string) => this.serializationCallback(serialized));
            });
            this.debug('Installed stream data handler.');

            stream.on('end', () => {
                serializer.flush((data: string) => this.serializationCallback(data));
                this.delegate.streamDidEnd();
                this.debug(`Stream ended. Resolving once() Promise.`);
                resolve();
            });
            this.debug('Installed stream end handler.');
        });
    }

    private serializationCallback(serialized: string): string {
        this.debug(`callback called on string of length ${serialized.length}.`);
        this.delegate.streamDidReceiveChunk(serialized);
        return serialized;
    }
}
