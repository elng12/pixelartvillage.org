#!/usr/bin/env node
// Extract a Chrome .crx (v2/v3) by locating embedded ZIP and unpacking files (store/deflate)
// Usage: node scripts/extract-crx.js <path-to.crx> <out-dir>

import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

function findZipStart(buf) {
  // PK\x03\x04 local file header signature
  const sig = Buffer.from([0x50, 0x4b, 0x03, 0x04])
  const idx = buf.indexOf(sig)
  if (idx < 0) throw new Error('ZIP signature not found in CRX')
  return idx
}

function readUInt32LE(buf, off) { return buf.readUInt32LE(off) }
function readUInt16LE(buf, off) { return buf.readUInt16LE(off) }

function parseEOCD(zip) {
  // End of Central Directory: PK\x05\x06
  const sig = Buffer.from([0x50, 0x4b, 0x05, 0x06])
  const maxBack = Math.min(65557, zip.length)
  for (let i = zip.length - 22; i >= zip.length - maxBack; i--) {
    if (i < 0) break
    if (zip[i] === 0x50 && zip[i+1] === 0x4b && zip[i+2] === 0x05 && zip[i+3] === 0x06) {
      const count = readUInt16LE(zip, i + 10)
      const size = readUInt32LE(zip, i + 12)
      const offset = readUInt32LE(zip, i + 16)
      return { count, size, offset, pos: i }
    }
  }
  throw new Error('EOCD not found')
}

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }) }

function extract(zip, outDir) {
  const eocd = parseEOCD(zip)
  let ptr = eocd.offset
  const cdSig = 0x02014b50
  const lfSig = 0x04034b50
  for (let entry = 0; entry < eocd.count; entry++) {
    const sig = readUInt32LE(zip, ptr)
    if (sig !== cdSig) throw new Error('Central dir signature mismatch at 0x' + ptr.toString(16))
    const compMethod = readUInt16LE(zip, ptr + 10)
    const compSize = readUInt32LE(zip, ptr + 20)
    const uncompSize = readUInt32LE(zip, ptr + 24)
    const fnameLen = readUInt16LE(zip, ptr + 28)
    const extraLen = readUInt16LE(zip, ptr + 30)
    const commentLen = readUInt16LE(zip, ptr + 32)
    const localHeaderOffset = readUInt32LE(zip, ptr + 42)
    const fname = zip.slice(ptr + 46, ptr + 46 + fnameLen).toString('utf8')
    ptr += 46 + fnameLen + extraLen + commentLen

    // Read local header
    let lp = localHeaderOffset
    const lSig = readUInt32LE(zip, lp); if (lSig !== lfSig) throw new Error('Local header sig mismatch')
    const lCompMethod = readUInt16LE(zip, lp + 8)
    const lFNameLen = readUInt16LE(zip, lp + 26)
    const lExtraLen = readUInt16LE(zip, lp + 28)
    const dataStart = lp + 30 + lFNameLen + lExtraLen
    const data = zip.slice(dataStart, dataStart + compSize)

    const outPath = path.join(outDir, fname)
    if (fname.endsWith('/')) { ensureDir(outPath); continue }
    ensureDir(path.dirname(outPath))
    if (lCompMethod === 0) {
      fs.writeFileSync(outPath, data)
    } else if (lCompMethod === 8) {
      const out = zlib.inflateRawSync(data)
      if (uncompSize && out.length !== uncompSize) {
        // ignore mismatch, still write
      }
      fs.writeFileSync(outPath, out)
    } else {
      // Unsupported method
      console.warn('Skip (unsupported method=' + lCompMethod + '):', fname)
    }
  }
}

function main() {
  const crxPath = process.argv[2]
  const outDir = process.argv[3] || path.resolve(process.cwd(), 'plugins/ext-unpacked')
  if (!crxPath) { console.error('Usage: node scripts/extract-crx.js <file.crx> <out-dir>'); process.exit(2) }
  const crx = fs.readFileSync(crxPath)
  const off = findZipStart(crx)
  const zip = crx.slice(off)
  ensureDir(outDir)
  extract(zip, outDir)
  console.log('Extracted to', outDir)
}

main()

