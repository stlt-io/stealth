const webrtc = () => {
  return new Promise(async (resolve) => {
    try {
      const capabilities: any = await getCapabilities()

      const rtcConfig = {
        iceCandidatePoolSize: 1,
        iceServers: [
          {
            urls: [
              'stun:stun.l.google.com:19302',
              'stun:stun1.l.google.com:19302'
            ]
          }
        ]
      }

      var pc = new RTCPeerConnection(rtcConfig)
      pc.createDataChannel('')

      pc.createOffer().then((offer) => {
        pc.setLocalDescription(offer)
      })

      pc.onicecandidate = async (event) => {
        if (event.candidate) {
          const { candidate } = event.candidate || {}
          if (!candidate) {
            return
          }
          const { sdp } = pc.localDescription || {}
          pc.close()

          const extensions = getExtensions(sdp || '')

          // const regex = /udp\s+(\d+)/
          // const match = regex.exec(candidate)
          // const udp = match ? match[1] : null

          resolve({
            webrtc: { capabilities, extensions, audio, video }
          })
        }
      }
    } catch (err) {
      resolve({ webrtc: null })
    }
  })
}

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

const getMediaConfig = (codec: any, video: any, audio: any) => ({
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

const getCapabilities = async () => {
  const decodingInfo = codecs.map((codec) => {
    const config = getMediaConfig(codec, video, audio)
    // @ts-ignore
    return navigator.mediaCapabilities
      .decodingInfo(config as any)
      .then((support) => ({
        codec,
        ...support
      }))
      .catch((error) => console.error(codec, error))
  })

  const list = await Promise.all(decodingInfo)
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

  return list
}

const getExtensions = (sdp: string) => {
  const extensions = (('' + sdp).match(/extmap:\d+ [^\n|\r]+/g) || []).map(
    (x) => x.replace(/extmap:[^\s]+ /, '')
  )
  return [...new Set(extensions)].sort()
}

export default webrtc
