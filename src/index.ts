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

import { sha256 } from './utils/hash'
import config from './config'

const CACHE_KEY = 'stlt_stealth_v1'

type Options = {
  apiKey?: string
  debug?: boolean
  ignore?: string[]
  cache?: boolean
}

type Result = {
  visitorId: string
  local: Record<string, any>
  remote: Record<string, any>
  ms: number
}

const componentMap: Record<string, () => Promise<any>> = {
  audio,
  browser,
  canvas,
  device,
  devices,
  fonts,
  gpu,
  intl,
  math,
  permissions,
  screen,
  storage,
  webgl,
  webrtc
}

export default async function stealth({
  apiKey,
  debug,
  ignore = [],
  cache = true
}: Options = {}): Promise<Result> {
  const start = window.performance.now()

  if (cache) {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY)
      if (cached) {
        const parsed = JSON.parse(cached) as Result
        return { ...parsed, ms: Math.round(window.performance.now() - start) }
      }
    } catch {}
  }

  const skip = new Set(ignore)
  const tasks: Promise<any>[] = []
  for (const key of Object.keys(componentMap)) {
    if (!skip.has(key)) tasks.push(componentMap[key]())
  }

  const settled = await Promise.allSettled(tasks)
  const local: Record<string, any> = {}
  for (const r of settled) {
    if (r.status === 'fulfilled' && r.value) {
      Object.assign(local, r.value)
    } else if (r.status === 'rejected' && debug) {
      console.error(r.reason)
    }
  }

  const hash = await sha256(JSON.stringify(local))
  const payload = { local: { ...local, hash } }

  if (debug) {
    console.log(payload.local.hash)
    console.log(payload.local)
  }

  let result: Result

  if (apiKey) {
    try {
      const res = await fetch(`${config.apiBaseUrl}/${payload.local.hash}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'x-api-key': apiKey }
      })
      const data = await res.json()
      if (debug) console.log(data)
      result = {
        visitorId: data.visitorId,
        local: payload.local,
        ms: Math.round(window.performance.now() - start),
        remote: data
      }
    } catch (error: any) {
      if (debug) console.log(error?.message)
      result = {
        visitorId: payload.local.hash,
        local: payload.local,
        ms: Math.round(window.performance.now() - start),
        remote: {}
      }
    }
  } else {
    result = {
      visitorId: payload.local.hash,
      local: payload.local,
      ms: Math.round(window.performance.now() - start),
      remote: {}
    }
  }

  if (cache) {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(result))
    } catch {}
  }

  return result
}
