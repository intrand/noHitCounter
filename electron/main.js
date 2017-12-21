const {app, BrowserWindow, globalShortcut, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const http = require('http');
var io = require('socket.io');
var axios = require('axios')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

var localPortNum = 4101;
var localHostName = "http://localhost:" + localPortNum;

const defaultHotKeys = {
    inc: "CommandOrControl+I",
    down: "CommandOrControl+D",
    up: "CommandOrControl+U"
}
function createWindow () {

    // Instantiate Express App
    var app = require('./server/server');
    app(4101, function() {
        console.log('server started');

    });


    win = new BrowserWindow({width: 800, height: 600});
    // and load the index.html of the app.
    win.loadURL("http://localhost:4101");
    var socket = require('socket.io-client')('http://localhost:4101');
    socket.on('connect', () => {
        console.log('made connection');
    });

    socket.on('hotkeysSync', function(data) {
        registerNewHotKeys(data.hotkeys);
    })

    // Open the DevTools.
    // win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })

    win.on('will-quit', () => {
        globalShortcut.unregisterAll()
    });
    refreshHotKeys();


}

function refreshHotKeys(){
    registerNewHotKeys(getHotKeys());
}


function getHotKeys() {
   return db.get('settings').value().hotkeys;

}

function registerNewHotKeys(hotkeys){
    console.log('register hot keys ' + JSON.stringify(hotkeys));
    globalShortcut.unregisterAll();
    globalShortcut.register(hotkeys.inc, () => {
        increment();
    })
    globalShortcut.register(hotkeys.up, () => {
        moveUp();
    })
    globalShortcut.register(hotkeys.down, () => {
        moveDown();
    });

}

function increment(){

    axios.get(localHostName + "/db/currentRun/inc")
        .then((response) => {
            console.log('did inc call');
    });
}

function moveUp(){

    axios.get(localHostName + "/db/currentRun/up")
        .then((response) => {
            console.log('did inc call');
        });
}

function moveDown(){

    axios.get(localHostName + "/db/currentRun/down")
        .then((response) => {
            console.log('did inc call');
        });
}




// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
    app.quit()
}
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
    createWindow()
}
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.