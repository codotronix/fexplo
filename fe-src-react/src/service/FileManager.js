const os = window.require("os")
const fs = window.require("fs")
const path = window.require('path')

// It returns array of dirent (Directory Entry Objects)
export const getDirContent = path => {
    return fs.readdirSync(path, {withFileTypes: true})
}

export const getHomePath = () => os.homedir()
