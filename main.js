var app = require('app');
var BrowserWindow = require('browser-window');

var mainWindow = null;

app.on('ready', function () {
  var height = 500,
      width = 600;

  mainWindow = new BrowserWindow({
    height: height,
    resizable: true,
    title: 'j5/electron template',
    width: width,
	frame: false
  });

  mainWindow.loadURL('file://' + __dirname + '/app/index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
});