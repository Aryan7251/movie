# HubPlays — Movie Streaming Platform

A full-stack movie streaming platform with YouTube-style social interactions (Like, Comment, Share), custom video player with HTTP range-request streaming, dynamic ad management, and an admin dashboard.

## Quick Start

### Prerequisites
- **Node.js** 18+ (installed via nvm at `~/.config/nvm`)
- **MongoDB** 7.0 (installed at `~/.local/mongodb`)

### 1. Start MongoDB
```bash
~/.local/mongodb/bin/mongod --dbpath ~/.local/mongodb/data --fork --logpath ~/.local/mongodb/mongod.log --bind_ip 127.0.0.1
```

### 2. Install Dependencies
```bash
cd ~/projects/movie-streaming-app
npm run install:all
```

### 3. Configure Environment
```bash
cp .env.example backend/.env
# Edit backend/.env with your preferred settings
```

### 4. Create Admin Account
```bash
npm run setup:admin
```
Default credentials (from `.env`):
- **Username:** `admin`
- **Password:** `change-this-password`

### 5. Start All Services
```bash
npm run dev
```

This starts:
| Service | URL | Description |
|---------|-----|-------------|
| Backend API | http://localhost:5000 | Express.js REST API |
| Frontend | http://localhost:5173 | User-facing streaming app |
| Admin Dashboard | http://localhost:5174 | Content management |

---

## Architecture

```
movie-streaming-app/
├── backend/          # Express.js + MongoDB API server
│   ├── config/       # DB, ads, storage configuration
│   ├── controllers/  # Route handlers
│   ├── middleware/    # Auth, upload, validation, error handling
│   ├── models/       # Mongoose schemas (Movie, Admin, User)
│   ├── routes/       # Express route definitions
│   ├── services/     # Storage & ad service abstractions
│   ├── validation/   # Input validation
│   └── scripts/      # Admin setup script
├── frontend/         # React (Vite) user-facing app
│   └── src/
│       ├── components/  # Navbar, MovieCard, VideoPlayer, HeroSlider, etc.
│       ├── pages/       # Home, Search, MovieDetail, Watch, Legal
│       ├── hooks/       # useMovies, useAds
│       ├── context/     # AdsContext
│       └── services/    # API client
├── admin/            # React (Vite) admin dashboard
│   └── src/
│       ├── components/  # Sidebar, MovieForm, MovieTable, Toast, etc.
│       ├── pages/       # Login, Dashboard, Movies, AddMovie, EditMovie
│       ├── context/     # AuthContext, ToastContext
│       └── services/    # API client with auth interceptors
└── .env.example      # Environment template
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Backend server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/movie-streaming` |
| `JWT_SECRET` | JWT signing secret | `change-this-to-a-long-random-secret` |
| `JWT_EXPIRES_IN` | Token expiration | `7d` |
| `ADMIN_USERNAME` | Initial admin username | `admin` |
| `ADMIN_PASSWORD` | Initial admin password | `change-this-password` |
| `STORAGE_PROVIDER` | Storage backend (`local`) | `local` |
| `FRONTEND_URL` | Frontend CORS origin | `http://localhost:5173` |
| `ADMIN_URL` | Admin CORS origin | `http://localhost:5174` |
| `MAX_VIDEO_SIZE_MB` | Max video upload size | `500` |
| `MAX_POSTER_SIZE_MB` | Max poster upload size | `10` |

## Advertisement Configuration

Ad settings are in `backend/config/ads.config.js`:

```js
export const adsConfig = {
  appOpen: {
    enabled: true,          // Show app-open ad on first visit
    displayDuration: 5,     // Seconds before skip
  },
  preRoll: {
    enabled: true,          // Show pre-roll before video
    displayDuration: 5,     // Seconds before skip
  }
};
```

To disable ads: set `enabled: false` for either placement.

## API Endpoints

### Public
- `GET /api/movies` — Browse published movies (pagination, search, genre filter, sort)
- `GET /api/movies/featured` — Featured movies
- `GET /api/movies/genres` — Available genres
- `GET /api/movies/:id` — Movie detail (increments views)
- `GET /api/stream/:id` — Video streaming (HTTP range requests)
- `GET /api/ads/config` — Ad configuration

### Auth
- `POST /api/auth/setup` — One-time admin creation
- `POST /api/auth/login` — Admin login (returns JWT)
- `POST /api/auth/logout` — Clear auth session
- `GET /api/auth/me` — Current admin (protected)

### Admin (JWT required)
- `GET /api/admin/dashboard` — Stats overview
- `GET /api/admin/movies` — All movies with filters
- `POST /api/admin/movies` — Create movie (multipart upload)
- `PUT /api/admin/movies/:id` — Update movie
- `PATCH /api/admin/movies/:id/publish` — Toggle publish
- `PATCH /api/admin/movies/:id/feature` — Toggle featured
- `DELETE /api/admin/movies/:id` — Delete movie + files

## Storage

### Development (Local)
Files are stored in `backend/public/uploads/`:
- Posters: `public/uploads/posters/`
- Videos: `public/uploads/videos/`

### Production
The storage service is abstracted. To use S3/CDN:
1. Set `STORAGE_PROVIDER=s3` in `.env`
2. Add AWS credentials to `.env`
3. Implement `S3StorageService` in `backend/services/storage.service.js`

## Database Setup

### Local MongoDB
```bash
# Start
~/.local/mongodb/bin/mongod --dbpath ~/.local/mongodb/data --fork --logpath ~/.local/mongodb/mongod.log

# Stop
~/.local/mongodb/bin/mongod --shutdown --dbpath ~/.local/mongodb/data
```

### MongoDB Atlas (Production)
Set `MONGODB_URI` in `.env` to your Atlas connection string.

## Build for Production

```bash
cd frontend && npm run build
cd ../admin && npm run build
# Serve built files from backend or deploy to CDN
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `npm: command not found` | Load nvm: `export NVM_DIR="$HOME/.config/nvm" && . "$NVM_DIR/nvm.sh"` |
| MongoDB connection failed | Ensure mongod is running on port 27017 |
| CORS errors | Check `FRONTEND_URL` and `ADMIN_URL` in `.env` match your dev ports |
| Upload fails | Check file size limits and directory permissions on `public/uploads/` |
| Admin login fails | Run `npm run setup:admin` to create the admin account |
| Video won't play | Ensure the video file exists and movie is published |

## Tech Stack

- **Frontend:** React 18, Vite, React Router v6, Axios, vanilla CSS
- **Admin:** React 18, Vite, React Router v6, Axios, Lucide icons, vanilla CSS
- **Backend:** Node.js 20, Express.js, Mongoose, JWT, Multer, bcryptjs
- **Database:** MongoDB 7.0
- **Video:** HTML5 video with HTTP range request streaming
