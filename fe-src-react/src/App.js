import React from 'react';
import './App.css';

const os = window.require('os')

function App() {
  // fs.readdir(path.resolve('/'), (err, l) => console.log('File List = ', l))
  // fs.readdir(path.resolve(__dirname), (err, l) => console.log('File List = ', l))
  // console.log(fs)
  // console.log(path.resolve(__dirname))
  // console.log(global)
  const homedir = os.homedir()
  

  return (
    <div className="App">
    </div>
  );
}

export default App;
