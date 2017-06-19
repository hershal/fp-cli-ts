import * as debugImport from 'debug';

export default function Debug(aNamespace: string) {
    const debugWrapper = function (...args: any[]): any {
        return debugImport(`fp-cli:${aNamespace}`).apply(null, args);
    }

    return debugWrapper;
}
