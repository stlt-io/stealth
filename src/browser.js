const browser = () => {
  return new Promise((resolve, reject) => {
    try {
      resolve({
        userAgent: navigator.userAgent,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        oscpu: navigator.oscpu,
        userAgentData: navigator.userAgentData,
        webdriver: navigator.webdriver,
        doNotTrack: navigator.doNotTrack,
        pdfViewerEnabled: navigator.pdfViewerEnabled,
        applePayVersion: getApplePayVersion(),
        ...getBrowser()
      })
    } catch (error) {
      reject(error)
    }
  })
}

const getBrowser = () => {
  if (typeof navigator === 'undefined') {
    return {
      name: 'unknown',
      version: 'unknown'
    }
  }
  const ua = navigator.userAgent
  // Define some regular expressions to match different browsers and their versions
  const regexes = [
    // Edge
    /(?<name>Edge|Edg)\/(?<version>\d+(?:\.\d+)?)/,
    // Chrome, Chromium, Opera, Vivaldi, Brave, etc.
    /(?<name>(?:Chrome|Chromium|OPR|Opera|Vivaldi|Brave))\/(?<version>\d+(?:\.\d+)?)/,
    // Firefox, Waterfox, etc.
    /(?<name>(?:Firefox|Waterfox|Iceweasel|IceCat))\/(?<version>\d+(?:\.\d+)?)/,
    // Safari, Mobile Safari, etc.
    /(?<name>Safari)\/(?<version>\d+(?:\.\d+)?)/,
    // Internet Explorer, IE Mobile, etc.
    /(?<name>MSIE|Trident|IEMobile).+?(?<version>\d+(?:\.\d+)?)/,
    // Other browsers that use the format "BrowserName/version"
    /(?<name>[A-Za-z]+)\/(?<version>\d+(?:\.\d+)?)/,
    // Samsung internet browser
    /(?<name>SamsungBrowser)\/(?<version>\d+(?:\.\d+)?)/
  ]

  const browserNameMap = {
    Edg: 'Edge',
    OPR: 'Opera'
  }

  for (const regex of regexes) {
    const match = ua.match(regex)
    if (match && match.groups) {
      const name = browserNameMap[match.groups.name] || match.groups.name
      return {
        name: name,
        version: match.groups.version
      }
    }
  }

  return {
    name: 'unknown',
    version: 'unknown'
  }
}

const getApplePayVersion = () => {
  if (
    window.location.protocol === 'https:' &&
    typeof window.ApplePaySession === 'function'
  ) {
    try {
      const versionCheck = window.ApplePaySession.supportsVersion
      for (let i = 15; i > 0; i--) {
        if (versionCheck(i)) {
          return i
        }
      }
    } catch (error) {
      return 0
    }
  }
  return 0
}

export default browser
