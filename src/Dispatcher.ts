import Debug from './Debug';

import * as SetOperations from './SetOperations';
import * as TextOperations from './TextOperations';
import { ISynchronousOperation, IStreamingOperation, IDispatcher, IStreamDelegate } from './Interfaces';
import { StreamSerializerNewline } from './StreamSerializer';


export default class Dispatch {
    public streamDelegate?: IStreamDelegate;

    constructor(delegate?: IStreamDelegate) {
        this.streamDelegate = delegate;
    }

    public dispatch(program: string, args: string[]): Promise<string[]> {
        let operation: IStreamingOperation;
        switch(program) {
        case 'split': operation = new TextOperations.Split; break;
        case 'trim': operation = new TextOperations.Trim; break;
        default:
            return Promise.reject({
                domain: 'Internal',
                reason: `Could not find ${program} in the set of supported operations.`,
                resolution: 'Either add a new supported operation or change the '
                    + 'desired operation to a supported one.',
            });
        }

        operation.parse(args);

        /* 1. harness stdin, if necessary */
        /* 2. funnel stdin to the operation */

        /* Considerations:
           1. not all operations use stdin
           2. operations may also need to read files


           I need to wrap the operations in a class which handles streaming or
           synchronous operations.

           Can I handle synchronous operations in the same way I handle
           streaming operations? It's not clear it's worth the extra work. I
           would have to asynchronously add to the data stuctures as input comes
           in, wait until all streams finish (sync lock), and then perform the
           operation. If I wanted to do this completely async without the sync
           lock, then I would have to write my own xor, cat, diff, union, etc
           routines instead of using lodash's. This would get complicated and
           involves a lot of work. I don't know where to start and doesn't have
           the !/$ to justify the complexity. It's probably better to get this
           structure working well for the streaming operations first and have a
           different codepath for the synchronous lodash-like operations. This
           is not ideal, but would work. GRRRR.
         */
    }
}


export class DispatchDelegateConsoleLog implements IStreamDelegate {
    public streamDidReceiveChunk(line: string) {
        /* tslint:disable-next-line */
        console.log(line);
    }

    public streamDidEnd() {
        /* nothing to do here */
    }
}
