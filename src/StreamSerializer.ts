export class StreamSerializerComplete {
    private buffers: Buffer[];

    constructor() {
        this.buffers = [];
    }

    public serialize(data: Buffer) {
        this.buffers.push(data);
    }

    public flush(): Buffer {
        /* Warning: Buffer.concat() is O(n^2) unless you know the exact length
           of the data (we don't).
           https://nodejs.org/api/buffer.html
        */
        const returnValue = Buffer.concat(this.buffers);

        this.buffers = [];
        return returnValue;
    }
}


export class StreamSerializerNewline {
    private buffer: string;

    constructor() {
        /* data left over from any previous data chunk */
        this.buffer = '';
    }

    public serialize(rawData: Buffer, callback: (data: string) => string) {
        const data = rawData.toString().split('\n');

        /* short-circuit */
        if (data.length === 0) {
            return;
        }

        /* prepend the leftover buffer contents to the first datum */
        data[0] = this.buffer + data[0];

        /* chop out the leftover data */
        this.buffer = data.pop();

        for (const idx in data) {
            callback(data[idx]);
        }
    }

    public flush(callback: (data: string) => void) {
        if (this.buffer.length === 0 || this.buffer.indexOf('\n') === 0) {
            /* do nothing */
            return;
        }
        callback(this.buffer);
        this.buffer = '';
    }
}
