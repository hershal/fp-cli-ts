export interface IOperation {
    parse(args: string[]): Promise<string[][]>;
    run(data: string[][]): Promise<string[]>;
}


export interface IStreamingOperation {
    parse(args: string[]): void;
    run(data: string, callback: (data: string) => void): void;
}


export interface IError {
    domain: string;
    reason: string;
    resolution: string;
}
