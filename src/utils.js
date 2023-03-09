/**
 * Разделение строки по пробельным символам и удаление дубликатов.
 * @param {string} value
 * @returns {string[]}
 */
export function splitAndRemoveDuplicates(value) {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
        return [];
    }

    return trimmedValue.split(/\s+/).filter((value, index, self) => {
        return self.indexOf(value) === index;
    });
}

/**
 * Возвращает разность двух множеств, представленных в виде массивов.
 * @param {string[]} arr1
 * @param {string[]} arr2
 */
export function arrayDifference(arr1, arr2) {
    return arr1.filter(x => !arr2.includes(x));
}
