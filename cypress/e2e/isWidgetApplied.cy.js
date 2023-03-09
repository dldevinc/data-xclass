import {haveClasses, html, test} from "./utils.js";

test({
    name: "can check for widgets",
    specName: "../spec.html",
    template: html`
      <div data-xclass="rgb-class"></div>
    `,
    callback: ({ get, expect }, window) => {
        get("div").should(haveClasses(["red", "green", "blue"])).should(el => {
            expect(window.XClass.isWidgetApplied(el.get(0), "red-class")).to.eq(true);
            expect(window.XClass.isWidgetApplied(el.get(0), "green-class")).to.eq(true);
            expect(window.XClass.isWidgetApplied(el.get(0), "blue-class")).to.eq(true);
            expect(window.XClass.isWidgetApplied(el.get(0), "rgb-class")).to.eq(true);
            expect(window.XClass.isWidgetApplied(el.get(0), "yellow-class")).to.eq(false);
        });
    }
})
