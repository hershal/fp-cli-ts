import Debug from './Debug';

import * as SetOperations from './SetOperations';
import * as TextOperations from './TextOperations';
import { ISynchronousOperation, IStreamingOperation,
         IDispatcher, IStreamDelegate,
         IStreamHandlerDelegate, IError } from './Interfaces';
import { StreamHandler } from './StreamHandler';


/* Synchronous Standard Input Dispatcher. */
/* Synchronously processes stdin in its entirety. */
export class DispatcherStandardInputSync implements IDispatcher {
    public outputStreamDelegate?: IStreamDelegate;

    constructor(delegate?: IStreamDelegate) {
        this.outputStreamDelegate = delegate;
    }

    public dispatch(operation: ISynchronousOperation, args: string[]): Promise<string[]> {
        return new Promise((resolve, reject) => {
            operation
                .parse(args)
                .then((data) => operation.run(data))
                .then((results) => {
                    if (this.outputStreamDelegate) {
                        results.forEach((chunk: string) =>
                                        this.outputStreamDelegate.streamDidReceiveChunk(chunk));
                        this.outputStreamDelegate.streamDidEnd();
                    }
                    resolve(results);
                })
                .catch((error: string) => reject(error));
        });
    }
}


/* Asynchronous Standard Input Stream Dispatcher. */
/* Asyncronously processes stdin as a stream serialized by line. */
/* If you don't provide a delegate, then the Dispatcher will accumulate output
 * in a buffer until stdin is closed and return the buffer in a Promise.
 * Otherwise, the Dispatcher publishes the output to the delegate. */
export class DispatcherStandardInputStream implements IDispatcher, IStreamHandlerDelegate {
    public outputStreamDelegate: IStreamDelegate;

    private streamHandler: StreamHandler;
    private debug = Debug('DispatcherStandardInputStream');

    private resolveCallback?: () => void;
    private rejectCallback?: (error: IError) => void;
    private operation?: IStreamingOperation;
    private inputStream: any;

    constructor(outputStreamDelegate?: IStreamDelegate, inputStream: any = process.stdin) {
        this.outputStreamDelegate = outputStreamDelegate;
        this.streamHandler = new StreamHandler();
        this.streamHandler.delegate = this;
        this.inputStream = inputStream;

        this.debug('Created with Output Stream Delegate: %o', outputStreamDelegate);
    }

    public dispatch(operation: IStreamingOperation, args: string[]): Promise<void> {
        /* Error handling */
        if (this.operation) {
            return Promise.reject({
                domain: 'API',
                reason: 'There is currently an operation this dispatcher is ' +
                    'handling. A dispatcher cannot dispatch multiple operations at a time.',
                resolution: 'Please instantiate another dispatcher to dispatch ' +
                    'another operation.'
            });
        }
        if (this.rejectCallback || this.resolveCallback) {
            return Promise.reject({
                domain: 'Internal',
                reason: 'There is a dangling Promise that this dispatcher is ' +
                    'holding but has not fulfilled, even though the operation is ' +
                    'not running. This is an internal error.',
                resolution: `Please debug me. RejectCallback: ${this.rejectCallback} ` +
                    `ResolveCallback: ${this.resolveCallback}.`
            });
        }

        this.operation = operation;
        return new Promise<void>((resolve, reject) => {
            this.resolveCallback = resolve;
            this.rejectCallback = reject;
            operation.parse(args);
            this.streamHandler.once(this.inputStream);
        });
    }

    public streamChunkTriggerString() {
        /* TODO: wire this to the operation... somehow. */
        return '\n';
    }

    public streamDidReceiveChunk(chunk: string) {
        const processed = this.operation.run(chunk);
        this.outputStreamDelegate.streamDidReceiveChunk(processed);
    }

    public streamDidEnd() {
        this.outputStreamDelegate.streamDidEnd();
        this.resolveCallback();
        this.resolveCallback = undefined;
        this.rejectCallback = undefined;
        this.operation = undefined;
    }
}


export default class Dispatch {
    private static operationHash: {[key: string]: IOperationHashItem } = {
        concat: {dispatcher: DispatcherStandardInputSync, operation: SetOperations.Concatenate},
        diff: {dispatcher: DispatcherStandardInputSync, operation: SetOperations.Difference},
        union: {dispatcher: DispatcherStandardInputSync, operation: SetOperations.Union},
        xor: {dispatcher: DispatcherStandardInputSync, operation: SetOperations.XOR},
        split: {dispatcher: DispatcherStandardInputStream, operation: TextOperations.Split},
        trim: {dispatcher: DispatcherStandardInputStream, operation: TextOperations.Trim},
        cat: {dispatcher: DispatcherStandardInputStream, operation: TextOperations.Cat},
        /* join: {dispIInputStreamDelegaterStandardInputStream, operation: TextOperations.Join} */
    };
    public streamDelegate?: IStreamDelegate;

    private debug = Debug('Dispatch');

    constructor(delegate?: IStreamDelegate) {
        if (!delegate) {
            this.streamDelegate = new DispatchDelegateConsoleLog();
            this.debug('Stream delegate not given, installing ConsoleLog StreamDelegate');
        } else {
            this.streamDelegate = delegate;
            this.debug('Installing custom Stream Delegate');
        }
        this.debug('Created with Stream Delegate: %o', this.streamDelegate);
    }

    public dispatch(program: string, args: string[]): Promise<string[]> {
        const operationSelector = Dispatch.operationHash[program];

        /* Short-circuit */
        if (!operationSelector) {
            return Promise.reject({
                domain: 'Internal',
                reason: `Could not find ${program} in the set of supported` +
                    ` operations.`,
                resolution: 'Either add a new supported operation or change ' +
                    'the desired operation to a supported one.',
            });
        }

        const operation: ISynchronousOperation = new operationSelector.operation();
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
    private debug = Debug('DispatchDelegateConsoleLog');

    public streamDidReceiveChunk(line: string) {
        this.debug('streamDidReceiveChunk: %o', line);
        /* tslint:disable-next-line */
        console.log(line);
    }

    public streamDidEnd() {
        this.debug('streamDidEnd');
        /* nothing to do here */
    }
}
