import Debug from './Debug';

import * as SetOperations from './SetOperations';
import * as TextOperations from './TextOperations';
import { IOperation, IStreamingOperation, IDispatcher, IStreamDelegate } from './Interfaces';
import { StreamSerializerNewline } from './StreamSerializer';


/* Synchronous Standard Input Dispatcher. */
/* Synchronously processes stdin in its entirety. */
class DispatcherStandardInputSync implements IDispatcher {
    public outputStreamDelegate?: IStreamDelegate;

    constructor(delegate?: IStreamDelegate) {
        this.outputStreamDelegate = delegate;
    }

    public dispatch(operation: IOperation, args: string[]): Promise<string[]> {
        return new Promise((resolve, reject) => {
            operation
                .parse(args)
                .then((data) => operation.run(data))
                .then((results) => {
                    if (this.outputStreamDelegate) {
                        this.outputStreamDelegate.streamDidEnd(results);
                    }
                    resolve(results);
                })
                .catch((error) => reject(error));
        });
    }
}


/* Asynchronous Standard Input Stream Dispatcher. */
/* Asyncronously processes stdin as a stream serialized by line. */
/* If you don't provide a delegate, then the Dispatcher will accumulate output
 * in a buffer until stdin is closed and return the buffer in a Promise.
 * Otherwise, the Dispatcher publishes the output to the delegate. */
class DispatcherStandardInputStream implements IDispatcher {
    public outputStreamDelegate?: IStreamDelegate;
    private serializer: StreamSerializerNewline;
    private debug = Debug('DispatcherStandardInputStream');

    /* This buffer is only used if we don't have a delegate. */
    private buffer: string[];

    constructor(delegate?: IStreamDelegate) {
        this.outputStreamDelegate = delegate;
        this.serializer = new StreamSerializerNewline();
        this.buffer = [];
    }

    public dispatch(operation: IStreamingOperation, args: string[]): Promise<string[]> {
        return new Promise((resolve, reject) => {
            operation.parse(args);

            const callback = (serialized: string): string => {
                this.debug(`Stdin serializer callback called on string of length ${serialized.length}.`);
                const processed = operation.run(serialized);
                if (!this.outputStreamDelegate) {
                    this.buffer.push(processed);
                } else {
                    this.buffer.forEach((l) => this.outputStreamDelegate.streamDidReceiveChunk(l));
                    this.outputStreamDelegate.streamDidReceiveChunk(processed);
                    this.buffer = [];
                }
                return processed;
            };

            process.stdin.on('data', (data: Buffer) => {
                this.debug(`Stdin sent chunk of size ${data.length}.`);
                this.serializer.serialize(data, (serialized) => callback(serialized));
            });

            process.stdin.on('end', () => {
                this.debug(`Stdin ended.`);
                this.serializer.flush((data) => callback(data));

                if (this.outputStreamDelegate) {
                    this.outputStreamDelegate.streamDidEnd([]);
                }

                resolve(this.buffer);
                this.buffer = [];
            });
        });
    }
}


export default class Dispatch {
    private static operationHash: {[key: string]: IOperationHashItem } = {
        cat: {dispatcher: DispatcherStandardInputSync, operation: SetOperations.Cat},
        diff: {dispatcher: DispatcherStandardInputSync, operation: SetOperations.Difference},
        union: {dispatcher: DispatcherStandardInputSync, operation: SetOperations.Union},
        xor: {dispatcher: DispatcherStandardInputSync, operation: SetOperations.XOR},
        split: {dispatcher: DispatcherStandardInputStream, operation: TextOperations.Split},
        trim: {dispatcher: DispatcherStandardInputStream, operation: TextOperations.Trim},
        /* join: {dispIInputStreamDelegaterStandardInputStream, operation: TextOperations.Join} */
    };

    public streamDelegate?: IStreamDelegate;

    constructor(delegate?: IStreamDelegate) {
        this.streamDelegate = delegate;
    }

    public dispatch(program: string, args: string[]): Promise<string[]> {
        const operationSelector = Dispatch.operationHash[program];

        /* Short-circuit */
        if (!operationSelector) {
            return Promise.reject({
                domain: 'Internal',
                reason: `Could not find ${program} in the set of supported operations.`,
                resolution: 'Either add a new supported operation or change the desired operation to a supported one.',
            });
        }

        const operation: IOperation = new operationSelector.operation();
        const dispatcher: IDispatcher = new operationSelector.dispatcher(this.streamDelegate);

        return dispatcher.dispatch(operation, args);
    }
}


interface IOperationHashItem {
     /* HACK: I couldn't get the type system to let me use IDispatcher here.
      * This is a shitty workaround. */
    dispatcher: any;
    operation: any;
}


export class DispatchDelegateConsoleLog implements IStreamDelegate {
    public streamDidReceiveChunk(line: string) {
        /* tslint:disable-next-line */
        console.log(line);
    }

    public streamDidEnd(results: string[]) {
        /* tslint:disable-next-line */
        results.forEach((line) => console.log(line));
    }
}
