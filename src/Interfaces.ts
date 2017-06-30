export interface IOperation {
    parse(args: string[]): Promise<string[][]>;
    run(data: string[][]): Promise<string[]>;
}


export interface IStreamingOperation {
    parse(args: string[]): void;
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
    streamChunkTrigger(): string;
}


export interface IDispatcher {
    outputStreamDelegate?: IStreamDelegate;
    dispatch(operation: any, args: string[]): Promise<any>;
}
