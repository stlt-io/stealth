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

import config from './config'

export default async function stealth({
  apiKey,
  debug
}: {
  apiKey?: string
  debug?: boolean
}) {
  const start = window.performance.now() as number
  return Promise.all([
    audio(),
    browser(),
    canvas(),
    device(),
    devices(),
    fonts(),
    intl(),
    math(),
    permissions(),
    screen(),
    storage(),
    webgl(),
    webrtc()
  ]).then((data) => {
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
        .then((response) => {
          return {
            visitorId: response.data.visitorId,
            local: payload.local,
            ms: Math.round(window.performance.now() - start),
            remote: response.data
          }
        })
        .catch((error) => {
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
  })
}
