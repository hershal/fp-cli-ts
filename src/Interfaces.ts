export interface SetOperation {
    run(first: [string], rest: [[string]]): [string];
}

export interface FunctionalOperation {
    run(input: [string], code: string): [string];
}
