import blockcheck, { getRegions } from './index.mjs'
import countries from './countries.mjs'

fetch('./map.svg')
    .then(m => m.text())
    .then(m => document.querySelector('.mapContainer').innerHTML = m)

const regions = await getRegions()

function getId() {
    try {
        const url = new URL(videoUrl.value)
        if (/(\w+.)?youtube.com/i.test(url.hostname)) 
            return url.searchParams.get('v')

        if ('youtu.be' === url.hostname)
            return url.pathname.slice(1)
    } catch {}

    return videoUrl.value
}

function countryName(code) {
    return countries[code.toLowerCase()]
}

function reset() {
    _generated_css.textContent = ''
    _generated_text.textContent = ''
}

function generateText(availability) {
    if (availability.length === regions.length)
        return 'available everywhere'

    if (availability.length === 0)
        return 'blocked everywhere'

    const blockedIn = regions.filter(r => !availability.includes(r))
    if (blockedIn.length < availability.length) {
        return 'available everywhere, except: \n'
                + blockedIn.map(countryName)
                           .map(s => `- ${s}`)
                           .join('\n')
    }

    return 'blocked everywhere, except: \n'
                + availability.map(countryName)
                              .map(s => `- ${s}`)
                              .join('\n')
}

const delay = async ms => new Promise(resolve => setTimeout(resolve, ms))
let lock = null

async function update() {
    await lock, reset()
    const id = getId()
    if (id.length < 10 || id.length > 20)
        return videoUrl.style.border = '1px solid #fff'

    try {
        const result = await blockcheck(id)

        lock = new Promise(async resolve => {
            const rules = [
                ...result.map(cc => `.${cc.toLowerCase()} { fill: #57b53a !important }`),
                ...regions.filter(cc => !result.includes(cc))
                        .map(cc => `.${cc.toLowerCase()} { fill: #d30102 !important }`)
            ].sort(() => 0.5 - Math.random())

            while (rules.length) {
                _generated_css.textContent += rules.pop()
                await delay(Math.random() * 10)
            }

            resolve()
        })

        _generated_text.textContent = generateText(result)
        videoUrl.style.border = '1px solid #00ff00'
    } catch(e) {
        _generated_text.textContent = 'error: ' + (e.message || e)
        videoUrl.style.border = '1px solid #ff0000'
    }
}

videoUrl.oninput = update