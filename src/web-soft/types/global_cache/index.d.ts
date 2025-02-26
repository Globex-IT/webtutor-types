interface GlobalCache {
    /**
     * Устанавливает значение записи с заданным ключом.
     * @param {string} keyName - Имя ключа.
     * @param {any} value - Значение записи.
     **/
    SetEntry(keyName: string, value: any): void;

    /**
     * Устанавливает значение записи с заданным ключом.
     * @param {string} keyName - Имя ключа.
     * @param {any} value - Значение записи.
     * @param {any} options - Базовый объект, содержащий опции. Поддерживаются следущие опции: TTL - время жизни записи в секундах.
     **/
    SetEntry(keyName: string, value: any, options: any): void;

    /**
     * Возвращает значение записи с заданным ключом. Если запись не найдена, возвращает undefined.
     * @param {string} keyName - Имя ключа.
     **/
    GetEntry(keyName: string): any;

    /** Удаляет запись с заданным ключом. Если запись отсутствует, ничего не делается.
     * @param {string} keyName - Имя ключа.
     **/
    DeleteEntry(keyName: string): void;
}

declare const GlobalCache: GlobalCache;