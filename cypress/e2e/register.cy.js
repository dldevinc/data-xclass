import {haveClasses, html, test} from "./utils.js";

test({
    name: "can add widget name to `_registered` object",
    specName: "../spec.html",
    template: html`
      <script>
        XClass.register("foo", {});
      </script>
    `,
    callback: ({ expect }, window) => {
        expect(window.XClass._registered.has("foo")).to.be.true;
        expect(window.XClass._registered.has("bar")).to.be.false;
    }
})

test({
    name: "can't register already registered widget",
    specName: "../spec.html",
    template: html`
      <script>
        XClass.register("foo", {});
        XClass.register("foo", {});
      </script>
    `,
    expectedError: "Widget \"foo\" is already registered."
})

test({
    name: "can call onRegister() method",
    specName: "../spec.html",
    template: html`
      <script>
        XClass.register("foo", {
          onRegister: function(widgetObject) {
              if (this !== widgetObject) {
                  throw new Error("object mismatch");
              }
              
              document.body.classList.add("foo-registered");
          }
        });
      </script>
    `,
    callback: ({ get }) => {
        get("body").should(haveClasses(["foo-registered"]));
    }
})

test({
    name: "can emit 'xclass:registered' event",
    specName: "../spec.html",
    template: html`
      <script>
        const widgetObject = {};
        
        document.addEventListener("xclass:registered", event => {
          if (event.detail.name !== "foo") {
            throw new Error("name mismatch");
          }
          if (event.detail.widgetObject !== widgetObject) {
            throw new Error("object mismatch");
          }

          document.body.classList.add("foo-registered");
        });
        
        XClass.register("foo", widgetObject);
      </script>
    `,
    callback: ({ get }) => {
        get("body").should(haveClasses(["foo-registered"]));
    }
})
