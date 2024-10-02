export function includes<T>(array: T[], value: T, fromIndex: number = 0): boolean {
    if (array == null)
        throw new Error('"array" is null or undefined');

    const len = ArrayCount(array);
    if (len === 0)
        return false;

    let startIdx = fromIndex >= 0 ? fromIndex : len + fromIndex;
    if (startIdx < 0)
        startIdx = 0;

    for (let i = startIdx; i < len; i++) {
        if (array[i] === value)
            return true;
    }

    return false;
}