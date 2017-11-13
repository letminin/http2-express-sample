/**
 * Proof of concept Push
 * Http2 using speedy module (support protocol [http/1.1, http/2, spdy/3.1])
 *
 */
const spdyd = require('spdy')
const express = require('express')
const fs = require('mz/fs')
const path = require('path')
const app = express()
const url = require('url')
const logger = require('morgan')
app.use(logger('dev'))
const HTTPS_PORT = 8000
const HTTP_PORT = 8080
const index =  fs.readFileSync('push/index.html')

//define assets for push feature
const assets = ['/misc.js','/sample.js', '/node-university-animation.gif']
    .map(assetPath => Object.assign({ headers:{}, assetPath, data: fs.readFileSync(path.join(__dirname, 'push', assetPath))}))
console.log('Assets to push', assets)

//Simulate latency
const sleep = (ms) =>  new Promise((resolve) => ms === 0 ? resolve() : setTimeout(resolve, ms))

/**
 * Middleware push http/2
 */
app.use((req, res, next) => {
    let ressource = url.parse(req.url).pathname.substr(1)
    //ensure push feature is up
    if (req.push) {
        if (ressource === '' || ressource === '/') {
            assets.forEach(asset => {
                console.log("push", asset.assetPath)
                try {
                    const stream = res.push(asset.assetPath, {req: {'accept': '**/*'}, res: asset.headers})
                    stream.on('error', console.log)
                    stream.end(asset.data)
                } catch (e) {
                    console.log(e)
                }
            })
            //simulate latency
            sleep(0)
                .then(()=> res.end(index))
        } else {
            const file = assets.filter(asset => asset.assetPath.includes(ressource))
            if (!file.length) return next()
            res.write(file[0].data)
            res.end()
        }
    } else {
        //backward http/1.1
        res.send(index)
    }
})

/**
 * simple route for debug usage
 *   - Server   spdy:connection:server (connection setup)
 *   - Stream   spdy:stream:server
 *   - Frame    spdy:framer
 *   - Priorize spdy:priority
 *
 * Usage :
 *      DEBUG=* node index.js
 *
 */
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
    if (err) throw err
    console.log(`Server http/1.1 started on port ${HTTP_PORT}`)
})

/**
 *   Start http/2 server
 *   spdy.createServer will overidde req & res
 *
 */
spdyd.createServer({
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
        console.log(`[PUSH] Server https/2 TLS started on port ${HTTPS_PORT}`)
    })