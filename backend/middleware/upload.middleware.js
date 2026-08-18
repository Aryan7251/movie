import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'poster') {
      cb(null, 'public/uploads/posters/');
    } else if (file.fieldname === 'video') {
      cb(null, 'public/uploads/videos/');
    }
  },
  filename: function (req, file, cb) {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'poster') {
    if (file.mimetype.match(/^image\/(jpeg|jpg|png|webp|gif)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  } else if (file.fieldname === 'video') {
    if (file.mimetype.match(/^video\/(mp4|webm|mkv|avi)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'), false);
    }
  }
};

const limits = {
  fileSize: 500 * 1024 * 1024 // default 500MB
};

const upload = multer({
  storage,
  fileFilter,
  limits
});

export const uploadFiles = upload.fields([
  { name: 'poster', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]);
