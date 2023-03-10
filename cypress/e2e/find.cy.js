import {html, test} from "./utils.js";

test({
    name: "can find widget",
    specName: "../spec.html",
    template: html`
      <div id="target" data-xclass="red-class">
        <div class="button-wrapper">
          <button type="button" id="button" data-xclass="blue-class">Click me</button>
        </div>
      </div>
    `,
    callback: ({ expect }, window) => {
        const divEl = window.document.getElementById("target");
        const button = window.document.getElementById("button");
        expect(window.XClass.find(divEl, "blue-class")).to.eql(button);
    }
})

test({
    name: "can't find unknown widget",
    specName: "../spec.html",
    template: html`
      <div id="target" data-xclass="red-class">
        <div class="button-wrapper">
          <button type="button" id="button" data-xclass="blue-class">Click me</button>
        </div>
      </div>
    `,
    callback: ({ expect }, window) => {
        const divEl = window.document.getElementById("target");
        expect(window.XClass.find(divEl, "green-class")).to.be.null;
    }
})

test({
    name: "can find implicit widget",
    specName: "../spec.html",
    template: html`
      <div id="target" data-xclass="red-class">
        <div class="button-wrapper">
          <button type="button" id="button" data-xclass="rgb-class">Click me</button>
        </div>
      </div>
    `,
    callback: ({ expect }, window) => {
        const divEl = window.document.getElementById("target");
        const button = window.document.getElementById("button");
        expect(window.XClass.find(divEl, "blue-class")).to.eql(button);
    }
})
