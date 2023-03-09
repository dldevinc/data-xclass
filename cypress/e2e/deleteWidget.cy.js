import {haveClasses, html, haveAttribute, test} from "./utils.js";

test({
    name: "can delete widget dynamically",
    specName: "../spec.html",
    template: html`
      <div id="target" data-xclass="rgb-class"></div>
      <script>
        const divEl = document.getElementById("target");
        XClass.deleteWidget(divEl, "blue-class");
      </script>
    `,
    callback: ({ get }) => {
        get("#target").should(
            haveClasses(["red", "green"])
        ).should(
            haveAttribute("data-xclass", "rgb-class")
        );
    }
})

test({
    name: "can safely delete the widget twice",
    specName: "../spec.html",
    template: html`
      <div id="target" data-xclass="rgb-class"></div>
      <script>
        const divEl = document.getElementById("target");
        XClass.deleteWidget(divEl, "blue-class");
        XClass.deleteWidget(divEl, "blue-class");
      </script>
    `,
    callback: ({ get }) => {
        get("#target").should(haveClasses(["red", "green"]));
        get("@consoleWarn").should("be.calledWith", "Widget \"blue-class\" was not applied to this element.")
    }
})

test({
    name: "can update attribute",
    specName: "../spec.html",
    template: html`
      <div id="target" data-xclass="red-class green-class blue-class"></div>
      <script>
        const divEl = document.getElementById("target");
        XClass.deleteWidget(divEl, "green-class");
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
