import hash from './hash.js'

const webgl = async () => {
  const canvas = document.createElement('canvas')
  const width = 256
  const height = 128

  const ctx =
    canvas.getContext('webgl2') ||
    canvas.getContext('experimental-webgl2') ||
    canvas.getContext('webgl') ||
    canvas.getContext('experimental-webgl') ||
    canvas.getContext('moz-webgl')

  try {
    var f =
      'attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}'
    var g =
      'precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}'
    var h = ctx.createBuffer()

    ctx.bindBuffer(ctx.ARRAY_BUFFER, h)

    var i = new Float32Array([-0.2, -0.9, 0, 0.4, -0.26, 0, 0, 0.7321, 0])

    ctx.bufferData(ctx.ARRAY_BUFFER, i, ctx.STATIC_DRAW),
      (h.itemSize = 3),
      (h.numItems = 3)

    var j = ctx.createProgram()
    var k = ctx.createShader(ctx.VERTEX_SHADER)

    ctx.shaderSource(k, f)
    ctx.compileShader(k)

    var l = ctx.createShader(ctx.FRAGMENT_SHADER)

    ctx.shaderSource(l, g)
    ctx.compileShader(l)
    ctx.attachShader(j, k)
    ctx.attachShader(j, l)
    ctx.linkProgram(j)
    ctx.useProgram(j)

    j.vertexPosAttrib = ctx.getAttribLocation(j, 'attrVertex')
    j.offsetUniform = ctx.getUniformLocation(j, 'uniformOffset')

    ctx.enableVertexAttribArray(j.vertexPosArray)
    ctx.vertexAttribPointer(j.vertexPosAttrib, h.itemSize, ctx.FLOAT, !1, 0, 0)
    ctx.uniform2f(j.offsetUniform, 1, 1)
    ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, h.numItems)
  } catch (e) {}

  var m = ''

  var n = new Uint8Array(width * height * 4)
  ctx.readPixels(0, 0, width, height, ctx.RGBA, ctx.UNSIGNED_BYTE, n)
  m = JSON.stringify(n).replace(/,?"[0-9]+":/g, '')

  return hash(m)
}

export default webgl
