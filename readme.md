# data-xclass

This is a lightweight library that is designed to make applying widgets to old-school 
SSR applications. It works by letting you add the names of the widgets you want 
to use in the `data-xclass` attribute.

## Installation

There are few options on how to include/import `data-xclass` into your project.

### Install from NPM

We can install XClass from NPM

```
npm install data-xclass
```

```js
import XClass from "data-xclass";

XClass.register(...);
```

### Use XClass from CDN

If you don't want to include `data-xclass` files in your project, you may use it from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/data-xclass/dist/umd.min.js"></script>
```

### Download assets

If you want to use `data-xclass` locally, you can directly download them from https://www.jsdelivr.com/package/npm/data-xclass

## Quick Start

Creating a simple widget:

```js
import XClass from "data-xclass";

// Register a new widget "red-class"
XClass.register("red-class", {
    // Initalize the widget on the element
    init: function (element) {
        element.classList.add("red");
    },

    // Clean up any resources when the widget is destroyed
    destroy: function (element) {
        element.classList.remove("red");
    }
});
```

The above code will register the `red-class` widget, which will add the `red` class 
to any element it is applied to.

To apply the widget, we add the `data-xclass` attribute to the element:

```html
<div data-xclass="red-class">
  This element will have the red class
</div>
```

> You can apply multiple widgets to an element by separating the widget names 
> with a space.

Now we need to initialize XClass:

```js
window.addEventListener("DOMContentLoaded", () => {
    XClass.start();
});
```

This method will search for DOM elements with the `data-xclass` attribute and initialize 
the appropriate widgets on them. In addition, it will track changes in the DOM tree and 
initialize widgets on new DOM elements.

> If you imported XClass into a bundle, you have to make sure you are registering 
> any widget IN BETWEEN when you import the `XClass` global object, and when you 
> initialize XClass by calling `XClass.start()`.

## API

### XClass.register(name, widgetObject)

Register a widget with the given name.

**Parameters**

- `name`: The name of the widget.
- `widgetObject`: The widget object to be registered. It can have the following properties:
  - `onRegister(self)` - A method that is called when the widget is registered.
  - `init(element, self)` - A method that is called when the widget is applied to an element.
  - `destroy(element, self)` - A method that is called when the widget is removed from an element.
  - `dependencies` - An array of widget names that have to be initialized before this widget.

### XClass.start()

Initialize XClass by searching for DOM elements with the `data-xclass` attribute
and initializing the appropriate widgets on them.

In addition, it will track changes in the DOM tree and initialize widgets on new DOM elements.

### XClass.stop()

Stops XClass from tracking changes in the DOM tree and initializing widgets on new DOM elements.

### XClass.mutateDOM(callback)

Mutates the DOM in a safe way by temporarily disabling XClass and then re-enabling it 
after the DOM mutation is finished.

**Parameters**

- `callback`: A function that will be called with no arguments. This callback will be 
  executed with XClass disabled and should contain the DOM mutation logic.

### XClass.isWidgetApplied(element, name)

Checks if the widget with the given name is applied to the given element.

**Parameters**

- `element`: The element to check.
- `name`: The name of the widget to check.

**Returns**

A boolean value indicating if the widget is applied to the given element.

### XClass.addWidget(element, ...names)

Adds the given widgets to the given element.

**Parameters**

- `element`: The element to which the widgets will be applied.
- `names`: The names of the widgets to be applied.

```js
const button = document.querySelector("#form-button");
XClass.addWidget(button, "red-class", "animated-button");
```

### XClass.deleteWidget(element, ...names)

Removes the given widgets from the given element.

**Parameters**

- `element`: The element from which the widgets will be removed.
- `names`: The names of the widgets to be removed.

```js
const button = document.querySelector("#form-button");
XClass.deleteWidget(button, "animated-button");
```

### XClass.deleteAllWidgets(element)

Removes all widgets from the given element.

**Parameters**

- `element`: The element from which all widgets will be removed.

```js
const button = document.querySelector("#form-button");
XClass.deleteAllWidgets(button);
```

### XClass.findClosest(element, name)

Finds the closest ancestor of the given element that has the given widget applied.

**Parameters**

- `element`: The element to start searching from.
- `name`: The name of the widget.

**Returns**

The element that has the widget applied, or null if the widget is not found.

```js
const nameField = document.querySelector("input[name=name]");
const ajaxFormElement = XClass.findClosest(nameField, "ajax-form");
```

### XClass.find(root, name)

Finds the first element in the given root element that has the given widget applied.

**Parameters**

- `root`: The element to start searching from.
- `name`: The name of the widget.

**Returns**

The element that has the widget applied, or null if the widget is not found.

```js
const redElement = XClass.find(document, "red-class");
if (redElement) {
    XClass.deleteWidget(redElement, "red-class");
}
```

### XClass.findAll(root, name)

Finds all elements in the given root element that have the given widget applied.

**Parameters**

- `root`: The element to start searching from.
- `name`: The name of the widget.

**Returns**

An array of elements that have the widget applied.

```js
// Delete all instances of "red-class" widget
const redElements = XClass.findAll(document.documentElement, "red-class");
redElements.forEach(node => {
  XClass.deleteWidget(node, "red-class");
});
```

## Examples

### Swiper.js widget

This example shows how to create a simple widget that uses [Swiper.js](https://swiperjs.com/) 
to create a carousel:

```js
import XClass from "data-xclass";
import Swiper, { FreeMode } from "swiper";

import "swiper/css";

XClass.register("simple-swiper", {
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

We can then apply this widget to an element with the `data-xclass` attribute:

```html
<div class="swiper" data-xclass="simple-swiper" data-swiper-space-between="10" data-swiper-slides-per-view="3">
    <div class="swiper-wrapper">
        <div class="swiper-slide">Slide 1</div>
        <div class="swiper-slide">Slide 2</div>
        <div class="swiper-slide">Slide 3</div>
    </div>
</div>
```

> Note that we are passing options to the widget via the `data-` attributes.
> This is a good practice as it allows us to configure the widget without having
> to modify our code.

### Widget dependencies

This example shows how to create a widget that depends on another widget:

```js
import XClass from "data-xclass";

XClass.register("red-class", {
    init: function (element) {
        element.classList.add("red");
    },
    destroy: function (element) {
        element.classList.remove("red");
    }
});

XClass.register("blue-class", {
    dependencies: ["red-class"],
    init: function (element) {
        element.classList.add("blue");
    },
    destroy: function (element) {
        element.classList.remove("blue");
    }
});
```

In this example, the `blue-class` widget depends on the `red-class` widget. This
means that when the `blue-class` widget is applied, the `red-class` widget will
automatically be applied first.

To apply the `blue-class` widget, we just need to set the `data-xclass` attribute:

```html
<div data-xclass="blue-class">
  This element will have the red and blue classes
</div>
```

### Alias for a set of widgets

Sometimes we want to apply multiple widgets to an element with a single command.
We can do this by creating an alias for a set of widgets:

```js
// Create an alias for the red-class and blue-class widgets
XClass.register("red-blue-classes", {
    dependencies: ["red-class", "blue-class"]
});
```

Now we can apply both the `red-class` and `blue-class` widgets with a single command:

```html
<div data-xclass="red-blue-classes">
  This element will have the red and blue classes
</div>
```

## License

[MIT](https://github.com/dldevinc/data-xclass/blob/master/LICENSE)
