# Stlt - Stealth

Device fingerprinting

(work in progress)

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
