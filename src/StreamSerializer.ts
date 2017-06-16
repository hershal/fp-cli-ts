export default class StreamSerializer {
    buffer: string;

    constructor() {
        /* data left over from any previous data chunk */
        this.buffer = '';
    }

    serialize(rawData: any, callback: any) {
        let data = rawData.toString();

        if (data.length > 0) {
            /* prepend the leftover buffer contents to the first datum */
            data[0] = this.buffer + data[0];

            /* chop out the leftover data */
            this.buffer = data.pop();

            for (const idx in data) {
                callback(data[idx]);
            }
        }
    }

    flush(callback: any) {
        if (this.buffer.length == 0 || this.buffer.indexOf('\n') == 0) {
            /* do nothing */
            return;
        }
        callback(this.buffer);
        this.buffer = '';
    }
}
