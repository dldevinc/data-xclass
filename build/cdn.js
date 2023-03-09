import XClass from "../src/index.js";

window.XClass = XClass;

queueMicrotask(() => {
    XClass.start();
});