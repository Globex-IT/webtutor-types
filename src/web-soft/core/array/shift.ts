export function shift<T>(array: T[]): T | undefined {
    if (array == null)
        throw new Error('"array" is null or undefined');

    const len = ArrayCount(array);
    if (len === 0)
        return undefined;

    const firstElement = array[0];

    for (let i = 1; i < len; i++) {
        array[i - 1] = array[i];
    }

    array[len - 1] = undefined as any;
    array = [];

    return firstElement;
}