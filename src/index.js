import {
    mutationEventEmitter,
    startObserving,
    stopObserving,
    mutateDOM,
} from "./mutation.js";
import {
    arrayDifference,
    dispatch,
    removeFromArray,
    splitAndRemoveDuplicates,
} from "./utils.js";

const ATTRIBUTE_NAME = "data-xclass";
const SELECTOR = `[${ATTRIBUTE_NAME}]`;
const APPLIED_WIDGETS_PROPERTY_NAME = "_xclass_applied";
let isFirstStart = true;

/**
 * @typedef widgetObject
 * @property {function(element: HTMLElement, self: widgetObject)} [init]
 * @property {function(element: HTMLElement, self: widgetObject)} [destroy]
 * @property {function(self: widgetObject)} [onRegister]
 * @property {string[]} [dependencies]
 */

const XClass = {
    _registered: new Map(),
    mutateDOM,

    start() {
        if (!document.body) {
            console.warn(
                "XClass Warning: Unable to initialize. " +
                    "Trying to load XClass before `<body>` is available. " +
                    "Did you forget to add `defer` in XClass's `<script>` tag?",
            );
        }

        startObserving();

        if (isFirstStart) {
            isFirstStart = false;

            mutationEventEmitter
                .on("addNode", async (node) => await this.initTree(node))
                .on("removeNode", async (node) => await this.destroyTree(node))
                .on("addAttribute", async (node, name, value) => {
                    if (name === ATTRIBUTE_NAME) {
                        const widgetsToApply = splitAndRemoveDuplicates(value);
                        await this._initWidget(node, ...widgetsToApply);
                    }
                })
                .on("changeAttribute", async (node, name, oldValue, newValue) => {
                    if (name === ATTRIBUTE_NAME) {
                        const oldValueItems = splitAndRemoveDuplicates(oldValue);
                        const newValueItems = splitAndRemoveDuplicates(newValue);
                        const widgetsToApply = arrayDifference(
                            newValueItems,
                            oldValueItems,
                        );
                        const widgetsToRemove = arrayDifference(
                            oldValueItems,
                            newValueItems,
                        );

                        await this._destroyWidget(node, ...widgetsToRemove);
                        await this._initWidget(node, ...widgetsToApply);
                    }
                })
                .on("removeAttribute", async (node, name, oldValue) => {
                    if (name === ATTRIBUTE_NAME) {
                        const widgetsToRemove = splitAndRemoveDuplicates(oldValue);
                        await this._destroyWidget(node, ...widgetsToRemove);
                    }
                });

            this.initTree()
            .then(() => {
                dispatch(document, "xclass:initialized");
            });
        }
    },

    stop() {
        stopObserving();
    },

    /**
     * Регистрация нового виджета под указанным именем.
     * @param {string} name
     * @param {widgetObject} widgetObject
     */
    register(name, widgetObject) {
        if (this._registered.has(name)) {
            throw new Error(`Widget "${name}" is already registered.`);
        }

        this._registered.set(name, widgetObject);

        const onRegisterMethod = widgetObject["onRegister"];
        onRegisterMethod && onRegisterMethod.call(widgetObject, widgetObject);

        dispatch(document, "xclass:registered", {
            name: name,
            widgetObject: widgetObject,
        });
    },

    /**
     * Проверка применён ли виджет к указанному элементу.
     * @param {HTMLElement} element
     * @param {string} name
     * @returns {boolean}
     */
    isWidgetApplied(element, name) {
        const appliedWidgets = element[APPLIED_WIDGETS_PROPERTY_NAME];
        return Array.isArray(appliedWidgets) && appliedWidgets.includes(name);
    },

    /**
     * Применение виджета(-ов) к элементу.
     * @param {HTMLElement} element
     * @param {string} names
     */
    addWidget(element, ...names) {
        const attributeValue = element.getAttribute(ATTRIBUTE_NAME) || "";
        const attributeItems = splitAndRemoveDuplicates(attributeValue);

        const promises = names.map((name) => {
            if (this.isWidgetApplied(element, name)) {
                console.warn(
                    `Widget "${name}" has already been applied to this element.`,
                );
                return Promise.resolve();
            }

            attributeItems.push(name);
            return this._initWidget(element, name);
        });

        Promise.allSettled(promises).then(() => {
            mutateDOM(() => {
                if (attributeItems.length) {
                    element.setAttribute(ATTRIBUTE_NAME, attributeItems.join(" "));
                } else {
                    element.removeAttribute(ATTRIBUTE_NAME);
                }
            });
        });
    },

    /**
     * Освобождение ресурсов виджета(-ов), применённого к элементу.
     * @param {HTMLElement} element
     * @param {string} names
     */
    deleteWidget(element, ...names) {
        const attributeValue = element.getAttribute(ATTRIBUTE_NAME) || "";
        const attributeItems = splitAndRemoveDuplicates(attributeValue);

        const promises = names.map((name) => {
            if (!this.isWidgetApplied(element, name)) {
                console.warn(
                    `Widget "${name}" was not applied to this element.`,
                );
                return Promise.resolve();
            }

            removeFromArray(attributeItems, name);
            return this._destroyWidget(element, name);
        });

        Promise.allSettled(promises).then(() => {
            mutateDOM(() => {
                if (attributeItems.length) {
                    element.setAttribute(ATTRIBUTE_NAME, attributeItems.join(" "));
                } else {
                    element.removeAttribute(ATTRIBUTE_NAME);
                }
            });
        });
    },

    /**
     * Удаление всех виджетов, привязанных к элементу.
     * @param {HTMLElement} element
     */
    deleteAllWidgets(element) {
        this._destroyAllFromAttribute(element)
        .then(() => {
            mutateDOM(() => {
                element.removeAttribute(ATTRIBUTE_NAME);
            });
        });
    },

    /**
     * Ищет ближайший родительский элемент, к которому применён указанный виджет.
     * @param {HTMLElement} element
     * @param {string} name
     * @returns {HTMLElement|null}
     */
    findClosest(element, name) {
        let current = element;
        while (1) {
            if (this.isWidgetApplied(current, name)) {
                return current;
            } else if (!(current = current.parentElement)) {
                return null;
            }
        }
    },

    /**
     * Ищет первый дочерний элемент, к которому применён указанный виджет.
     * @param {Node|Document} root
     * @param {string} name
     * @returns {HTMLElement|null}
     */
    find(root, name) {
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_ELEMENT,
            null,
            false,
        );

        let node;
        while ((node = walker.nextNode())) {
            if (this.isWidgetApplied(node, name)) {
                return node;
            }
        }

        return null;
    },

    /**
     * Ищет все дочерние элементы, к которым применён указанный виджет.
     * @param {Node|Document} root
     * @param {string} name
     * @returns {HTMLElement[]}
     */
    findAll(root, name) {
        const result = [];
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_ELEMENT,
            null,
            false,
        );

        let node;
        while ((node = walker.nextNode())) {
            if (this.isWidgetApplied(node, name)) {
                result.push(node);
            }
        }
        return result;
    },

    /**
     * Применение виджетов в поддереве элемента root.
     * @param {HTMLElement|Document} [root=document.documentElement]
     * @return {Promise}
     */
    async initTree(root = document.documentElement) {
        if (root.nodeType === document.ELEMENT_NODE && root.matches(SELECTOR)) {
            await this._applyAllFromAttribute(root);
        }

        const promises = Array.from(root.querySelectorAll(SELECTOR)).map((node) => {
            return this._applyAllFromAttribute(node);
        });
        await Promise.allSettled(promises);
    },

    /**
     * Удаление всех виджетов в поддереве элемента root.
     * @param {HTMLElement|Document} [root=document.documentElement]
     * @return {Promise}
     */
    async destroyTree(root = document.documentElement) {
        if (root.nodeType === document.ELEMENT_NODE && root.matches(SELECTOR)) {
            await this._destroyAllFromAttribute(root);
        }

        const promises = Array.from(root.querySelectorAll(SELECTOR)).map((node) => {
            return this._destroyAllFromAttribute(node);
        });
        await Promise.allSettled(promises);
    },

    // =================================================================================
    //   Private methods
    // =================================================================================

    /**
     * Получение списка имён виджетов, которые применены к данному элементу.
     * @param {HTMLElement} element
     * @returns {string[]}
     * @private
     */
    _getAppliedWidgets(element) {
        let appliedWidgets = element[APPLIED_WIDGETS_PROPERTY_NAME];
        if (!Array.isArray(appliedWidgets)) {
            element[APPLIED_WIDGETS_PROPERTY_NAME] = appliedWidgets = [];
        }
        return appliedWidgets;
    },

    /**
     * Иницаилизация виджета(-ов) на заданном элементе.
     * Если виджет не зарегистрирован или уже применён - он пропускается.
     * @param {HTMLElement} element
     * @param {string} names
     * @return {Promise}
     * @private
     */
    _initWidget(element, ...names) {
        const appliedWidgets = this._getAppliedWidgets(element);

        const promises = [];
        names.forEach((name) => {
            if (!this._registered.has(name)) {
                console.debug(`Widget "${name}" is not registered.`);
                return;
            }

            const widgetObject = this._registered.get(name);
            if (appliedWidgets.includes(name)) {
                return;
            }

            if (Array.isArray(widgetObject.dependencies)) {
                widgetObject.dependencies.forEach((depName) => {
                    promises.push(this._initWidget(element, depName));
                });
            }

            let initResult;
            if (widgetObject.init) {
                initResult = widgetObject.init(element, widgetObject);
            }
            appliedWidgets.push(name);

            if (initResult instanceof Promise) {
                promises.push(
                    initResult.then(() => {
                        dispatch(element, "xclass:init-widget", {
                            name: name,
                            widgetObject: widgetObject,
                        });
                    })
                );
            } else {
                dispatch(element, "xclass:init-widget", {
                    name: name,
                    widgetObject: widgetObject,
                });
            }
        });

        return Promise.allSettled(promises);
    },

    /**
     * Освобождение ресурсов виджета(-ов) для заданного элемента.
     * Если виджет не зарегистрирован или не применён - он пропускается.
     * @param {HTMLElement} element
     * @param {string} names
     * @return {Promise}
     * @private
     */
    _destroyWidget(element, ...names) {
        const appliedWidgets = this._getAppliedWidgets(element);

        const promises = [];
        names.forEach((name) => {
            if (!this._registered.has(name)) {
                console.debug(`Widget "${name}" is not registered.`);
                return;
            }

            const widgetObject = this._registered.get(name);
            if (!appliedWidgets.includes(name)) {
                return;
            }

            let destroyResult;
            if (widgetObject.destroy) {
                destroyResult = widgetObject.destroy(element, widgetObject);
            }

            removeFromArray(appliedWidgets, name);

            if (destroyResult instanceof Promise) {
                promises.push(
                    destroyResult.then(() => {
                        dispatch(element, "xclass:destroy-widget", {
                            name: name,
                            widgetObject: widgetObject,
                        });
                    })
                );
            } else {
                dispatch(element, "xclass:destroy-widget", {
                    name: name,
                    widgetObject: widgetObject,
                });
            }

            if (Array.isArray(widgetObject.dependencies)) {
                widgetObject.dependencies.reverse().forEach((depName) => {
                    promises.push(this._destroyWidget(element, depName));
                });
            }
        });

        return Promise.allSettled(promises);
    },

    /**
     * Применение всех виджетов из атрибута.
     * Поскольку _initWidget пропускает виджеты, которые уже применены,
     * данный метод является идемпотентным.
     * @param {HTMLElement} element
     * @return {Promise}
     * @private
     */
    async _applyAllFromAttribute(element) {
        const attributeValue = element.getAttribute(ATTRIBUTE_NAME) || "";
        const widgetsToApply = splitAndRemoveDuplicates(attributeValue);
        await this._initWidget(element, ...widgetsToApply);
    },

    /**
     * Освобождение ресурсов всех виджетов из атрибута.
     * Поскольку _destroyWidget пропускает виджеты, которые не применены,
     * данный метод является идемпотентным.
     * @param {HTMLElement} element
     * @return {Promise}
     * @private
     */
    async _destroyAllFromAttribute(element) {
        const attributeValue = element.getAttribute(ATTRIBUTE_NAME) || "";
        const widgetsToRemove = splitAndRemoveDuplicates(attributeValue);
        await this._destroyWidget(element, ...widgetsToRemove);
    },
};

export default XClass;
