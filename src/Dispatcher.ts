import Debug from './Debug';

import * as SetOperations from './SetOperations';
import * as TextOperations from './TextOperations';
import { IOperation, IStreamingOperation, IDispatcher, IDispatchDelegate } from './Interfaces';
import { StreamSerializerNewline } from './StreamSerializer';


/* Legacy Dispatcher. */
/* Synchronously processes stdin in its entirety. */
class DispatcherLegacy implements IDispatcher {
    public delegate?: IDispatchDelegate;

    constructor(delegate?: IDispatchDelegate) {
        this.delegate = delegate;
    }

    public dispatch(operation: IOperation, args: string[]): Promise<string[]> {
        return new Promise((resolve, reject) => {
            operation
                .parse(args)
                .then((data) => operation.run(data))
                .then((results) => { if (this.delegate) { this.delegate.didFinish(results); } resolve(results); })
                .catch((error) => reject(error));
        });
    }
}


/* Standard Input Stream Dispatcher. */
/* Asyncronously processes stdin as a stream serialized by line. */
/* If you don't provide a delegate, then the Dispatcher will accumulate output
 * in a buffer until stdin is closed and return the buffer in a Promise.
 * Otherwise, the Dispatcher publishes the output to the delegate. */
class DispatcherStandardInputStream implements IDispatcher {
    public delegate?: IDispatchDelegate;
    private serializer: StreamSerializerNewline;
    private debug = Debug('DispatcherStandardInputStream');

    /* This buffer is only used if we don't have a delegate. */
    private buffer: string[];

    constructor(delegate?: IDispatchDelegate) {
        this.delegate = delegate;
        this.serializer = new StreamSerializerNewline();
        this.buffer = [];
    }

    public dispatch(operation: IStreamingOperation, args: string[]): Promise<string[]> {
        return new Promise((resolve, reject) => {
            operation.parse(args);

            const callback = (serialized: string): string => {
                const processed = operation.run(serialized);
                if (!this.delegate) {
                    this.buffer.push(processed);
                } else {
                    this.buffer.forEach((l) => this.delegate.didFinishLine(l));
                    this.delegate.didFinishLine(processed);
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

                if (this.delegate) {
                    this.delegate.didFinish([]);
                }

                resolve(this.buffer);
                this.buffer = [];
            });
        });
    }
}


export default class Dispatch {
    private static operationHash: {[key: string]: IOperationHashItem } = {
        fcat: {dispatcher: DispatcherLegacy, operation: SetOperations.Cat},
        funion: {dispatcher: DispatcherLegacy, operation: SetOperations.Union},
        fxor: {dispatcher: DispatcherLegacy, operation: SetOperations.XOR},
        fsplit: {dispatcher: DispatcherStandardInputStream, operation: TextOperations.Split},
        /* fjoin: {dispatcher: DispatcherStandardInputStream, operation: TextOperations.Join} */
    };

    public delegate?: IDispatchDelegate;

    constructor(delegate?: IDispatchDelegate) {
        this.delegate = delegate;
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
        const dispatcher: IDispatcher = new operationSelector.dispatcher(this.delegate);

        return dispatcher.dispatch(operation, args);
    }
}


interface IOperationHashItem {
     /* HACK: I couldn't get the type system to let me use IDispatcher here.
      * This is a shitty workaround. */
    dispatcher: any;
    operation: any;
}


export class DispatchDelegateConsoleLog implements IDispatchDelegate {
    public didFinishLine(line: string) {
        /* tslint:disable-next-line */
        console.log(line);
    }

    public didFinish(results: string[]) {
        /* tslint:disable-next-line */
        results.forEach((line) => console.log(line));
    }
}
