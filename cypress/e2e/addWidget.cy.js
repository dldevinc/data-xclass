import {haveClasses, html, haveAttribute, test} from "./utils.js";

test({
    name: "can add widget dynamically",
    specName: "../spec.html",
    template: html`
      <div id="target"></div>
      <script>
        const divEl = document.getElementById("target");
        XClass.addWidget(divEl, "blue-class");
      </script>
    `,
    callback: ({ get }) => {
        get("#target").should(haveClasses(["blue"]));
    }
})

test({
    name: "can safely add the widget twice",
    specName: "../spec.html",
    template: html`
      <div id="target"></div>
      <script>
        const divEl = document.getElementById("target");
        XClass.addWidget(divEl, "blue-class");
        XClass.addWidget(divEl, "blue-class");
      </script>
    `,
    callback: ({ get }) => {
        get("#target").should(haveClasses(["blue"]));
        get("@consoleWarn").should("be.calledWith", "Widget \"blue-class\" has already been applied to this element.")
    }
})

test({
    name: "can update attribute",
    specName: "../spec.html",
    template: html`
      <div id="target" data-xclass="red-class"></div>
      <script>
        const divEl = document.getElementById("target");
        XClass.addWidget(divEl, "blue-class");
      </script>
    `,
    callback: ({ get }) => {
        get("#target").should(
            haveClasses(["red", "blue"])
        ).should(
            haveAttribute("data-xclass", "red-class blue-class")
        );
    }
})
