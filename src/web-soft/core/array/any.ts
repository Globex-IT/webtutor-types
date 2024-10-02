export function any<T>(array: T[], callback: (value: T, index: number, array: T[]) => boolean): boolean {
    for (let i = 0; i < ArrayCount(array); i++) {
        if (callback(array[i], i, array)) {
            return true;
        }
    }

    return false;
}