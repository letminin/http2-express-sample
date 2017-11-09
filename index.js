/**
 * Proof of concept
 * Http2 using speedy module support http1.1, http2, spdy
 *
 */
const spdy = require('spdy')
const express = require('express')
const fs = require('mz/fs')
const yargs = require('yargs')

const app = express()

const args = yargs.usage('Usage: $0 <command> [options]')
    .describe('protocol', 'Choose which protocol to use [http/1.1, http/2]')
    .alias('p', 'protocol')
    .help()
    .argv

const HTTP2 = 'http/2'
const PORT = 8000
//define assets for push feature
const assets = [
    { path: 'public/assets/js/misc.js',    res: {'content-type': 'application/javascript'}},
    { path: 'public/assets/js/sample.js',  res: {'content-type': 'application/javascript'}}
]
app.use(express.static('public'))

/**
 *   Test push features
 *   Send assets before sending anything else
 *   speed-up load page
 */
if (args.protocol === HTTP2) {
    app.get('/', (req, res) => {
        Promise.all(assets.map(asset => fs.readFile(asset)))
            .then(files => {
                //ensure Push feature is up
                if (req.push) {
                    //send assets
                    files.forEach(file => {
                        //setup stream push
                        const stream = res.push(file.path, {req: {'accept': '**/*'}, res: file.res})

                        //catch err
                        stream.on('error', err => {
                            console.log(err);
                        })

                        //ending stream here
                        stream.end(file);
                    })

                    //send then index when all deps are resolved
                    fs.readFile('public/index.html')
                        .then(indexFile => {
                            res.end(indexFile)
                        }).catch(err => res.status(500).send(err.toString()))
                }

            })
            .catch(err => res.status(500).send(err.toString()))
    })
} else {
    app.get('/', (req, res) => {
        fs.readFile('public/index.html')
            .then(indexFile => {
                res.status(200).send(indexFile)
            })
    })
}

/**
 *  GET  /me return user information
 *  GET  /products return user product
 *
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

if (args.protocol === HTTP2) {
    spdy.createServer({
        key: fs.readFileSync('./server.key'),
        cert: fs.readFileSync('./server.crt')
    }, app)
        .listen(PORT, err => {
            if (err) throw err
            console.log(`Server http/2 started on port 8080`)
        })

} else {
    //start standard express server
    app.listen(PORT, err => {
        if (err) throw err
        console.log(`Server http/1.1 started on port 8080`)
    })
}