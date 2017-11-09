
const API_BASE_URL = 'https://localhost:8000'
console.log('Testing http2 protocol yihaaaa !', 'XHR call')

document.addEventListener('DOMContentLoaded', () => {
    console.log('on load called')

    const meContainer = document.getElementById('data')
    const productContainer = document.getElementById('product')

    axios.get(`${API_BASE_URL}/me`)
        .then(info => {
            const textNode = document.createTextNode(JSON.stringify(info.data));
            meContainer.appendChild(textNode)
        })

    axios.get(`${API_BASE_URL}/product`)
        .then(info => {
            const textNode = document.createTextNode(JSON.stringify(info.data))
            productContainer.appendChild(textNode)
        })
}, false)
