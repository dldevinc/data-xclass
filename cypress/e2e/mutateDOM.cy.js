import {html, notHaveClasses, test} from "./utils.js";

test({
    name: "can't trigger mutationObserver",
    specName: "../spec.html",
    template: html`
      <script>
        const divEl = document.createElement("div");
        divEl.setAttribute("data-xclass", "red-class");

        XClass.mutateDOM(() => {
          document.body.append(divEl);
        });
      </script>
    `,
    callback: ({ get }) => {
        get("div").should(notHaveClasses(["red"]));
    }
})
