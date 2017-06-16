export interface ISetOperation {
    run(data: string[][]): string[];
}

export interface IFunctionalOperation {
    run(input: string[], code: string): string[];
}

export interface IError {
    domain: string;
    reason: string;
    resolution: string;
}

export interface IDispatcherResults {
    error?: IError;
    results: string[];
}
