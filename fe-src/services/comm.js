const electron = require('electron')
const { ipcRenderer } = electron

// SEND to electron main
const send = (channel, data) => ipcRenderer.send(channel, data)

// Recieve from electron main
const on = (channel, cb) => ipcRenderer.on(channel, cb)

module.exports = {
    send, on
}