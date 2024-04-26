import hash from './hash.js'

const canvas = () => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      ctx.beginPath()
      ctx.rect(0, 0, 16, 16)
      ctx.font = "16px 'Arial'"
      ctx.textBaseline = 'top'
      ctx.textBaseline = 'alphabetic'
      ctx.rotate(0.05)
      ctx.fillStyle = '#f60'
      ctx.fillText('😀☺♨...☑✴🅰', 50.0, 70.0)
      ctx.stroke()

      resolve(hash(canvas.toDataURL()))
    } catch (error) {
      reject(error)
    }
  })
}

export default canvas
