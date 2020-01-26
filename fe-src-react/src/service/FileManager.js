const os = window.require("os")
const fs = window.require("fs")
const path = window.require('path')
const shell = window.require('electron').shell

// It returns array of dirent (Directory Entry Objects)
export const getDirContent = path => {
    return fs.readdirSync(path, {withFileTypes: true})
}

export const getHomePath = () => os.homedir()

export const isDirectory = path => {
    try {
        var stat = fs.lstatSync(path);
        return stat.isDirectory();
    } catch (e) {
        // lstatSync throws an error if path doesn't exist
        return false;
    }
}

export const joinPath = (...pathArr) => path.join(...pathArr)

export const getParentPath = currentPath => {
    let parts = currentPath.split(path.sep)
    if(parts.length <= 1) return false
    parts = parts.slice(0, parts.length-1)
    return parts.join(path.sep)
}

export const openFileOSDefault = file => shell.openItem(file)
