# data-xclass

This is a lightweight library that is designed to make applying widgets to old-school 
SSR applications. It works by letting you add the names of the widgets you want 
to use in the `data-xclass` attribute.

## Installation

```
npm install data-xclass
```

## Quick Start

Creating a simple widget:

```js
import XClass from "data-xclass";

// Регистрация виджета "red-class"
XClass.register("red-class", {
    // Инициализация виджета на DOM-элементе.
    init: function (element) {
        element.classList.add("red");
    },

    // Освобождение ресурсов виджета.
    destroy: function (element) {
        element.classList.remove("red");
    }
});
```

В приведённом выше коде мы регистрируем виджет `red-class`, который будет добавлять
класс `red` к любому DOM-элементу, для которого он будет инициализирован.

Для того, чтобы инициализировать виджет на опредлённом DOM-элементе, нужно добавить 
этому элементу атрибут `data-xclass` с именем виджета:

```html
<div data-xclass="red-class">This div will have a red class</div>
```

> Вы можете перечислить несколько виджетов в атрибуте `data-xclass`,
> разделяя их пробелами.

Чтобы инициализировать виджеты для всех элементов на странице, нужно вызвать метод
`XClass.start()`.

```js
import XClass from "data-xclass";

window.addEventListener("DOMContentLoaded", () => {
    XClass.start();
});
```

Этот метод произведёт поиск DOM-элементов с атрибутом `data-xclass` и
инициализирует на них соответствующие виджеты. Помимо этого, он будет
отслеживать изменение DOM-дерева и инициализировать виджеты на новых
DOM-элементах.

Удаление виджета с DOM-элемента произойдёт при одном из четырёх событий:

1. Изменение содержимого атрибута `data-xclass`.
2. Удаление атрибута `data-xclass`.
3. Удаление элемента из DOM-дерева.
4. Вызов метода `Huacaya.deleteWidget(element, "red-class")`.

## API

### Huacaya.register(name, widgetObject)

Регистрация виджета.

**Параметры:**

-   `name` - Имя виджета.
-   `widgetObject` - Объект виджета. Он может содержать следующие свойства:
    -   `onRegister(self)` - Функция, вызываемая при регистрации виджета.
    -   `init(element, self)` - Функция инициализации виджета на DOM-элементе.
    -   `destroy(element, self)` - Функция освобождения ресурсов виджета.
    -   `dependencies` - Массив зависимостей виджета, которые должны быть
        инициализированы до него.

### Huacaya.start()

Запускает процесс инициализации и отслеживания изменений DOM-дерева.
Наиболее подходящим местом для вызова этого метода является обработчик
события `DOMContentLoaded`:

```js
import XClass from "data-xclass";

window.addEventListener("DOMContentLoaded", () => {
    Huacaya.start();
});
```

### Huacaya.stop()

Останавливает процесс отслеживания изменений DOM-дерева.

### Huacaya.mutateDOM(callback)

Выполняет переданную функцию с блокировкой отслеживания изменений DOM-дерева.

### Huacaya.isWidgetApplied(element, name)

Проверяет, применён ли виджет с указанным именем к указанному DOM-элементу.

### Huacaya.addWidget(element, ...names)

Добавляет виджеты с указанными именами к указанному DOM-элементу.

```js
const button = document.querySelector("#form-button");
Huacaya.addWidget(button, "red-class", "animated-button");
```

### Huacaya.deleteWidget(element, ...names)

Удаляет виджеты с указанными именами с указанного DOM-элемента.

```js
const button = document.querySelector("#form-button");
Huacaya.deleteWidget(button, "animated-button");
```

### Huacaya.deleteAllWidgets(element)

Удаляет все виджеты с указанного DOM-элемента.

```js
const button = document.querySelector("#form-button");
Huacaya.deleteAllWidgets(button);
```

### Huacaya.findClosest(element, name)

Ищет ближайший DOM-элемент, инициализированный виджетом с заданным именем.

```js
const nameField = document.querySelector("input[name=name]");
const ajaxFormElement = Huacaya.findClosest(nameField, "ajax-form");
```

### Huacaya.find(root, name)

Ищет в поддереве указанного DOM-элемента первый DOM-элемент, на котором
инициализирован указанный виджет.

```js
const redElement = Huacaya.find(document.documentElement, "red-class");
if (redElement) {
    Huacaya.deleteWidget(redElement, "red-class");
}
```

### Huacaya.findAll(root, name)

Ищет в поддереве указанного DOM-элемента все DOM-элементы, на которых
инициализирован указанный виджет.

```js
const redElements = Huacaya.findAll(document.documentElement, "red-class");
redElements.forEach(node => {
    Huacaya.deleteWidget(node, "red-class");
});
```

## Примеры

### Виджет для Swiper.js

В этом примере мы реализуем простой виджет, который будет инициализировать
Swiper.js на указанном DOM-элементе.

Для начала нам нужно установить Swiper.js:

```bash
npm install swiper
```

Теперь мы можем зарегистрировать виджет `swiper`:

```js
import XClass from "data-xclass";
import Swiper, { FreeMode } from "swiper";

import "swiper/css";

Huacaya.register("swiper", {
    init: function (element) {
        new Swiper(element, {
            spaceBetween: parseInt(element.dataset.swiperSpaceBetween) || 10,
            slidesPerView: parseInt(element.dataset.swiperSlidesPerView) || "auto"
        });
    },
    destroy: function (element) {
        const swiper = element.swiper;
        if (swiper) {
            swiper.destroy();
        }
    }
});
```

Теперь вы можете инициализировать экземпляр `Swiper` на любом DOM-элементе,
указав имя виджета `swiper` в атрибуте `data-xclass`:

```html
<div class="swiper" data-xclass="swiper" data-swiper-space-between="20">
    <div class="swiper-wrapper">
        <!-- ... -->
    </div>
</div>
```

> Обратите внимание, что вы можете использовать data-атрибуты
> для передачи конфигурации виджетам.

### Алиас для набора виджетов

С помощью поля `dependencies` вы можете создать алиас для набора виджетов:

```js
Huacaya.register("rgb-class", {
    dependencies: ["red-class", "green-class", "blue-class"]
});
```

Теперь для того, чтобы инициализировать все три виджета на одном DOM-элементе,
достаточно добавить одно имя в атрибут:

```html
<div data-xclass="rgb-class">This div will have a red, green and blue class</div>
```
