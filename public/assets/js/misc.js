const url = new URL(window.location.href)
const PROXY_LOCATION = 'api'
const REVERSE_PROXY_ENABLED = true
const API_BASE_URL = URL.origin
const API_URL = REVERSE_PROXY_ENABLED ? `${url.protocol}/${url.hostname}/${PROXY_LOCATION}` : API_BASE_URL

document.addEventListener('DOMContentLoaded', () => {
    const meContainer = document.getElementById('data')
    const productContainer = document.getElementById('product')

    axios.get(`${PROXY_LOCATION}/me`)
        .then(info => {
            const textNode = document.createTextNode(JSON.stringify(info.data));
            meContainer.appendChild(textNode)
        })

    axios.get(`${PROXY_LOCATION}/product`)
        .then(info => {
            const textNode = document.createTextNode(JSON.stringify(info.data))
            productContainer.appendChild(textNode)
        })

}, false)
