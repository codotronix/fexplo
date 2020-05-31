
const { app, BrowserWindow, ipcMain } = require('electron')
// const server = require('./server')
const channel = require('./common/channel')
const store = require('./be-src/services/store')

const {
    getHomeContent,
    getDirContent,
    openFile,
    openURI,
    rename
} = require('./be-src/controllers/primary')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: './assets/icon/fexplo-logo-256x-3.png',
        webPreferences: {
            nodeIntegration: true
        }
    })

    // and load the index.html of the app.
    // win.loadFile('./ui/build/index.html')
    // win.loadURL('http://localhost:9090/')
    // win.loadURL(`file://${__dirname}/fe-src/index.html`) // Alternative way, but since we are only loading static things, we can use the simpler one
    win.loadFile('./fe-src/index.html')

    // Open the DevTools.
    win.webContents.openDevTools()

    // Store a ref for Other modules to use
    store.set("MAIN_WINDOW", win)


    // Now bind all the controllers to their respective listeners
    bindIncomingListeners()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
        store.clear()
    })
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

function bindIncomingListeners () {
    ipcMain.on(channel.GET_HOME_CONTENT, getHomeContent)
    ipcMain.on(channel.GET_DIR_CONTENT, getDirContent)
    ipcMain.on(channel.OPEN_FILE, openFile)
    ipcMain.on(channel.OPEN_URI, openURI)
    ipcMain.on(channel.RENAME, rename)
}
