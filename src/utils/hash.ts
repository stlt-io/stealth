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

const BASE62 =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

const bytesToBase62 = (bytes: Uint8Array): string => {
  let num = 0n
  for (let i = 0; i < bytes.length; i++) {
    num = (num << 8n) | BigInt(bytes[i])
  }
  if (num === 0n) return '0'
  let out = ''
  const base = 62n
  while (num > 0n) {
    const r = Number(num % base)
    out = BASE62[r] + out
    num = num / base
  }
  return out
}

export const sha256Short = async (
  input: string,
  length = 20
): Promise<string> => {
  const buf = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest('SHA-256', buf)
  const encoded = bytesToBase62(new Uint8Array(digest))
  return encoded.slice(0, length)
}
