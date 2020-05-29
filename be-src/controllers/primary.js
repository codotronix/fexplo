const path = require('path')
const fs = require('fs')
const { 
    getHomePath, 
    getDirContent, 
    openFileOSDefault,
    isDirectory
} = require('../services/ffhelper')
const channel = require('../../common/channel')
const store = require('../services/store')

const _send = (chanl, data) => {
    const win = store.get("MAIN_WINDOW")
    win.webContents.send(chanl, data)
}

module.exports.getHomeContent = async (e, data) => {
    try {
        // console.log("data = ", data)
        // console.log('inside ipcMain of ', channel.GET_HOME_CONTENT)
        const url = getHomePath()
        const content = await getDirContent(url)
        _send(channel.GET_HOME_CONTENT, { url, content })
    }
    catch(err) {
        console.log(err)
    }
}

module.exports.getDirContent = async (e, data) => {
    try {
        const url = path.join(data.current, data.target)
        const content = await getDirContent(url)
        // console.log(content)
        _send(channel.GET_DIR_CONTENT , { url, content })
    }
    catch(err) {
        console.log(err)
    }
}

module.exports.openFile = async (e, data) => {
    try {
        const url = path.join(data.current, data.target)
        let isSuccessful = openFileOSDefault(url)
        _send(channel.OPEN_FILE, {
            msg: 'Trying to open with OS Default ...',
            isSuccessful
        })
    } 
    catch (err) {
        console.log(err)
    }
}

module.exports.openURI = async (e, data) => {
    try {
        const url = path.normalize(data.url)
        if(isDirectory(url)) {
            const content = await getDirContent(url)
            // console.log(content)
            _send(channel.OPEN_URI, { url, content })
        }
        else {
            let isSuccessful = openFileOSDefault(url)
            _send(channel.OPEN_URI, {
                msg: 'Trying to open with OS Default ...',
                isSuccessful
            })
        }
    }
    catch (err) {
        console.log(err)
    }
}

module.exports.rename = async (e, data) => {
    try {
        const oldPath = path.join(data.current, data.oldName)
        const newPath = path.join(data.current, data.newName)
        fs.rename(oldPath, newPath, async err => {
            if(err) {
                console.log(err)
                return
            }

            // IF rename is successfull, refresh the directory contents
            const content = await getDirContent(data.current)
            _send(channel.GET_DIR_CONTENT , { url: data.current, content })
        })
    } 
    catch (err) {
        console.log(err)
    }
}