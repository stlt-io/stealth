import hash from '../utils/hash'

const canvas = () => {
  return new Promise((resolve) => {
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

      ctx.beginPath()
      ctx.rect(0, 0, 16, 16)
      ctx.font = "16px 'Arial'"
      ctx.textBaseline = 'top'
      ctx.textBaseline = 'alphabetic'
      ctx.rotate(0.05)
      ctx.fillStyle = '#f60'
      ctx.fillText('😀☺♨...☑✴🅰', 50.0, 70.0)
      ctx.stroke()

      resolve({ canvas: hash(canvas.toDataURL()) })
    } catch (error) {
      resolve({ canvas: null })
    }
  })
}

export default canvas
