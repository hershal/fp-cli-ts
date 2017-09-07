export interface ISynchronousOperation {
    /* Parses the arguments in the argument array and sets opaque, internal, and
     * subclass-specific, state of the parsed arguments. */
    parse(args: string[]): Promise<string[][]>;

    /* Run the operation specified from the implemented synchronous operation. */
    run(data: string[][]): Promise<string[]>;
}


export interface IStreamingOperation {
    /* Parses the arguments in the argument array and sets opaque, internal, and
     * subclass-specific, state of the parsed arguments. */
    parse(args: string[]): void;

    /* Run the operation specified from the implemented streaming operation.
     * This function is called per-chunk of received input data. */
    run(data: string): string;
}


export interface IError {
    domain: string;
    reason: string;
    resolution: string;
}


export interface IStreamDelegate {
    /* Called with a chunk when the chunk is received and serialized. */
    streamDidReceiveChunk(chunk: string): void;

    /* Called when all input is done processing. If there is still processed
     * data held in internal buffers, they are flushed to the delegate in
     * `remainingProcessedResults`. */
    streamDidEnd(): void;
}


export interface IStreamHandlerDelegate extends IStreamDelegate {
    /*  Defines the chunk creation trigger. */
    streamChunkTriggerString(): string;
}


export interface IDispatcher {
    outputStreamDelegate?: IStreamDelegate;
    dispatch(operation: any, args: string[]): Promise<any>;
}
