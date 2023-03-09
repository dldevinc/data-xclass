import {notHaveClasses, html, test, notHaveAttribute} from "./utils.js";

test({
    name: "can delete all widgets dynamically",
    specName: "../spec.html",
    template: html`
      <div id="target" data-xclass="rgb-class"></div>
      <script>
        const divEl = document.getElementById("target");
        XClass.deleteAllWidgets(divEl);
      </script>
    `,
    callback: ({ get }) => {
        get("#target").should(
            notHaveClasses(["red", "green", "blue"])
        ).should(
            notHaveAttribute("data-xclass")
        );
    }
})
