const gpu = () => {
  return new Promise(async (resolve) => {
    try {
      const canvas = document.createElement('canvas')
      const gl: WebGLRenderingContext | null =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (gl) {
        var debugInfo = gl.getExtension('WEBGL_debug_renderer_info') || null
        if (debugInfo) {
          const vendor =
            gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || null
          const gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || null
          resolve({ gpu: { gpu, vendor } })
        }
      }
    } catch (err) {
      resolve({ gpu: null })
    }
  })
}

export default gpu
