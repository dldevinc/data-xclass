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
    return arr1.filter((x) => !arr2.includes(x));
}

/**
 * Удаление элемента из массива.
 * @param {*[]} array
 * @param {*} item
 */
export function removeFromArray(array, item) {
    for (let i = array.length - 1; i >= 0; i--) {
        if (array[i] === item) {
            array.splice(i, 1);
        }
    }
}

/**
 * Вызов события на DOM-элементе.
 * @param {Node, Document} el
 * @param {string} name
 * @param {Object} detail
 */
export function dispatch(el, name, detail = {}) {
    el.dispatchEvent(
        new CustomEvent(name, {
            detail,
            bubbles: true,
            // Allows events to pass the shadow DOM barrier.
            composed: true,
            cancelable: true,
        })
    );
}
