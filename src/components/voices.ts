import hash from '../utils/hash'

const getVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    try {
      if (typeof speechSynthesis === 'undefined') {
        resolve([])
        return
      }

      const existing = speechSynthesis.getVoices()
      if (existing && existing.length > 0) {
        resolve(existing)
        return
      }

      let resolved = false
      const onChange = () => {
        if (resolved) return
        resolved = true
        speechSynthesis.removeEventListener('voiceschanged', onChange)
        resolve(speechSynthesis.getVoices() || [])
      }

      speechSynthesis.addEventListener('voiceschanged', onChange)

      setTimeout(() => {
        if (resolved) return
        resolved = true
        speechSynthesis.removeEventListener('voiceschanged', onChange)
        resolve(speechSynthesis.getVoices() || [])
      }, 300)
    } catch {
      resolve([])
    }
  })
}

const voices = async () => {
  try {
    const list = await getVoices()
    const names = list
      .map((v) => `${v.name}|${v.lang}|${v.default ? 1 : 0}|${v.localService ? 1 : 0}`)
      .sort()

    return {
      voices: {
        count: names.length,
        hash: hash(names.join('::')),
        list: names
      }
    }
  } catch {
    return { voices: null }
  }
}

export default voices
