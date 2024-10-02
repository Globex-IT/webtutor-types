export function pop<T>(array: T[]): T | undefined {
    if (array == null)
        throw new Error('"this" is null or undefined');

    const len = ArrayCount(array);
    if (len === 0) {
        return undefined;
    }

    return array[len - 1];
}