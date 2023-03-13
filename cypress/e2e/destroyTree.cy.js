import {html, test, haveAttribute, haveClasses} from "./utils.js";

test({
    name: "can destroy widgets",
    specName: "../specManual.html",
    template: html`
      <div id="target" data-xclass="red-class"></div>
    `,
    callback: ({ get, expect }, window) => {
        const divEl = window.document.getElementById("target");
        expect(window.XClass.isWidgetApplied(divEl, "red-class")).to.be.false;
        window.XClass.initTree();
        expect(window.XClass.isWidgetApplied(divEl, "red-class")).to.be.true;
        window.XClass.destroyTree();
        expect(window.XClass.isWidgetApplied(divEl, "red-class")).to.be.false;

        get("#target").should(haveAttribute("data-xclass", "red-class"));
        get("@consoleWarn").should('not.have.been.called');
    }
})

test({
    name: "can be safely called multiple times",
    specName: "../specManual.html",
    template: html`
      <div id="target" data-xclass="red-class"></div>
      <script>
        window.XClass.initTree();
        window.XClass.destroyTree();
      </script>
    `,
    callback: ({ get, expect }, window) => {
        const divEl = window.document.getElementById("target");
        expect(window.XClass.isWidgetApplied(divEl, "red-class")).to.be.false;
        window.XClass.destroyTree();
        expect(window.XClass.isWidgetApplied(divEl, "red-class")).to.be.false;
        get("@consoleWarn").should('not.have.been.called');
    }
})