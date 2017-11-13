/**
 * POC HTTP/2
 * API HTTP/1.1
 */
const express = require('express')
const app = express()
const logger = require('morgan')
const HTTP_PORT = 3010

//helper latency
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, parseInt(ms)))

app.use((req, res, next) => req.query.latency ? sleep(req.query.latency).then(()=> {next()}) : next())

app.use(logger('dev'))

//default middleware, will by default use h2
app.use(express.static('public'))

//debug usage for inspect spdy module
app.get('/debug', (req, res) =>  res.status(200).send('Keep alive'))

/**
 * Simple get routes
 */
app.get('/me', (req, res) => {
    const data = {
        firstName: 'Jon',
        lastName: 'Doe',
        age: 34,
        address: '37 rue miguel hidalgo, 75019 Paris'
    }
    res.status(200).send(data)
})

app.get('/product', (req, res) => {
    const data = {
        productName: 'Apple macbook pro retina',
        price: 259.95,
        tax: 19.9,
        regionalCode:75,
        countryCode:'FR'
    }
    res.status(200).send(data)
})

//start standard express server legacy
app.listen(HTTP_PORT, err => {
    if (err) return console.log(err.message)
    console.log(`Server http/1.1 started on port ${HTTP_PORT}`)
})
