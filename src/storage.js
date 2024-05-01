const storage = async () => {
  const [quota, persist, persisted] = await Promise.all([
    Promise.all([
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
          navigator.webkitTemporaryStorage.queryUsageAndQuota((_, quota) => {
            resolve(quota)
          })
        } catch {
          resolve(null)
        }
      })
    ]).then(([quota1, quota2]) => quota2 || quota1),
    new Promise((resolve) => {
      try {
        navigator.storage
          .persist()
          .then((persist) => resolve(persist))
          .catch(() => resolve(null))
      } catch {
        resolve(null)
      }
    }),
    new Promise((resolve) => {
      try {
        navigator.storage
          .persisted()
          .then((persisted) => resolve(persisted))
          .catch(() => resolve(null))
      } catch (error) {
        resolve(null)
      }
    })
  ])

  return Promise.allSettled([quota, persist, persisted]).then(
    ([quota, persist, persisted]) => {
      return {
        storage: {
          quota: quota.value,
          persist: persist.value,
          persisted: persisted.value
        }
      }
    }
  )
}

export default storage
