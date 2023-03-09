XClass.register("red-class", {
    init: function(element) {
        element.classList.add("red");
    },
    destroy: function(element) {
        element.classList.remove("red");
    }
});

XClass.register("green-class", {
    init: function(element) {
        element.classList.add("green");
    },
    destroy: function(element) {
        element.classList.remove("green");
    }
});

XClass.register("blue-class", {
    init: function(element) {
        element.classList.add("blue");
    },
    destroy: function(element) {
        element.classList.remove("blue");
    }
});

XClass.register("rgb-class", {
    dependencies: ["red-class", "green-class", "blue-class"]
});
