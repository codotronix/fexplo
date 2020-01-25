import React, { useState } from 'react';
import './App.css';
import FFContainer from './components/ffContainer/FFContainer'
import TopNav from './components/topNav/TopNav'
import * as FileManager from './service/FileManager'

function App() {
    // const ffList =  getDummyFList()
    const homepath = FileManager.getHomePath()
    const initFfList =  FileManager.getDirContent(homepath)
    const [pwd, setPwd] = useState(homepath)
    const [ffList, setFFList] = useState(initFfList)


    return (
        <div className="App">
            <TopNav url={pwd}/>
            <FFContainer list={ffList}/>
        </div>
    );
}

export default App;

// function is_dir(path) {
//     try {
//         var stat = fs.lstatSync(path);
//         return stat.isDirectory();
//     } catch (e) {
//         // lstatSync throws an error if path doesn't exist
//         return false;
//     }
// }

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
