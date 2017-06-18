import * as SetOperations from './SetOperations';
import { IOperation } from './Interfaces';


export default class Dispatcher {
    /* TODO: this is not fully generalized. E.g. I don't have arguments here... */
    public static dispatch(program: string, args: string[]): Promise<string[]> {
        const operationSelector = Dispatcher.operationHash[program];

        /* Short-circuit */
        if (!operationSelector) {
            return Promise.reject({
                domain: 'Internal',
                reason: `Could not find ${program} in the set of supported operations.`,
                resolution: 'Either add a new supported operation or change the desired operation to a supported one.',
            });
        }

        const operation: IOperation = new operationSelector();

        return new Promise((resolve, reject) => {
            operation
                .parse(args)
                .then((data) => operation.run(data))
                .then((results) => resolve(results))
                .catch((error) => reject(error))
        })
    }

    private static operationHash: {[key: string]: any} = {
        fcat: SetOperations.Cat,
        funion: SetOperations.Union,
        fxor: SetOperations.XOR
    };

}
