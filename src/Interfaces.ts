export interface IOperation {
    parse(args: string[]): Promise<string[][]>;
    run(data: string[][]): Promise<string[]>;
}

export interface IError {
    domain: string;
    reason: string;
    resolution: string;
}
