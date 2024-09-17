import axios from 'axios'
import jsSHA from 'jssha'

import canvas from './components/canvas'
import device from './components/device'
import permissions from './components/permissions'
import screen from './components/screen'
import browser from './components/browser'
import intl from './components/intl'
import audio from './components/audio'
import webgl from './components/webgl'
import math from './components/math'
import fonts from './components/fonts'
import storage from './components/storage'
import devices from './components/devices'
import webrtc from './components/webrtc'
import gpu from './components/gpu'

import config from './config'

export default async function stealth({
  apiKey,
  debug,
  ignore
}: {
  apiKey?: string
  debug?: boolean
  ignore?: string[]
} = {}) {
  const start = window.performance.now() as number

  if (!ignore) {
    ignore = []
  }

  const p = []
  if (!ignore.includes('audio')) p.push(audio())
  if (!ignore.includes('browser')) p.push(browser())
  if (!ignore.includes('canvas')) p.push(canvas())
  if (!ignore.includes('device')) p.push(device())
  if (!ignore.includes('devices')) p.push(devices())
  if (!ignore.includes('fonts')) p.push(fonts())
  if (!ignore.includes('gpu')) p.push(gpu())
  if (!ignore.includes('intl')) p.push(intl())
  if (!ignore.includes('math')) p.push(math())
  if (!ignore.includes('permissions')) p.push(permissions())
  if (!ignore.includes('screen')) p.push(screen())
  if (!ignore.includes('storage')) p.push(storage())
  if (!ignore.includes('webgl')) p.push(webgl())
  if (!ignore.includes('webrtc')) p.push(webrtc())

  let data: any = []

  for await (const f of p) {
    try {
      const d: any = await f
      data.push(d)
    } catch (e) {
      if (debug) {
        console.error(e)
      }
    }
  }

  const local = data.reduce((acc: any, cur: any) => {
    Object.keys(cur).forEach((key) => {
      acc[key] = cur[key]
    })
    return acc
  }, {}) as any

  const payload = {
    local: {
      ...local,
      hash: new jsSHA('SHA-256', 'TEXT', { encoding: 'UTF8' })
        .update(JSON.stringify(local))
        .getHash('HEX')
    }
  }

  if (debug) {
    console.log(payload.local.hash)
    console.log(payload.local)
  }

  // If apiKey is provided, send the payload to the server (more accurate results)
  // Want an API_KEY? Contact us at hello@stlt.io
  if (apiKey) {
    const axiosInstance = axios.create()
    axiosInstance.defaults.withCredentials = true
    axiosInstance.defaults.headers.common['x-api-key'] = apiKey
    return axiosInstance
      .get(`${config.apiBaseUrl}/${payload.local.hash}`)
      .then((response: any) => {
        if (debug) {
          console.log(response.data)
        }
        return {
          visitorId: response.data.visitorId,
          local: payload.local,
          ms: Math.round(window.performance.now() - start),
          remote: response.data
        }
      })
      .catch((error: Error) => {
        console.log(error.message)
        return {
          visitorId: payload.local.hash,
          local: payload.local,
          ms: Math.round(window.performance.now() - start),
          remote: {}
        }
      })
  } else {
    return {
      visitorId: payload.local.hash,
      local: payload.local,
      ms: Math.round(window.performance.now() - start),
      remote: {}
    }
  }
}
