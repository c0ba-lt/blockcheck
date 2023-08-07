const INNERTUBE_API_KEY = 'AIzaSyDCU8hByM-4DrUqRUYnGn-3llEO78bcxq8' // thanks to yt-dlp maintainers

let _regions
export async function getRegions() {
    if (_regions)
        return _regions

    const req = await fetch(`https://www.googleapis.com/youtube/v3/i18nRegions?key=${INNERTUBE_API_KEY}`)
    const res = await req.json()
    if (res.error)
        throw res.error.message

    return _regions = res.items.map(({ id }) => id).sort()
}

async function computeVideoAvailability({ allowed, blocked }) {
    if (allowed)
       return allowed;

    const blockedSet = new Set(blocked)
    return (await getRegions())
           .filter(countryCode => !blockedSet.has(countryCode))
}

export default async function(id) {
    if (typeof id !== 'string')
        throw 'id is not a string'

    const url = new URL('https://www.googleapis.com/youtube/v3/videos?part=contentDetails')
          url.searchParams.set('id', id)
          url.searchParams.set('key', INNERTUBE_API_KEY)

    const res = await (await fetch(url)).json()
    if (res.error)
        throw res.error.message

    if (res.pageInfo?.totalResults !== 1)
        throw 'video not found'

    return await computeVideoAvailability(
        res.items[0].contentDetails.regionRestriction || {}
    )
}
