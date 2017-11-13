/**
 * Proof of concept http/2 Multiplexing
 *
 * Default use : Nginx http2 mod
 * route proxy request /api
 */
const spdyd = require('spdy')
const express = require('express')
const app = express()
const logger = require('morgan')
const HTTPS_PORT = 3011
const HTTP_PORT = 3010

//helper latency
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, parseInt(ms)))

//simulate latency mid
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

/**
 *   Start http/2 server
 *   spdy.createServer will overidde req & res
 *
 */
/*spdyd.createServer({
    key:  fs.readFileSync('./cert/server.key'),
    cert: fs.readFileSync('./cert/server.crt'),
    // optional settings spdy
    spdy: {
        protocols: ['h2', 'spdy/3.1', 'http/1.1'],
        plain: false,

        // NOTE: Use with care! This should not be used without some proxy that
        // will *always* send X_FORWARDED_FOR
        'x-forwarded-for': true,

        connection: {
            windowSize: 1024 * 1024,

            // **optional** if true - server will send 3.1 frames on 3.0 *plain* spdy
            autoSpdy31: false
        }
    }
}, app).listen(HTTPS_PORT, err => {
    if (err) throw err
    console.log(`[Multiplexing] Server https/2 TLS started on port ${HTTPS_PORT}`)
})*/