var app = require('app');
var BrowserWindow = require('browser-window');

var mainWindow = null;

app.on('ready', function () {

  var height = 600,
      width = 800;

  mainWindow = new BrowserWindow({
    height: height,
    resizable: true,
    minHeight: 500,
    minWidth: 320,
    title: 'j5/electron template',
    width: width,
    draggable: true,
    frame: false
  });

  mainWindow.loadURL('file://' + __dirname + '/app/index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
});