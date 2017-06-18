import * as SetOperations from './SetOperations';
import { IDispatcherResults, ISetOperation } from './Interfaces';

export default class Dispatcher {
    /* TODO: this is not fully generalized. E.g. I don't have arguments here... */
    public static execute(program: string, data: string[][]): IDispatcherResults {
        const operation = Dispatcher.operationHash[program];

        /* Short-circuit */
        if (!operation) {
            return {results: [], error: {
                domain: 'internal',
                reason: `Could not find ${program} in the set of supported operations.`,
                resolution: 'Either add a new supported operation or change the desired operation to a supported one.',
            }};
        }

        const concreteOperation: ISetOperation = new operation();
        return {results: concreteOperation.run(data)};
    }

    private static operationHash: {[key: string]: any} = {
        fcat: SetOperations.Cat,
        funion: SetOperations.Union,
        fxor: SetOperations.XOR
    };

}
