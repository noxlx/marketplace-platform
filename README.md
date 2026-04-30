# 🏪 Iraqi Classified Marketplace Platform

A modern, production-ready classified marketplace platform similar to Sahibinden, Dubizzle, and OLX - built for Iraq.

**Status**: 🚀 Phase 1 - Backend Authentication Foundation

## Features

### MVP Features (Phase 1-3)
- ✅ User authentication via OTP SMS
- ✅ JWT-based secure authentication
- ✅ User profiles with image upload
- ✅ Create/edit/delete listings
- ✅ Dynamic category-specific fields
- ✅ Lightning-fast search with Elasticsearch
- ✅ Real-time chat between buyers and sellers
- ✅ Push notifications
- ✅ Professional admin dashboard
- ✅ Favorites/Save listings system

### Future Features
- 🔜 Advanced payment integration
- 🔜 AI fraud detection
- 🔜 Recommendation engine
- 🔜 Premium subscriptions
- 🔜 Business accounts
- 🔜 Map-based search

## Tech Stack

| Component | Technology |
|-----------|-----------|
| **Backend** | NestJS + TypeScript |
| **Web Frontend** | Next.js + React + TailwindCSS |
| **Mobile** | Flutter |
| **Database** | PostgreSQL |
| **Cache** | Redis |
| **Search** | Elasticsearch |
| **Real-time** | Socket.io |
| **Notifications** | Firebase Cloud Messaging |
| **Storage** | Cloudflare R2 |
| **Deployment** | Docker + Docker Compose |

## Project Structure

```
marketplace-platform/
├── backend/                 # NestJS API
├── frontend-web/            # Next.js website
├── frontend-mobile/         # Flutter mobile app
├── docs/                    # Documentation
├── docker-compose.yml       # Full stack setup
└── README.md               # This file
```

## Quick Start

### Prerequisites
- Docker Desktop
- Node.js 18+ (for local development)
- Git

### 1️⃣ Development Setup

```bash
# Clone repository
git clone https://github.com/yourusername/marketplace-platform.git
cd marketplace-platform

# Start all services with Docker
docker-compose up -d

# Backend runs at: http://localhost:3000
# Frontend runs at: http://localhost:3001
# API Docs at: http://localhost:3000/api
```

### 2️⃣ Backend Development

```bash
cd backend

# Install dependencies
npm install

# Run database migrations
npm run migration:run

# Start development server
npm run start:dev
```

### 3️⃣ Frontend Development

```bash
cd frontend-web

# Install dependencies
npm install

# Start development server
npm run dev
```

## Documentation

- 📖 [Setup Guide](docs/SETUP.md) - Detailed setup instructions
- 🏗️ [Architecture](docs/ARCHITECTURE.md) - System architecture
- 📚 [API Documentation](docs/API.md) - Complete API reference
- 🗄️ [Database Schema](docs/DATABASE.md) - Database design
- 🚀 [Deployment Guide](docs/DEPLOYMENT.md) - How to deploy to production

## Phase Timeline

- **Phase 1** (Weeks 1-3): Backend Auth & User Management ✓ IN PROGRESS
- **Phase 2** (Weeks 4-6): Listings System & Image Upload
- **Phase 3** (Weeks 7-9): Search & Elasticsearch
- **Phase 4** (Weeks 4-9): Web Frontend (Parallel)
- **Phase 5** (Weeks 10-11): Chat & Notifications
- **Phase 6** (Weeks 11-12): Admin Dashboard
- **Phase 7** (Weeks 10-14): Mobile App (Parallel)
- **Phase 8** (Weeks 13-14): Deployment & DevOps

## API Endpoints Overview

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP and get JWT
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update profile
- `GET /api/users/:id` - Get public profile

### Listings
- `GET /api/listings` - List all
- `GET /api/listings/:id` - Get details
- `POST /api/listings` - Create
- `PUT /api/listings/:id` - Update
- `DELETE /api/listings/:id` - Delete

### Search
- `GET /api/search` - Search with filters
- `GET /api/search/suggestions` - Autocomplete

See [API Documentation](docs/API.md) for complete list.

## Development Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "feat: description"`
3. Push and create PR: `git push origin feature/your-feature`
4. CI/CD runs tests automatically
5. After review, merge to main

## Environment Variables

See [.env.example](.env.example) for all configuration options.

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/marketplace

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# Redis
REDIS_URL=redis://localhost:6379

# Elasticsearch
ELASTICSEARCH_NODE=http://localhost:9200

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-key

# Cloudflare R2
R2_ACCESS_KEY_ID=your-key
R2_SECRET_ACCESS_KEY=your-secret

# SMS Provider (Twillio)
TWILLIO_ACCOUNT_SID=your-sid
TWILLIO_AUTH_TOKEN=your-token
```

## Contributing

Contributions welcome! Please:

1. Follow the code style (ESLint + Prettier)
2. Write tests for new features
3. Update documentation
4. Keep commits atomic and well-described

## Support

- 📧 Email: support@marketplace.iq
- 💬 Discord: [Join our community](#)
- 📱 WhatsApp: +964 123 456 7890

## License

MIT License - See [LICENSE](LICENSE) file

## Roadmap

- ✅ Phase 1: Authentication
- 🔄 Phase 2: Listings (in progress)
- ⬜ Phase 3: Search
- ⬜ Phase 4: Web Frontend
- ⬜ Phase 5: Chat & Notifications
- ⬜ Phase 6: Admin Dashboard
- ⬜ Phase 7: Mobile App
- ⬜ Phase 8: Deployment

---

**Built with ❤️ for Iraq** | Production-ready marketplace platform
