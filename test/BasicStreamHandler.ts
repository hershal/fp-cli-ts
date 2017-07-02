import { IStreamHandlerDelegate } from '../src/Interfaces'

export class BasicStreamHandlerDelegate implements IStreamHandlerDelegate {
    public streamSerializationString: string;
    public buffer: string[];

    constructor() {
        this.buffer = [];

        /* Default */
        this.streamSerializationString = '\n';
    }

    /* Delegate methods */
    public streamChunkTriggerString(): string {
        return this.streamSerializationString;
    }

    public streamDidReceiveChunk(chunk: string) {
        this.buffer.push(chunk);
    }

    public streamDidEnd() { }
}
