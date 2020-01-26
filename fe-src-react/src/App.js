import React, { useState } from 'react';
import './App.css';
import FFContainer from './components/ffContainer/FFContainer'
import TopNav from './components/topNav/TopNav'
import * as FileManager from './service/FileManager'

function App() {
    // const ffList =  getDummyFList()
    const startPath = FileManager.getHomePath()
    let initFfList = FileManager.getDirContent(startPath)

    const [navHistory, setNavHistory] = useState([startPath])
    const [pathIndex, setPathIndex] = useState(0)       // which navHistory is current pwd
    const [ffList, setFFList] = useState(initFfList)    // list of files / folder in pwd
    const [navText, setNavText] = useState(navHistory[pathIndex])
    const handleDirTraverse = option => {

        switch (option.direction) {
            // DOWN mens going down i.e. Opening a new folder
            // And going down inside it
            // Mandatory: option.direction and option.folderName
            case "DOWN": {
                let currentPath = navHistory[pathIndex]
                let newPath = FileManager.joinPath(currentPath, option.folderName)
                let newHistory = navHistory.slice(0, pathIndex+1)
                setNavHistory([...newHistory, newPath])
                setFFList(FileManager.getDirContent(newPath))
                setPathIndex(pathIndex + 1)
                setNavText(newPath)
                return
            }

            // Going 1 directory up
            case "UP": {
                let currentPath = navHistory[pathIndex]
                let newPath = FileManager.getParentPath(currentPath)
                if(!newPath) return
                setNavHistory([...navHistory, newPath])
                setFFList(FileManager.getDirContent(newPath))
                setPathIndex(pathIndex + 1)
                setNavText(newPath)
                return
            }
            
            // Just going 1 step back in history array
            case "LEFT": {
                if (pathIndex > 0) {
                    let pIndex = pathIndex
                    --pIndex;
                    setPathIndex(pIndex)
                    setFFList(FileManager.getDirContent(navHistory[pIndex]))
                    setNavText(navHistory[pIndex])
                    return
                }
            }

            // Just going 1 step forward in history array
            case "RIGHT": {
                if (pathIndex < (navHistory.length - 1)) {
                    let pIndex = pathIndex
                    ++pIndex;
                    setPathIndex(pIndex)
                    setFFList(FileManager.getDirContent(navHistory[pIndex]))
                    setNavText(navHistory[pIndex])
                    return
                }
            }
            
            // When a new url is typed in the nav text box
            // Mandatory: option.direction and option.newUrl
            case "NEW": {
                if(FileManager.isDirectory(option.newUrl)) {
                    setNavHistory([...navHistory, option.newUrl])
                    setFFList(FileManager.getDirContent(option.newUrl))
                    setPathIndex(pathIndex + 1)
                }
                return
            }

            // To open a file
            // Mandatory: option.direction and option.fileName
            case "OPEN": {
                let currentPath = navHistory[pathIndex]
                let newPath = FileManager.joinPath(currentPath, option.fileName)
                FileManager.openFileOSDefault(newPath)
            }
        }

    }

    return (
        <div className="App">
            <TopNav 
                url={navText} 
                handleChange={setNavText}
                handleDirTraverse={handleDirTraverse}
            />
            <FFContainer 
                list={ffList} 
                handleDirTraverse={handleDirTraverse}
            />
        </div>
    );
}

export default App;


function getDummyFList() {
    return [
        {
            type: "folder",
            name: "Movies"
        },
        {
            type: "folder",
            name: "Songs"
        },
        {
            type: "folder",
            name: "Games"
        },
        {
            type: "file",
            name: "file 1"
        },
        {
            type: "file",
            name: "file 2"
        },
        {
            type: "file",
            name: "file 3"
        },
        {
            type: "file",
            name: "file 4"
        }
    ]
}
