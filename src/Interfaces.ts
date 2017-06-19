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


export interface IDispatcher {
    dispatch(operation: any, args: string[]): Promise<any>;
}
