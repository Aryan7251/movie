import fs from 'fs';
import path from 'path';
import { storageConfig } from '../config/storage.config.js';
import { v4 as uuidv4 } from 'uuid';

class StorageService {
  constructor() {
    if (this.constructor === StorageService) {
      throw new Error("Abstract classes can't be instantiated.");
    }
  }

  async upload(file, type) {
    throw new Error("Method 'upload()' must be implemented.");
  }

  async delete(filePath) {
    throw new Error("Method 'delete()' must be implemented.");
  }

  getFilePath(url) {
    throw new Error("Method 'getFilePath()' must be implemented.");
  }

  getFileStream(filePath, range) {
    throw new Error("Method 'getFileStream()' must be implemented.");
  }
}

class LocalStorageService extends StorageService {
  constructor() {
    super();
    this.postersDir = storageConfig.local.postersDir;
    this.videosDir = storageConfig.local.videosDir;
  }

  async upload(file, type) {
    // Multer already saves it if configured, but let's assume we might need to handle it or just return the url
    const url = `/uploads/${type}s/${file.filename}`;
    return url;
  }

  async delete(filePath) {
    const fullPath = path.join(process.cwd(), 'public', filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }

  getFilePath(url) {
    return path.join(process.cwd(), 'public', url);
  }

  getFileStream(filePath, range) {
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const stat = fs.statSync(filePath);
      const fileSize = stat.size;
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, {start, end});
      return { stream: file, head: {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      }, status: 206 };
    } else {
      const stat = fs.statSync(filePath);
      const fileSize = stat.size;
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      return { stream: fs.createReadStream(filePath), head, status: 200 };
    }
  }
}

let storageService;
if (storageConfig.provider === 'local') {
  storageService = new LocalStorageService();
} else {
  // S3 or others
  storageService = new LocalStorageService();
}

export { storageService };
