const os = require("os")
const fs = require("fs")
const path = require('path')
const { shell } = require('electron')

// It returns array of dirent (Directory Entry Objects)
module.exports.getDirContent = path => {
    return new Promise((resolve, reject) => {
        fs.readdir(path, {withFileTypes: true}, (err, content) => {
            if(err) reject(err)
            
            const result = content.map(f => {
                return {...f,
                isBlockDevice: f.isBlockDevice(),
                isCharacterDevice: f.isCharacterDevice(),
                isDirectory: f.isDirectory(),
                isFIFO: f.isFIFO(),
                isFile: f.isFile(),
                isSocket: f.isSocket(),
                isSymbolicLink: f.isSymbolicLink()}
            })

            resolve(result)
        })
    }) 
}

module.exports.getHomePath = () => os.homedir()

module.exports.isDirectory = path => {
    try {
        var stat = fs.lstatSync(path);
        return stat.isDirectory();
    } catch (e) {
        // lstatSync throws an error if path doesn't exist
        return false;
    }
}

module.exports.getParentPath = currentPath => {
    let parts = currentPath.split(path.sep)
    if(parts.length <= 1) return false
    parts = parts.slice(0, parts.length-1)
    return parts.join(path.sep)
}

module.exports.openFileOSDefault = file => {
    try {
        return shell.openItem(file)
    } 
    catch (err) {
        console.log(err)
        return false
    }
}