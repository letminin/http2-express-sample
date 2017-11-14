/**
 * Quick html builder tiles
 */
const fs = require('fs')
const X_TILES_MAX = 31
const Y_TILES_MAX = 31

const dest = 'index.html'
const imgPath = '/assets/images/landscape [www.imagesplitter.net]'
let data = `<html><body onload='showtimes()'>`
for (let y = 0; y<= Y_TILES_MAX; y++) {
    for (let x = 0; x <= X_TILES_MAX; x++) {
        data += `<img src='${imgPath}-${y}-${x}.jpeg '></img>`
    }
    data+= '<br/>'
}
data += `<div id="loadtimes"></div>
<div style="float:left;">
    <p><a href="https://localhost">HTTP/2 loading multiplex + TLS negotiation delay</a></p>
    <p><a href="http://localhost">HTTP/1.1 loading</a></p>
</div>
<script>
    const showtimes= ()=>{
        let times = 'Times from connection start:<br>'
        times += 'DOM loaded: ' + (window.performance.timing.domContentLoadedEventEnd - window.performance.timing.connectStart) + 'ms<br>'
        times += 'DOM complete (images loaded): ' + (window.performance.timing.domComplete - window.performance.timing.connectStart) + 'ms<br>'
        document.getElementById('loadtimes').innerHTML = times
    }
</script>`
fs.writeFileSync(dest, data)
console.log('Make tiles html', dest, 'succeed')