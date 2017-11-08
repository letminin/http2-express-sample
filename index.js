const spdy = require('spdy')
const express = require('express')
const fs = require('mz/fs')

const app = express()

app.use(express.static('public'))


app.get('/', (req, res) => {
    fs.readFile('index.html')
      .then(file => {
          
          res.writeHead(200)
          res.end(file)
      })
      .catch(err => res.status(500).send(error.toString())  
})


spdy.createServer({
    key:  fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.crt')
}, app)
    .listen(8080, err => {
        if (err) throw err
        console.log('Server start on port 8080')
    })
    