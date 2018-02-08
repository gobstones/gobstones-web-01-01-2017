"use strict";

window.GBS_DESKTOP = true;

window.GBS_REQUIRE = require;
window.GBS_DIRNAME = __dirname;

var ipcRenderer = require("electron").ipcRenderer;
window.prompt = function (title, val) {
  return ipcRenderer.sendSync("prompt", { title: title, val: val });
};
//# sourceMappingURL=start-electron-preload.js.map
