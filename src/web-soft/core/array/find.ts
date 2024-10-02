export function find<T>(array: T[], predicate: (value: T, index: number, obj: T[], thisArg?: any) => boolean, thisArg?: any): T | undefined {
    if (array == null)
        throw new Error('"this" is null or undefined');

    const len = ArrayCount(array);

    for (let k = 0; k < len; k++) {
        const value = array[k];
        if (predicate(value, k, array, thisArg))
            return value;
    }

    return undefined;
}