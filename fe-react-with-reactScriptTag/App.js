
(function(){
    const os = require("os")
    const fs = require("fs")
    const path = require('path')

    const homedir = os.homedir()

    fs.readdir(path.resolve(homedir), (err, l) => console.log('File List = ', l))
    const App = () => {
        return (
            <div>
                Hello Bro!
            </div>
        )
    }

    const htmlRoot = document.getElementById("root")
    ReactDOM.render(<App />, htmlRoot)
})()