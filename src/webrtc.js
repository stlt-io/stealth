const webrtc = () => {
  return new Promise(async (resolve) => {
    try {
      const video = {
        width: 1920,
        height: 1080,
        bitrate: 120000,
        framerate: 60
      }

      const audio = {
        channels: 2,
        bitrate: 300000,
        samplerate: 5200
      }

      const codecs = [
        'audio/ogg; codecs=vorbis',
        'audio/ogg; codecs=flac',
        'audio/mp4; codecs="mp4a.40.2"',
        'audio/mpeg; codecs="mp3"',
        'video/ogg; codecs="theora"',
        'video/mp4; codecs="avc1.42E01E"'
      ]

      const decodingInfo = codecs.map((codec) => {
        const config = getMediaConfig(codec, video, audio)
        // @ts-ignore
        return navigator.mediaCapabilities
          .decodingInfo(config)
          .then((support) => ({
            codec,
            ...support
          }))
          .catch((error) => console.error(codec, error))
      })

      const capabilities = await Promise.all(decodingInfo)
        .then((data) => {
          return data.reduce((acc, support) => {
            const { codec, supported, smooth, powerEfficient } = support || {}
            if (!supported) return acc
            return {
              ...acc,
              ['' + codec]: [
                ...(smooth ? ['smooth'] : []),
                ...(powerEfficient ? ['efficient'] : [])
              ]
            }
          }, {})
        })
        .catch((error) => console.error(error))

      resolve({ webrtc: capabilities })

      resolve({
        webrtc: {}
      })
    } catch (err) {
      resolve({ webrtc: null })
    }
  })
}

const getMediaConfig = (codec, video, audio) => ({
  type: 'file',
  video: !/^video/.test(codec)
    ? undefined
    : {
        contentType: codec,
        ...video
      },
  audio: !/^audio/.test(codec)
    ? undefined
    : {
        contentType: codec,
        ...audio
      }
})

export default webrtc
