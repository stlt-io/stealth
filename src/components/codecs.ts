import hash from '../utils/hash'

const videoCodecs = [
  'video/mp4; codecs="avc1.42E01E"',
  'video/mp4; codecs="avc1.4D401E"',
  'video/mp4; codecs="avc1.64001E"',
  'video/mp4; codecs="avc1.640028"',
  'video/mp4; codecs="hev1.1.6.L93.B0"',
  'video/mp4; codecs="hvc1.1.6.L93.B0"',
  'video/mp4; codecs="av01.0.05M.08"',
  'video/mp4; codecs="vp09.00.10.08"',
  'video/webm; codecs="vp8"',
  'video/webm; codecs="vp9"',
  'video/webm; codecs="av01.0.05M.08"',
  'video/ogg; codecs="theora"',
  'application/vnd.apple.mpegurl',
  'application/x-mpegURL'
]

const audioCodecs = [
  'audio/mp4; codecs="mp4a.40.2"',
  'audio/mp4; codecs="mp4a.40.5"',
  'audio/mp4; codecs="ac-3"',
  'audio/mp4; codecs="ec-3"',
  'audio/mpeg',
  'audio/mpeg; codecs="mp3"',
  'audio/ogg; codecs="vorbis"',
  'audio/ogg; codecs="opus"',
  'audio/ogg; codecs="flac"',
  'audio/webm; codecs="vorbis"',
  'audio/webm; codecs="opus"',
  'audio/flac',
  'audio/wav; codecs="1"'
]

const testCanPlay = (el: HTMLMediaElement, list: string[]) => {
  const out: Record<string, string> = {}
  for (let i = 0; i < list.length; i++) {
    const c = list[i]
    try {
      out[c] = el.canPlayType(c) || ''
    } catch {
      out[c] = ''
    }
  }
  return out
}

const testMSE = (list: string[]) => {
  const out: Record<string, boolean> = {}
  const MS: any = (window as any).MediaSource
  if (!MS || typeof MS.isTypeSupported !== 'function') return out
  for (let i = 0; i < list.length; i++) {
    const c = list[i]
    try {
      out[c] = !!MS.isTypeSupported(c)
    } catch {
      out[c] = false
    }
  }
  return out
}

const codecs = async () => {
  try {
    const video = document.createElement('video')
    const audio = document.createElement('audio')

    const videoCanPlay = testCanPlay(video, videoCodecs)
    const audioCanPlay = testCanPlay(audio, audioCodecs)
    const mse = testMSE([...videoCodecs, ...audioCodecs])

    const serialized = JSON.stringify({ videoCanPlay, audioCanPlay, mse })

    return {
      codecs: {
        video: videoCanPlay,
        audio: audioCanPlay,
        mse,
        hash: hash(serialized)
      }
    }
  } catch {
    return { codecs: null }
  }
}

export default codecs
