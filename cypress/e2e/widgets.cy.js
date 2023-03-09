import { html, test, haveClasses, notHaveClasses } from "./utils.js";

test({
    name: "can apply widget",
    specName: "../spec.html",
    template: html`
      <div data-xclass="red-class"></div>
    `,
    callback: ({ get }) => {
        get("div").should(haveClasses(["red"]));
    }
})

test({
    name: "can apply multiple widgets",
    specName: "../spec.html",
    template: html`
      <div data-xclass="red-class blue-class"></div>
    `,
    callback: ({ get }) => {
        get("div").should(haveClasses(["red", "blue"]));
    }
})

test({
    name: "can apply complex widget",
    specName: "../spec.html",
    template: html`
      <div data-xclass="rgb-class"></div>
    `,
    callback: ({ get }) => {
        get("div").should(haveClasses(["red", "green", "blue"]));
    }
})

test({
    name: "can skip unknown widgets",
    specName: "../spec.html",
    template: html`
      <div data-xclass="red-class yellow-class"></div>
    `,
    callback: ({ get }) => {
        get("div").should(haveClasses(["red"]));
        get("div").should(notHaveClasses(["yellow"]));
    }
})

test({
    name: "can't apply new widget to existing elements",
    specName: "../spec.html",
    template: html`
      <div data-xclass="yellow-class"></div>
      <script>
        XClass.register("yellow-class", {
          init: function(element) {
            element.classList.add("yellow");
          },
          destroy: function(element) {
            element.classList.remove("yellow");
          }
        });
      </script>
    `,
    callback: ({ get }) => {
        get("div").should(notHaveClasses(["yellow"]));
    }
})

test({
    name: "can apply new widget to dynamically created elements",
    specName: "../spec.html",
    template: html`
      <script>
        XClass.register("yellow-class", {
          init: function(element) {
            element.classList.add("yellow");
          },
          destroy: function(element) {
            element.classList.remove("yellow");
          }
        });
        
        const divEl = document.createElement("div");
        divEl.setAttribute("data-xclass", "yellow-class");
        document.body.append(divEl);
      </script>
    `,
    callback: ({ get }) => {
        get("div").should(haveClasses(["yellow"]));
    }
})

test({
    name: "can apply the widget on attribute change",
    specName: "../spec.html",
    template: html`
      <div id="target"></div>
      <script>
        XClass.register("yellow-class", {
          init: function(element) {
            element.classList.add("yellow");
          },
          destroy: function(element) {
            element.classList.remove("yellow");
          }
        });
        
        const divEl = document.getElementById("target");
        divEl.setAttribute("data-xclass", "yellow-class");
      </script>
    `,
    callback: ({ get }) => {
        get("div").should(haveClasses(["yellow"]));
    }
})

test({
    name: "can destroy the widget when the attribute is removed",
    specName: "../spec.html",
    template: html`
      <div data-xclass="red-class"></div>
      <script>
        const divEl = document.querySelector("div");
        divEl.removeAttribute("data-xclass");
      </script>
    `,
    callback: ({ get }) => {
        get("div").should(notHaveClasses(["red"]));
    }
})
