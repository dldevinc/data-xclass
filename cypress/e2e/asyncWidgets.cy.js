import { html, test, haveClasses, notHaveClasses } from "./utils.js";

test({
    name: "can apply async widget",
    specName: "../spec.html",
    template: html`
      <div data-xclass="async-class"></div>
    `,
    callback: ({ get }) => {
        get("div").should(notHaveClasses(["async"]));

        setTimeout(() => {
            get("div").should(haveClasses(["async"]));
        }, 110);
    }
})

test({
    name: "can emit 'xclass:init-widget' event",
    specName: "../spec.html",
    template: html`
      <script>
        document.addEventListener("xclass:init-widget", event => {
          console.log("Init: " + event.detail.name);
        });
      </script>

      <div data-xclass="async-class"></div>
    `,
    callback: ({ get }) => {
        get("@consoleLog").should("not.be.calledWith", "Init: async-class");

        setTimeout(() => {
            get("@consoleLog").should("be.calledWith", "Init: async-class");
        }, 110);
    }
})
