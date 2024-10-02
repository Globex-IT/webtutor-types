export function map<T, U>(array: T[], callback: (value: T, index: number, array: T[]) => U): U[] {
    const result: U[] = [];

    for (let i = 0; i < ArrayCount(array); i++) {
        result.push(callback(array[i], i, array));
    }

    return result;
}