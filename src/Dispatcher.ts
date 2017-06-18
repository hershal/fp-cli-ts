import * as SetOperations from './SetOperations';

export default class Dispatcher {
    /* TODO: this is not fully generalized. E.g. I don't have arguments here... */
    public static execute(program: string, args: string[]): Promise<string[]> {
        const operation = Dispatcher.operationHash[program];

        /* Short-circuit */
        if (!operation) {
            return Promise.reject({
                domain: 'Internal',
                reason: `Could not find ${program} in the set of supported operations.`,
                resolution: 'Either add a new supported operation or change the desired operation to a supported one.',
            });
        }

        const concreteOperation: SetOperations.SetOperation = new operation();
        return operation.run(args);
    }

    private static operationHash: {[key: string]: any} = {
        fcat: SetOperations.Cat,
        funion: SetOperations.Union,
        fxor: SetOperations.XOR
    };

}
