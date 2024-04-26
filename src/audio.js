import hash from './hash.js'

const audio = () => {
  return new Promise((resolve, reject) => {
    try {
      // Set up audio parameters
      const sampleRate = 44100
      const numSamples = 5000
      const audioContext = new (window.OfflineAudioContext ||
        window.webkitOfflineAudioContext)(1, numSamples, sampleRate)
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
      let samples

      audioContext.oncomplete = (event) => {
        samples = event.renderedBuffer.getChannelData(0)
        resolve({
          sampleHash: hash(samples.join(',')),
          oscillator: oscillator.type,
          maxChannels: audioContext.destination.maxChannelCount,
          channelCountMode: audioBuffer.channelCountMode
        })
      }

      audioContext.startRendering()
    } catch (error) {
      console.error('Error creating audio fingerprint:', error)
      reject(error)
    }
  })
}

export default audio
