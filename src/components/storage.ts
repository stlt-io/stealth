const storage = () => {
  return new Promise(async (resolve) => {
    try {
      const quota = await Promise.all([
        new Promise((resolve) => {
          try {
            navigator.storage
              .estimate()
              .then(({ quota }) => resolve(quota))
              .catch(() => resolve(null))
          } catch {
            resolve(null)
          }
        }),
        new Promise((resolve) => {
          try {
            navigator.webkitTemporaryStorage.queryUsageAndQuota(
              (_: any, quota: any) => {
                resolve(quota)
              }
            )
          } catch {
            resolve(null)
          }
        })
      ]).then(([quota1, quota2]) => quota2 || quota1)

      resolve({
        storage: {
          quota
        }
      })
    } catch {
      resolve({ storage: null })
    }
  })
}

export default storage
