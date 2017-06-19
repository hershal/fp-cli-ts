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


export interface IDispatchDelegate {
    /* Called when a line is processed, given by `processedLine`. */
    didFinishLine(processedLine: string): void;

    /* Called when all input is done processing. If there is still processed
     * data held in internal buffers, they are flushed to the delegate in
     * `remainingProcessedResults`. */
    didFinish(remainingProcessedResults: string[]): void;
}


export interface IDispatcher {
    delegate?: IDispatchDelegate;
    dispatch(operation: any, args: string[]): Promise<any>;
}
