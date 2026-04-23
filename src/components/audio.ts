import hash from '../utils/hash'

const audio = () => {
  return new Promise((resolve) => {
    try {
      const sampleRate = 44100
      const numSamples = 1000
      const Ctx =
        window.OfflineAudioContext ||
        (window as any).webkitOfflineAudioContext
      const audioContext = new Ctx(1, numSamples, sampleRate)
      const audioBuffer = audioContext.createBufferSource()

      const oscillator = audioContext.createOscillator()
      oscillator.frequency.value = 1000
      const compressor = audioContext.createDynamicsCompressor()
      compressor.threshold.value = -50
      compressor.knee.value = 40
      compressor.ratio.value = 12
      compressor.attack.value = 0
      compressor.release.value = 0.2
      oscillator.connect(compressor)
      compressor.connect(audioContext.destination)
      oscillator.start()

      audioContext.oncomplete = (event: OfflineAudioCompletionEvent) => {
        const samples = event.renderedBuffer.getChannelData(0)
        let sum = 0
        for (let i = 0; i < samples.length; i++) sum += Math.abs(samples[i])
        resolve({
          audio: {
            sampleHash: hash(sum.toString()),
            oscillator: oscillator.type,
            maxChannels: audioContext.destination.maxChannelCount,
            channelCountMode: audioBuffer.channelCountMode
          }
        })
      }

      audioContext.startRendering()
    } catch (error) {
      resolve({ audio: null })
    }
  })
}

export default audio
