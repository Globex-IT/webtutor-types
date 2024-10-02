/**
 * Тип массив в системе WebTutor HCM.
 */
interface Array<T> {
    /**
     * Возвращает количество элементов массива.
     */
    readonly length: number;

    [index: number]: T;

    /**
     * Возвращает индекс передаваемого элемента в массиве.
     * @param {any} element
     */
    indexOf<T>(element: T): number;

    /**
     * Преобразование всех элементов массива в объект String и соединяет их.
     * @param {string} [delimeter] - Разделитель между элементами.
     * @returns {string}
     * @example arrayobj.join(delimeter)
     */
    join(delimeter: string): string;

    /**
     * Добавляет элементы в конец массива.
     * Добавляет элементы, начиная с текущей длинны length и возвращает новую, увеличенную длунну массива.
     * @param {any} element - Аргумент который следует добавить в массив. Обязательный.
     * @param {...args} аргументы - Которые следует добавить в массив. Необязательный.
     * @returns {number}
     */
    push(...args: T[]): number;

    /**
     * Удаляет часть массива.
     * @param index - Индекс в массив, с которого нужно начинать удаление.
     * @param number - Количество элементов, которое нужно удалить, начиная с индеса arg1.
     */
    splice(index: number, number: number): void;

    map<U>(callback: (item: T, index: number, array: T[]) => U): U[];

    filter<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: any): S[];

    filter(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): T[];

    some(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): boolean;

    any<T>(array: T[], predicate: (value: T, index: number, array: T[]) => boolean): boolean;

    reduce(callback: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T): T;

    reduce(callback: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T): T;

    reduce<U>(callback: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;

    includes(value: T, fromIndex?: number): boolean;

    find(predicate: (value: T, index: number, obj: T[], thisArg?: any) => boolean, thisArg?: any): T | undefined;

    pop(): T | undefined;
}

interface ArrayConstructor {
    new(...arg: unknown[]): unknown[];

    (...arg: unknown[]): unknown[];
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
declare const Array: ArrayConstructor;
