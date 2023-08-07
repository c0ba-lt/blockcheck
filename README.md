![blockcheck](logo.jpg)

tiny module to check youtube video availability

```js
import blockcheck, { getRegions } from 'blockcheck'

// `blockcheck` returns where the video is available
await blockcheck('wH0mWVJWyr4') // ~> []
                                // meaning: "blocked worldwide"

await blockcheck('yGqSlOPhNzg') // ~> ["VN"]
                                // meaning: only available in Vietnam

await blockcheck('l4e_Nba6Bpw') // ~> ['AE', 'AR', 'AT', ..., 'ZA', 'ZW']
                                // meaning: not blocked anywhere (read: available worldwide)


// doing the opposite: getting blocked regions is not
// supported by the `blockcheck` function, but you can do this:
const regions = await getRegions()
const result = new Set(await blockcheck('wH0mWVJWyr4'))
regions.filter(r => !result.has(r)) // ~> ['AE', 'AR', 'AT', ..., 'ZA', 'ZW']
                                         // meaning: blocked worldwide
```