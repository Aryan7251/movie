export const storageConfig = {
  provider: process.env.STORAGE_PROVIDER || 'local',
  local: {
    postersDir: 'public/uploads/posters',
    videosDir: 'public/uploads/videos'
  }
};
