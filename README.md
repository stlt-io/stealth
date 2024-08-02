# Stlt - Stealth

Device fingerprinting and browser information.

See the working [demo](https://stlt.io) in action.

## How to use

```
import stealth from '@stltio/stealth'
const result = await stealth()
const {
  local: {},
  remote: {},
  visitorId: 'abc...xyz',
  ms: 491
} = result
```

## Use in ReactJs

```
import stealth from '@stltio/stealth'

const [data, setData] = useState({ local: {}, remote: {}, visitorId: '', ms: 0 })

useEffect(() => {
  const init = async () => {
    const s = await stealth()
    setData(s)
  }
  init()
}, [])
```

## ApiKey

If `apiKey` is provided, send the payload to the server (more accurate results).
Want an API_KEY? Contact us at [hello@stlt.io](mailto:hello@stlt.io).

### Example with API_KEY

```
import stealth from '@stltio/stealth'
const result = await stealth({ apiKey: 'aaa...bbb'})
const {
  local: {},
  remote: {},
  visitorId: 'abc...xyz',
  ms: 491
} = result

```

## Ignore list

You can exclude some tests by providing an array of keys to ignore.

### Example with ignore list

```
import stealth from '@stltio/stealth'
const result = await stealth({ ignore: ['audio', 'webrtc']})
const {
  local: {},
  remote: {},
  visitorId: 'abc...xyz',
  ms: 491
} = result
```

## Debug

You can enable debug mode by setting `debug` to `true`.

It will print in the console the lolcal generated payload and the remote response.

### Example with debug

```
import stealth from '@stltio/stealth'
const result = await stealth({ debug: true })
const {
  local: {},
  remote: {},
  visitorId: 'abc...xyz',
  ms: 491
} = result
```
