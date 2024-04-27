# Stlt - Stealth

Device fingerprinting

(work in progress)

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
