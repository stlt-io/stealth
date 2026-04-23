const table: number[] = (() => {
  const t: number[] = []
  for (let c = 0; c < 256; c++) {
    let a = c
    for (let f = 0; f < 8; f++) a = 1 & a ? 3988292384 ^ (a >>> 1) : a >>> 1
    t[c] = a
  }
  return t
})()

const hash = (r: string) => {
  let n = -1
  for (let t = 0; t < r.length; t++)
    n = (n >>> 8) ^ table[255 & (n ^ r.charCodeAt(t))]
  return (-1 ^ n) >>> 0
}

export default hash

export const sha256 = async (input: string): Promise<string> => {
  const buf = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest('SHA-256', buf)
  const bytes = new Uint8Array(digest)
  let hex = ''
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0')
  }
  return hex
}
