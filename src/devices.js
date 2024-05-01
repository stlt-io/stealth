const devices = () => {
  return new Promise((resolve) => {
    try {
      if (!navigator?.mediaDevices?.enumerateDevices) resolve({ devices: null })

      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          resolve({ devices: devices.map((device) => device.kind).sort() })
        })
        .catch(() => resolve({ devices: null }))
    } catch {
      resolve({ devices: null })
    }
  })
}

export default devices
