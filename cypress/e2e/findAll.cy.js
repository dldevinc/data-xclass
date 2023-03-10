import {html, test} from "./utils.js";

test({
    name: "can find widgets",
    specName: "../spec.html",
    template: html`
      <div id="target" data-xclass="red-class">
        <div class="button-wrapper">
          <button type="button" id="buttonA" data-xclass="blue-class">Button A</button>
          <button type="button" id="buttonB" data-xclass="blue-class">Button B</button>
        </div>
      </div>
    `,
    callback: ({ expect }, window) => {
        const divEl = window.document.getElementById("target");
        const buttonA = window.document.getElementById("buttonA");
        const buttonB = window.document.getElementById("buttonB");
        const blueButtons = window.XClass.findAll(divEl, "blue-class");
        expect(blueButtons).to.have.length(2);
        expect(blueButtons).to.eql([buttonA, buttonB]);
    }
})

test({
    name: "can return empty array",
    specName: "../spec.html",
    template: html`
      <div id="target" data-xclass="red-class">
        <div class="button-wrapper">
          <button type="button" id="buttonA" data-xclass="blue-class">Button A</button>
          <button type="button" id="buttonB" data-xclass="red-class">Button B</button>
        </div>
      </div>
    `,
    callback: ({ expect }, window) => {
        const divEl = window.document.getElementById("target");
        const greenButtons = window.XClass.findAll(divEl, "green-class");
        expect(greenButtons).to.have.length(0);
    }
})

test({
    name: "can find implicit widget",
    specName: "../spec.html",
    template: html`
      <div id="target" data-xclass="red-class">
        <div class="button-wrapper">
          <button type="button" id="buttonA" data-xclass="rgb-class">Button A</button>
          <button type="button" id="buttonB" data-xclass="blue-class">Button B</button>
        </div>
      </div>
    `,
    callback: ({ expect }, window) => {
        const divEl = window.document.getElementById("target");
        const buttonA = window.document.getElementById("buttonA");
        const buttonB = window.document.getElementById("buttonB");
        const blueButtons = window.XClass.findAll(divEl, "blue-class");
        expect(blueButtons).to.have.length(2);
        expect(blueButtons).to.eql([buttonA, buttonB]);
    }
})
