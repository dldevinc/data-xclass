import {html, test} from "./utils.js";

test({
    name: "can find closest widget",
    specName: "../spec.html",
    template: html`
      <div id="target" data-xclass="red-class">
        <div class="button-wrapper">
          <button type="button" id="button">Click me</button>
        </div>
      </div>
    `,
    callback: ({ expect }, window) => {
        const divEl = window.document.getElementById("target");
        const button = window.document.getElementById("button");
        expect(window.XClass.findClosest(button, "red-class")).to.eql(divEl);
    }
})

test({
    name: "can't find unknown widget",
    specName: "../spec.html",
    template: html`
      <div id="target" data-xclass="red-class">
        <div class="button-wrapper">
          <button type="button" id="button">Click me</button>
        </div>
      </div>
    `,
    callback: ({ expect }, window) => {
        const button = window.document.getElementById("button");
        expect(window.XClass.findClosest(button, "blue-class")).to.be.null;
    }
})

test({
    name: "can find implicit widget",
    specName: "../spec.html",
    template: html`
      <div id="target" data-xclass="rgb-class">
        <div class="button-wrapper">
          <button type="button" id="button">Click me</button>
        </div>
      </div>
    `,
    callback: ({ expect }, window) => {
        const divEl = window.document.getElementById("target");
        const button = window.document.getElementById("button");
        expect(window.XClass.findClosest(button, "red-class")).to.eql(divEl);
    }
})
