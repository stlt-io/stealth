import hash from '../utils/hash'

const emojiSet = [
  '\u{1F600}',
  '\u{1F468}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F466}',
  '\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}',
  '\u{1F469}\u{1F3FD}\u200D\u{1F680}',
  '\u{1F9D1}\u200D\u{1F4BB}',
  '\u{1F9BE}',
  '\u{1FAE0}',
  '\u{1F979}',
  '\u{1F408}\u200D\u2B1B',
  '\u{1F441}\u200D\u{1F5E8}'
]

const emoji = async () => {
  try {
    const canvas = document.createElement('canvas')
    canvas.width = 200
    canvas.height = 40
    const ctx = canvas.getContext('2d')
    if (!ctx) return { emoji: null }

    ctx.textBaseline = 'top'
    ctx.font = '24px sans-serif'

    const widths: number[] = []
    for (let i = 0; i < emojiSet.length; i++) {
      widths.push(ctx.measureText(emojiSet[i]).width)
    }

    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#fff'
    ctx.fillText(emojiSet.join(''), 0, 0)

    const dataUrl = canvas.toDataURL()

    return {
      emoji: {
        widths,
        hash: hash(dataUrl + '|' + widths.join(','))
      }
    }
  } catch {
    return { emoji: null }
  }
}

export default emoji
