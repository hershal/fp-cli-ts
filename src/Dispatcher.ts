import Debug from './Debug';

import * as SetOperations from './SetOperations';
import { IOperation, IStreamingOperation, IDispatcher } from './Interfaces';
import { StreamSerializerNewline } from './StreamSerializer';


class DispatcherLegacy implements IDispatcher {
    public dispatch(operation: IOperation, args: string[]): Promise<any> {

        return new Promise((resolve, reject) => {
            operation
                .parse(args)
                .then((data) => operation.run(data))
                .then((results) => resolve(results))
                .catch((error) => reject(error));
        });
    }
}


class DispatcherStandardInputStream implements IDispatcher {
    private serializer: StreamSerializerNewline;
    private debug = Debug('DispatcherStandardInputStream');

    constructor() {
        this.serializer = new StreamSerializerNewline();
    }

    public dispatch(operation: IStreamingOperation, args: string[]): Promise<any> {
        return new Promise((resolve, reject) => {
            operation.parse(args);

            process.stdin.on('data', (data: Buffer) => {
                this.debug(`Stdin sent chunk of size ${data.length}.`);
                this.serializer.serialize(data, operation.run);
            });

            process.stdin.on('end', () => {
                this.debug(`Stdin ended.`);
                this.serializer.flush(operation.run);
                resolve();
            });
        });
    }
}


export default class Dispatch {
    /* TODO: this is not fully generalized. E.g. I don't have arguments here... */
    public static dispatch(program: string, args: string[]): Promise<string[]> {
        const operationSelector = Dispatch.operationHash[program];

        /* Short-circuit */
        if (!operationSelector) {
            return Promise.reject({
                domain: 'Internal',
                reason: `Could not find ${program} in the set of supported operations.`,
                resolution: 'Either add a new supported operation or change the desired operation to a supported one.',
            });
        }

        const operation: IOperation = new operationSelector.operation();
        const dispatcher: IDispatcher = new operationSelector.dispatcher();

        return dispatcher.dispatch(operation, args);
    }

    private static operationHash: {[key: string]: IOperationHashItem } = {
        fcat: {dispatcher: DispatcherLegacy, operation: SetOperations.Cat},
        funion: {dispatcher: DispatcherLegacy, operation: SetOperations.Union},
        fxor: {dispatcher: DispatcherLegacy, operation: SetOperations.XOR},
        /* fsplit: {dispatcher: DispatcherStandardInputStream, operation: TextOperations.Split}, */
        /* fjoin: {dispatcher: DispatcherStandardInputStream, operation: TextOperations.Join} */
    };
}

interface IOperationHashItem {
     /* HACK: I couldn't get the type system to let me use IDispatcher here.
      * This is a shitty workaround. */
    dispatcher: any;
    operation: any;
}
