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
import emoji from './components/emoji'
import voices from './components/voices'
import codecs from './components/codecs'
import incognito from './components/incognito'

import { sha256Short } from './utils/hash'
import config from './config'

const CACHE_KEY = 'stlt_stealth_v1'

export type Options = {
  apiKey?: string
  debug?: boolean
  ignore?: string[]
  cache?: boolean
  short?: boolean
}

export type Incognito = {
  engine: 'chromium' | 'firefox' | 'safari' | 'unknown'
  isPrivate: boolean | null
}

export type Result = {
  visitorId: string
  local: Record<string, any>
  remote: Record<string, any>
  ms: number
  incognito: Incognito | null
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
  webrtc,
  emoji,
  voices,
  codecs,
  incognito
}

export default async function stealth({
  apiKey,
  debug,
  ignore = [],
  cache = true,
  short = false
}: Options = {}): Promise<Result> {
  const start = window.performance.now()

  if (cache && !debug) {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY)
      if (cached) {
        const parsed = JSON.parse(cached) as Result
        return { ...parsed, ms: Math.round(window.performance.now() - start) }
      }
    } catch {}
  }

  if (debug) {
    try {
      if (sessionStorage.getItem(CACHE_KEY)) {
        console.log('[stealth] cache present (bypassed by debug)')
      }
    } catch {}
  }

  const skip = new Set(ignore)
  const names: string[] = []
  const tasks: Promise<any>[] = []
  for (const key of Object.keys(componentMap)) {
    if (skip.has(key)) continue
    names.push(key)
    if (debug) {
      const t0 = window.performance.now()
      tasks.push(
        componentMap[key]().then((v) => {
          console.log(`[stealth] ${key}: ${Math.round(window.performance.now() - t0)}ms`)
          return v
        })
      )
    } else {
      tasks.push(componentMap[key]())
    }
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

  const { incognito: incognitoData, ...hashable } = local
  const serialized = JSON.stringify(hashable)
  const hash = await sha256Short(serialized, short ? 16 : 20)
  const payload = { local: { ...hashable, hash } }
  const incognitoOut = (incognitoData as Incognito | null | undefined) ?? null

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
        remote: data,
        incognito: incognitoOut
      }
    } catch (error: any) {
      if (debug) console.log(error?.message)
      result = {
        visitorId: payload.local.hash,
        local: payload.local,
        ms: Math.round(window.performance.now() - start),
        remote: {},
        incognito: incognitoOut
      }
    }
  } else {
    result = {
      visitorId: payload.local.hash,
      local: payload.local,
      ms: Math.round(window.performance.now() - start),
      remote: {},
      incognito: incognitoOut
    }
  }

  if (cache) {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(result))
    } catch {}
  }

  return result
}
