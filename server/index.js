/* eslint-env node */
import express from 'express'
import multer from 'multer'
import sharp from 'sharp'

const app = express()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only images allowed'))
    cb(null, true)
  },
})

app.get('/', (req, res) => res.type('text/plain').send('Pixel Art Image Service'))

// contain: 保持比例完整显示（不放大）
app.post('/api/resize/contain', upload.single('file'), async (req, res) => {
  try {
    const maxW = Number(req.query.maxW ?? 1600)
    const maxH = Number(req.query.maxH ?? 1200)
    const format = String(req.query.format ?? 'webp')
    const quality = Number(req.query.quality ?? 80)

    const out = await sharp(req.file.buffer)
      .rotate()
      .resize({ width: maxW, height: maxH, fit: 'inside', withoutEnlargement: true })[format]({ quality })
      .toBuffer()

    res.set('Content-Type', `image/${format}`).send(out)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

// cover: 保持比例填充（可能裁剪）
app.post('/api/resize/cover', upload.single('file'), async (req, res) => {
  try {
    const w = Number(req.query.w ?? 1200)
    const h = Number(req.query.h ?? 800)
    const format = String(req.query.format ?? 'webp')
    const quality = Number(req.query.quality ?? 80)
    const position = String(req.query.position ?? 'attention')

    const out = await sharp(req.file.buffer)
      .rotate()
      .resize({ width: w, height: h, fit: 'cover', position })[format]({ quality })
      .toBuffer()

    res.set('Content-Type', `image/${format}`).send(out)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`image service on :${PORT}`)
})
