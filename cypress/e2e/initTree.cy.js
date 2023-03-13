import {html, test} from "./utils.js";

test({
    name: "can initialize widgets",
    specName: "../specManual.html",
    template: html`
      <div id="target" data-xclass="red-class"></div>
    `,
    callback: ({ get, expect }, window) => {
        const divEl = window.document.getElementById("target");
        expect(window.XClass.isWidgetApplied(divEl, "red-class")).to.be.false;
        window.XClass.initTree();
        expect(window.XClass.isWidgetApplied(divEl, "red-class")).to.be.true;
        get("@consoleWarn").should('not.have.been.called');
    }
})

test({
    name: "can be safely called multiple times",
    specName: "../specManual.html",
    template: html`
      <div id="target" data-xclass="red-class"></div>
      <script>window.XClass.initTree();</script>
    `,
    callback: ({ get, expect }, window) => {
        const divEl = window.document.getElementById("target");
        expect(window.XClass.isWidgetApplied(divEl, "red-class")).to.be.true;
        window.XClass.initTree();
        expect(window.XClass.isWidgetApplied(divEl, "red-class")).to.be.true;
        get("@consoleWarn").should('not.have.been.called');
    }
})