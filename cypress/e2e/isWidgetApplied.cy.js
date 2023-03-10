import {haveClasses, html, test} from "./utils.js";

test({
    name: "can check for widgets",
    specName: "../spec.html",
    template: html`
      <div data-xclass="rgb-class"></div>
    `,
    callback: ({ get, expect }, window) => {
        get("div").should(haveClasses(["red", "green", "blue"])).should(([el]) => {
            expect(window.XClass.isWidgetApplied(el, "red-class")).to.be.true;
            expect(window.XClass.isWidgetApplied(el, "green-class")).to.be.true;
            expect(window.XClass.isWidgetApplied(el, "blue-class")).to.be.true;
            expect(window.XClass.isWidgetApplied(el, "rgb-class")).to.be.true;
            expect(window.XClass.isWidgetApplied(el, "yellow-class")).to.be.false;
        });
    }
})

test({
    name: "can find dynamically added widget",
    specName: "../spec.html",
    template: html`
      <div id="target" data-xclass="red-class"></div>
      <script>
        const divEl = document.getElementById("target");
        XClass.addWidget(divEl, "blue-class");
      </script>
    `,
    callback: ({ get }, window) => {
        get("#target").should(([el]) => {
            expect(window.XClass.isWidgetApplied(el, "red-class")).to.be.true;
            expect(window.XClass.isWidgetApplied(el, "green-class")).to.be.false;
            expect(window.XClass.isWidgetApplied(el, "blue-class")).to.be.true;
        });
    }
})

test({
    name: "can't find dynamically deleted widget",
    specName: "../spec.html",
    template: html`
      <div id="target" data-xclass="red-class green-class blue-class"></div>
      <script>
        const divEl = document.getElementById("target");
        XClass.deleteWidget(divEl, "blue-class");
      </script>
    `,
    callback: ({ get }, window) => {
        get("#target").should(([el]) => {
            expect(window.XClass.isWidgetApplied(el, "red-class")).to.be.true;
            expect(window.XClass.isWidgetApplied(el, "green-class")).to.be.true;
            expect(window.XClass.isWidgetApplied(el, "blue-class")).to.be.false;
        });
    }
})
