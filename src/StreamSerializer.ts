export default class StreamSerializer {
    private buffers: Buffer[];

    constructor() {
        this.buffers = [];
    }

    public serialize(data: Buffer) {
        this.buffers.push(data);
    }

    public flush(data?: Buffer): Buffer {
        if (data) { this.buffers.push(data); }

        /* Warning: Buffer.concat() is O(n^2) unless you know the exact length
           of the data (we don't).

           https://nodejs.org/api/buffer.html
         */
        const returnValue = Buffer.concat(this.buffers);

        this.buffers = [];
        return returnValue;
    }
}
