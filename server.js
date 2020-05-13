const express = require('express')
const path = require('path')
const os = require('os')
const { getHomePath, getDirContent } = require('./src/services/ffhelper')

const app = express()
app.use(express.static(path.join(__dirname, 'src', 'public')))

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
app.use('/', (req, res, next) => {
    res.send('Welcome to Fexplo - your own file explorer...')
})



app.listen(9090, () => {
    console.log('Server started. Open http://localhost:9090 to use Fexplo')
})