const permissions = async () => {
  const getPermissionState = (name) =>
    navigator.permissions
      .query({ name })
      .then((res) => ({ name, state: res.state }))
      .catch((error) => ({ name, state: 'unknown' }))

  return !('permissions' in navigator)
    ? undefined
    : Promise.all([
        getPermissionState('accelerometer'),
        getPermissionState('ambient-light-sensor'),
        getPermissionState('background-fetch'),
        getPermissionState('background-sync'),
        getPermissionState('bluetooth'),
        getPermissionState('camera'),
        getPermissionState('clipboard'),
        getPermissionState('device-info'),
        getPermissionState('display-capture'),
        getPermissionState('gamepad'),
        getPermissionState('geolocation'),
        getPermissionState('gyroscope'),
        getPermissionState('magnetometer'),
        getPermissionState('microphone'),
        getPermissionState('midi'),
        getPermissionState('nfc'),
        getPermissionState('notifications'),
        getPermissionState('persistent-storage'),
        getPermissionState('push'),
        getPermissionState('screen-wake-lock'),
        getPermissionState('speaker'),
        getPermissionState('speaker-selection')
      ])
        .then((permissions) => {
          return permissions.reduce((acc, perm) => {
            const { state, name } = perm || {}
            if (acc[state]) {
              acc[state].push(name)
              return acc
            }
            acc[state] = [name]
            return acc
          }, {})
        })
        .catch((error) => console.error(error))
}

export default permissions
