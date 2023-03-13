/*
 * Основным объектом модуля является mutationEventEmitter, представляющий собой
 * eventEmitter, в который поступают события о измененении DOM-дерева.
 * Source: https://github.com/alpinejs/alpine/blob/main/packages/alpinejs/src/mutation.js
 */

import EventEmitter from "eventemitter3";

const observer = new MutationObserver(onMutate);
const mutationEventEmitter = new EventEmitter();
let mutationQueue = [];
let currentlyObserving = false;
let willProcessMutationQueue = false;

function onMutate(mutations) {
    for (const mutation of mutations) {
        if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
                node.nodeType === 1 &&
                    mutationEventEmitter.emit("addNode", node);
            });

            mutation.removedNodes.forEach((node) => {
                node.nodeType === 1 &&
                    mutationEventEmitter.emit("removeNode", node);
            });
        }

        if (mutation.type === "attributes") {
            const el = mutation.target;
            const name = mutation.attributeName;
            const oldValue = mutation.oldValue;

            if (el.hasAttribute(name) && oldValue === null) {
                mutationEventEmitter.emit(
                    "addAttribute",
                    el,
                    name,
                    el.getAttribute(name)
                );
            } else if (el.hasAttribute(name)) {
                const newValue = el.getAttribute(name);
                if (oldValue !== newValue) {
                    mutationEventEmitter.emit(
                        "changeAttribute",
                        el,
                        name,
                        oldValue,
                        newValue
                    );
                }
            } else {
                mutationEventEmitter.emit(
                    "removeAttribute",
                    el,
                    name,
                    oldValue
                );
            }
        }
    }
}

function startObserving() {
    if (currentlyObserving) {
        return
    }

    observer.observe(document, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeOldValue: true,
    });
    currentlyObserving = true;
}

function stopObserving() {
    if (!currentlyObserving) {
        return
    }

    flushObserver();
    observer.disconnect();
    currentlyObserving = false;
}

/**
 * Выполнение модификаций над DOM-деревом, не дёргая MutationObserver.
 * @param {function} callback
 */
function mutateDOM(callback) {
    if (currentlyObserving) {
        stopObserving();
        callback();
        startObserving();
    } else {
        callback();
    }
}

/**
 * Обработка мутаций, находящихся в MutationObserver, после текущего
 * стэка выполнения.
 * Добавление мутаций в массив позволяет вызывать startObserving и stopObserving
 * сколько угодно раз в пределах исполняемого стека задач.
 */
function flushObserver() {
    mutationQueue = mutationQueue.concat(observer.takeRecords());
    if (mutationQueue.length && !willProcessMutationQueue) {
        willProcessMutationQueue = true;
        queueMicrotask(() => {
            processMutationQueue();
            willProcessMutationQueue = false;
        });
    }
}

/**
 * Обработка мутаций, накопившхся в процессе исполняемого стэка задач.
 */
function processMutationQueue() {
    onMutate(mutationQueue);
    mutationQueue.length = 0;
}

export { mutationEventEmitter, startObserving, stopObserving, mutateDOM };
