export function reduce<T, U>(array: T[], reducer: (accumulator: U, currentValue: T) => U, initialValue: U): U {
    if (ArrayCount(array) === 0) {
        return initialValue;
    }

    let accumulator = initialValue;
    for (let i = 0; i < ArrayCount(array); i++) {
        const element = array[i];
        accumulator = reducer(accumulator, element);
    }

    return accumulator;
}