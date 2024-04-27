const device = () => {
  const memoryInfo =
    window.performance && window.performance.memory
      ? window.performance.memory
      : 0

  return {
    hardwareConcurrency: navigator.hardwareConcurrency,
    memory: navigator.deviceMemory,
    platform: navigator?.userAgentData?.platform || 'unknown',
    mobile: navigator?.userAgentData?.mobile || 'unknown',
    vendor: navigator?.userAgentData?.vendor || 'unknown',
    architecture: getArchitecture(),
    videoCard: getVideoCard()
  }
}

const getVideoCard = () => {
  const canvas = document.createElement('canvas')
  const gl =
    canvas.getContext('webgl') ?? canvas.getContext('experimental-webgl')
  if (gl && 'getParameter' in gl) {
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
    return {
      vendor: (gl.getParameter(gl.VENDOR) || '').toString(),
      vendorUnmasked: debugInfo
        ? (gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || '').toString()
        : '',
      renderer: (gl.getParameter(gl.RENDERER) || '').toString(),
      rendererUnmasked: debugInfo
        ? (gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '').toString()
        : '',
      version: (gl.getParameter(gl.VERSION) || '').toString(),
      shadingLanguageVersion: (
        gl.getParameter(gl.SHADING_LANGUAGE_VERSION) || ''
      ).toString()
    }
  }
  return 'undefined'
}

const getArchitecture = () => {
  const f = new Float32Array(1)
  const u8 = new Uint8Array(f.buffer)
  f[0] = Infinity
  f[0] = f[0] - f[0]

  return u8[3]
}

export default device
