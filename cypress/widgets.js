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

XClass.register("body-class", {
    init: function(element) {
        document.body.classList.add("body-widget");
    },
    destroy: function(element) {
        document.body.classList.remove("body-widget");
    }
});

XClass.register("async-class", {
    init: async function(element) {
        await new Promise(resolve => {
            setTimeout(() => {
                element.classList.add("async");
                resolve();
            }, 100);
        });
    },
    destroy: async function(element) {
        await new Promise(resolve => {
            setTimeout(() => {
                element.classList.remove("async");
                resolve();
            }, 100);
        });
    }
});
