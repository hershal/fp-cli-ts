import StreamSerializer from './StreamSerializer';

class ArgumentParser {
    static parse(argv: string[]): string[] {
        if (process.stdin.isTTY) {
            return argv;
        }


        let serializer = new StreamSerializer();
        process.stdin.on('data', function () {
            serializer.serialize(data,)
        })

        return [''];
    }
}
