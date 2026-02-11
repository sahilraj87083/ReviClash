import multer from "multer";
import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
    const uniqueName =
      crypto.randomBytes(16).toString('hex') +
      path.extname(file.originalname)

    cb(null, uniqueName)
  }
})

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]

  if (!allowedMimeTypes.includes(file.mimetype)) {
    cb(new Error('Unsupported file type'), false)
  } else {
    cb(null, true)
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB max
  }
})
