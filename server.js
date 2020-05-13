const express = require('express')
const path = require('path')
const os = require('os')
const { getHomePath, getDirContent, openFileOSDefault, isDirectory } = require('./src/services/ffhelper')

const app = express()
app.use(express.static(path.join(__dirname, 'src', 'public')))
app.use(express.json())

app.get('/get-home-content', async (req, res, next) => {
    try {
        const url = getHomePath()
        const content = await getDirContent(url)
        // console.log(content)
        res.json({ url, content })
    }
    catch(err) {
        res.json({ err })
    }
})

app.post('/open-file', async (req, res, next) => {
    try {
        const data = req.body
        const url = path.join(data.current, data.target)
        let isSuccessful = openFileOSDefault(url)
        res.json({
            msg: 'Trying to open with OS Default ...',
            isSuccessful
        })
    } 
    catch (err) {
        console.log(err)
        res.json({ err })
    }
})

app.post('/open-url', async (req, res, next) => {
    try {
        const data = req.body
        const url = path.normalize(data.url)
        if(isDirectory(url)) {
            const content = await getDirContent(url)
            // console.log(content)
            res.json({ url, content })
        }
        else {
            let isSuccessful = openFileOSDefault(url)
            res.json({
                msg: 'Trying to open with OS Default ...',
                isSuccessful
            })
        }
    }
    catch (err) {
        console.log(err)
        res.json({ err })
    }
})

app.post('/get-dir-content', async (req, res, next) => {
    try {
        const data = req.body
        const url = path.join(data.current, data.target)
        const content = await getDirContent(url)
        // console.log(content)
        res.json({ url, content })
    }
    catch(err) {
        res.json({ err })
    }
})

app.use('/', (req, res, next) => {
    res.send('Welcome to Fexplo - your own file explorer...')
})



app.listen(9090, () => {
    console.log('Server started. Open http://localhost:9090 to use Fexplo')
})