'use strict';

// start server

var finalhandler = require('finalhandler');
var http = require('http');
var serveStatic = require('serve-static');
var freeport = require('freeport');
var path = require('path');

var serve = serveStatic('.', { 'index': ['index.html'] });

var server = http.createServer(function (req, res) {
  serve(req, res, finalhandler(req, res));
});

freeport(function (err, port) {
  if (err) throw err;
  server.listen(port);

  // start electron

  var electron = require('electron');
  var app = electron.app;
  var BrowserWindow = electron.BrowserWindow;

  // <CUSTOM prompt()>
  var ipcMain = electron.ipcMain;
  var promptResponse;
  ipcMain.on('prompt', function (eventRet, arg) {
    var encodeHtmlEntity = function encodeHtmlEntity(str) {
      var buf = [];
      for (var i = str.length - 1; i >= 0; i--) {
        buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
      }
      return buf.join('');
    };
    promptResponse = null;
    var promptWindow = new BrowserWindow({
      width: 300,
      height: 100,
      show: false,
      resizable: false,
      movable: false,
      alwaysOnTop: true,
      frame: false
    });
    arg.val = arg.val || '';
    var promptHtml = '<form><label for="val">' + encodeHtmlEntity(arg.title) + '</label>\
    <input id="val" value="' + arg.val + '" autofocus />\
    <button type="submit" onclick="require(\'electron\').ipcRenderer.send(\'prompt-response\', document.getElementById(\'val\').value);window.close()">Ok</button>\
    <button type="cancel" onclick="window.close()">Cancel</button>\
    <style>body {font-family: sans-serif;} button {float:right; margin-left: 10px;} label,input {margin-bottom: 10px; width: 100%; display:block;}</style></form>';
    promptWindow.loadURL('data:text/html,' + promptHtml);
    promptWindow.show();
    promptWindow.on('closed', function () {
      eventRet.returnValue = promptResponse;
      promptWindow = null;
    });
  });
  ipcMain.on('prompt-response', function (event, arg) {
    if (arg === '') {
      arg = null;
    }
    promptResponse = arg;
  });
  // </CUSTOM prompt()>

  var mainWindow = void 0;

  function createWindow() {
    mainWindow = new BrowserWindow({
      width: 1024,
      height: 800,
      icon: path.join(__dirname, 'favicon.ico'),
      webPreferences: {
        nodeIntegration: true,
        preload: __dirname + "/start-electron-preload.js",
        webSecurity: false
      }
    });
    mainWindow.loadURL('http://localhost:' + port);
    mainWindow.maximize();
    mainWindow.on('closed', function () {
      return mainWindow = null;
    });
  }

  app.on('ready', createWindow);

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
  });

  app.on('activate', function () {
    if (mainWindow === null) createWindow();
  });
});
//# sourceMappingURL=start-electron.js.map
