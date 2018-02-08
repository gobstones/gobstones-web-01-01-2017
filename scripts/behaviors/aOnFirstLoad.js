"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

if (typeof require === "undefined") window.require = function () {};

// Read querystring
function getParameterByName(name, url) {
  // http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return undefined;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Set isomorphic local storage method
var getDataPath = function getDataPath() {
  return window.GBS_DIRNAME + "/config.json";
};
var readData = function readData() {
  return JSON.parse(window.GBS_REQUIRE("fs").readFileSync(getDataPath(), "utf-8"));
};
var writeData = function writeData(data) {
  return window.GBS_REQUIRE("fs").writeFileSync(getDataPath(), JSON.stringify(data));
};
var webStorage = {
  setItem: function setItem(key, value) {
    localStorage.setItem(key, value);
  },
  getItem: function getItem(key) {
    return localStorage.getItem(key);
  }
};
var desktopStorage = {
  setItem: function setItem(key, value) {
    try {
      var data = readData();
      data[key] = value;
      writeData(data);
    } catch (e) {
      writeData(_defineProperty({}, key, value));
    }
  },
  getItem: function getItem(key) {
    try {
      var json = readData();
      return json[key];
    } catch (e) {
      return null;
    }
  }
};
window.STORAGE = window.GBS_DESKTOP ? desktopStorage : webStorage;