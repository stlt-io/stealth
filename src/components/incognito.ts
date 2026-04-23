const detectChromium = async (): Promise<boolean | null> => {
  try {
    const nav: any = navigator
    if (!nav.storage || typeof nav.storage.estimate !== 'function') return null
    const { quota } = await nav.storage.estimate()
    if (!quota) return null
    const mem = (nav as any).deviceMemory
      ? (nav as any).deviceMemory * 1024 * 1024 * 1024
      : 1024 * 1024 * 1024
    return quota < mem
  } catch {
    return null
  }
}

const detectFirefox = (): boolean | null => {
  try {
    const ua = navigator.userAgent || ''
    if (!/Firefox/i.test(ua)) return null
    return navigator.serviceWorker === undefined
  } catch {
    return null
  }
}

const detectSafari = (): Promise<boolean | null> => {
  return new Promise((resolve) => {
    try {
      const ua = navigator.userAgent || ''
      const isSafari = /Safari/.test(ua) && !/Chrome|Chromium|Edg/.test(ua)
      if (!isSafari) {
        resolve(null)
        return
      }
      const w: any = window
      if (typeof w.safari !== 'undefined' && w.safari.pushNotification) {
        const str = w.safari.pushNotification.toString()
        resolve(str.indexOf('[native code]') === -1)
        return
      }
      try {
        w.openDatabase(null, null, null, null)
        resolve(false)
      } catch {
        resolve(true)
      }
    } catch {
      resolve(null)
    }
  })
}

const incognito = async () => {
  try {
    const ua = navigator.userAgent || ''
    const engine = /Firefox/i.test(ua)
      ? 'firefox'
      : /Chrome|Chromium|Edg/.test(ua)
      ? 'chromium'
      : /Safari/.test(ua)
      ? 'safari'
      : 'unknown'

    let isPrivate: boolean | null = null

    if (engine === 'chromium') isPrivate = await detectChromium()
    else if (engine === 'firefox') isPrivate = detectFirefox()
    else if (engine === 'safari') isPrivate = await detectSafari()

    return {
      incognito: {
        engine,
        isPrivate
      }
    }
  } catch {
    return { incognito: null }
  }
}

export default incognito
