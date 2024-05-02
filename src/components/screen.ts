const screenDetails = () => {
  return new Promise((resolve) => {
    try {
      resolve({
        screen: {
          isTouchscreen: navigator.maxTouchPoints > 0,
          maxTouchPoints: navigator.maxTouchPoints,
          colorDepth: screen.colorDepth,
          mediaMatches: matchMedias()
        }
      })
    } catch (error) {
      resolve({ screen: null })
    }
  })
}

const matchMedias = () => {
  let results: any[] = []

  const mediaQueries = {
    'prefers-contrast': [
      'high',
      'more',
      'low',
      'less',
      'forced',
      'no-preference'
    ],
    'any-hover': ['hover', 'none'],
    'any-pointer': ['none', 'coarse', 'fine'],
    pointer: ['none', 'coarse', 'fine'],
    hover: ['hover', 'none'],
    update: ['fast', 'slow'],
    'inverted-colors': ['inverted', 'none'],
    'prefers-reduced-motion': ['reduce', 'no-preference'],
    'prefers-reduced-transparency': ['reduce', 'no-preference'],
    scripting: ['none', 'initial-only', 'enabled'],
    'forced-colors': ['active', 'none']
  }

  Object.keys(mediaQueries).forEach((key) => {
    mediaQueries[key].forEach((value: any) => {
      if (matchMedia(`(${key}: ${value})`).matches)
        results.push(`${key}: ${value}`)
    })
  })
  return results
}

export default screenDetails
