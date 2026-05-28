// Generates minimal PNG icons for PWA
import { writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = resolve(__dirname, '../public')

function createPNG(width, height, r, g, b, radius) {
  // Minimal PNG generator — creates a rounded-rect icon
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  // IHDR
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8  // bit depth
  ihdr[9] = 6  // color type: RGBA
  ihdr[10] = 0 // compression
  ihdr[11] = 0 // filter
  ihdr[12] = 0 // interlace

  const ihdrChunk = createChunk('IHDR', ihdr)

  // Image data (raw BGRA rows with filter byte)
  const rawData = Buffer.alloc(height * (1 + width * 4))
  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + width * 4)
    rawData[rowOffset] = 0 // filter: none
    for (let x = 0; x < width; x++) {
      const px = rowOffset + 1 + x * 4
      // Rounded rectangle check
      const cx = width / 2
      const cy = height / 2
      const rx = width / 2 - 2
      const ry = height / 2 - 2
      const nx = (x - cx) / rx
      const ny = (y - cy) / ry
      const inside = (nx * nx + ny * ny) <= 1
      const rr = radius / Math.min(width, height)
      const corner = (nx * nx + ny * ny) <= (rr * rr * 2)
      const isInside = (x >= radius && x < width - radius) || (y >= radius && y < height - radius) || corner
        ? true
        : (x < radius && y < radius && (x - radius) * (x - radius) + (y - radius) * (y - radius) <= radius * radius)
        || (x >= width - radius && y < radius && (x - (width - radius)) * (x - (width - radius)) + (y - radius) * (y - radius) <= radius * radius)
        || (x < radius && y >= height - radius && (x - radius) * (x - radius) + (y - (height - radius)) * (y - (height - radius)) <= radius * radius)
        || (x >= width - radius && y >= height - radius && (x - (width - radius)) * (x - (width - radius)) + (y - (height - radius)) * (y - (height - radius)) <= radius * radius)

      if (isInside) {
        rawData[px] = b     // B
        rawData[px + 1] = g // G
        rawData[px + 2] = r // R
        rawData[px + 3] = 255 // A
      } else {
        rawData[px] = 0
        rawData[px + 1] = 0
        rawData[px + 2] = 0
        rawData[px + 3] = 0
      }
    }
  }

  // Compress with zlib
  const zlib = await import('zlib')
  const compressed = zlib.deflateSync(rawData)
  const idatChunk = createChunk('IDAT', compressed)

  // IEND
  const iendChunk = createChunk('IEND', Buffer.alloc(0))

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk])
}

function createChunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const typeBuffer = Buffer.from(type, 'ascii')
  const crcData = Buffer.concat([typeBuffer, data])
  const crc = crc32(crcData)
  const crcBuffer = Buffer.alloc(4)
  crcBuffer.writeUInt32BE(crc, 0)
  return Buffer.concat([len, typeBuffer, data, crcBuffer])
}

function crc32(buf) {
  let crc = 0xFFFFFFFF
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i]
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0)
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0
}

async function main() {
  mkdirSync(outDir, { recursive: true })

  const sizes = [
    { size: 192, radius: 32 },
    { size: 512, radius: 80 },
  ]

  // Purple gradient-ish (#8B5CF6 → #EC4899)
  for (const { size, radius } of sizes) {
    const png = createPNG(size, size, 0x8B, 0x5C, 0xF6, radius)
    writeFileSync(resolve(outDir, `pwa-${size}.png`), png)
    console.log(`Generated pwa-${size}.png`)
  }
}

main().catch(console.error)
