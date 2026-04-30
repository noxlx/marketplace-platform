# ⚡ Quick Start Guide - 5 Minutes to Running

**Phase 1 Backend Authentication - Iraqi Marketplace Platform**

## Prerequisites Installed?

✅ Docker Desktop  
✅ Node.js 18+  
✅ Visual Studio Code  
✅ Git  

If not, see [SETUP.md](./SETUP.md) Full Setup section.

---

## 🚀 Start in 5 Steps

### 1. Create `.env.local` File

In the root folder, create a file called `.env.local` and copy this:

```env
NODE_ENV=development
APP_PORT=3000
DATABASE_URL=postgresql://marketplace_user:change_me_in_production@localhost:5432/marketplace_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
REDIS_HOST=localhost
ELASTICSEARCH_NODE=http://localhost:9200
TWILLIO_ACCOUNT_SID=test_sid
TWILLIO_AUTH_TOKEN=test_token
TWILLIO_PHONE_NUMBER=+1234567890
```

**Note**: For development, default values work fine. Change passwords in production!

### 2. Start Docker Services

```powershell
# In PowerShell, in the marketplace-platform folder
docker-compose up -d
```

Wait 30 seconds for all services to start.

### 3. Install Dependencies

```powershell
cd backend
npm install
```

Takes 2-5 minutes.

### 4. Start Backend Server

```powershell
npm run start:dev
```

You should see:
```
✅ Application is running on: http://localhost:3000/api/v1
📚 API Documentation: http://localhost:3000/api/docs
```

### 5. Test the API

Open your browser:

```
http://localhost:3000/api/docs
```

Click on `POST /auth/send-otp` and test with:

```json
{
  "phoneNumber": "+964771234567"
}
```

**Done!** ✅

---

## 🧪 Test Authentication

### Send OTP

Using Postman or cURL:

```bash
curl -X POST http://localhost:3000/api/v1/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+964771234567"}'
```

### Verify OTP

Get OTP from Docker logs:

```powershell
docker-compose logs backend | grep "DEV"
```

Look for: `[DEV] OTP for +964771234567: 123456`

Then verify:

```bash
curl -X POST http://localhost:3000/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+964771234567",
    "otp": "123456"
  }'
```

You'll get back JWT tokens! 🎉

---

## 📚 Useful Commands

```powershell
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f backend

# Stop everything
docker-compose down

# Restart services
docker-compose restart

# See running containers
docker-compose ps

# View database
docker exec -it marketplace-postgres psql -U marketplace_user -d marketplace_db
# Then: \dt (to see tables)
# Then: \q (to exit)

# Backend commands
cd backend
npm run start:dev          # Start development
npm run lint              # Check code style
npm run format            # Fix code style
npm test                  # Run tests
```

---

## 📂 Project Structure

```
marketplace-platform/
├── backend/              ← Your API server (NestJS)
├── frontend-web/         ← Next.js website (coming soon)
├── frontend-mobile/      ← Flutter app (coming soon)
├── docs/                 ← Documentation
│   ├── SETUP.md         ← Full setup guide
│   ├── API.md           ← API documentation
│   └── ARCHITECTURE.md  ← System design
├── docker-compose.yml   ← Docker setup
├── .env.example         ← Configuration template
└── README.md            ← Project overview
```

---

## ✅ What's Done (Phase 1)

- ✅ NestJS backend with modular structure
- ✅ Authentication via OTP SMS
- ✅ JWT token management (access + refresh)
- ✅ User profile management
- ✅ PostgreSQL database with proper schema
- ✅ Redis caching
- ✅ Swagger API documentation
- ✅ Docker setup (PostgreSQL, Redis, Elasticsearch)
- ✅ Security: Rate limiting, CORS, Helmet

---

## 🔍 API Endpoints (Phase 1)

**Authentication**:
- `POST /auth/send-otp` - Send OTP to phone
- `POST /auth/verify-otp` - Verify OTP, get JWT
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user

**Users**:
- `GET /auth/me` - Get current user profile
- `PUT /auth/me` - Update profile
- `GET /users/:id` - Get public user profile

**System**:
- `GET /health` - Health check
- `GET /api/info` - API information

See [API.md](./API.md) for full documentation.

---

## 🐛 Troubleshooting

**Docker won't start?**
```powershell
docker-compose down
docker volume prune
docker-compose up -d
```

**Port already in use?**
```powershell
netstat -ano | findstr :5432
# Replace PID with the number shown
taskkill /PID <PID> /F
```

**npm install fails?**
```powershell
npm cache clean --force
npm install
```

**Can't connect to database?**
```powershell
docker-compose logs postgres
docker-compose restart postgres
```

---

## 📖 Documentation

- **Full Setup**: [SETUP.md](./SETUP.md)
- **API Docs**: [API.md](./API.md)  
- **Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Database Schema**: [DATABASE.md](./DATABASE.md)

---

## 🎯 Next Steps

When Phase 1 is tested and working:

1. **Phase 2**: Listings System (create, edit, delete, images)
2. **Phase 3**: Search with Elasticsearch
3. **Phase 4**: Web Frontend (Next.js)
4. **Phase 5**: Real-time Chat
5. **Phase 6**: Admin Dashboard
6. **Phase 7**: Mobile App (Flutter)
7. **Phase 8**: Production Deployment

---

## 💬 Questions?

1. Check [SETUP.md](./SETUP.md) - Complete setup guide
2. Check [API.md](./API.md) - API reference
3. Look at [API Docs](http://localhost:3000/api/docs) - Interactive Swagger UI

---

**Happy Coding!** 🚀

Got stuck? Start over with Step 1, check logs with `docker-compose logs -f`

---

## System Status

After running these commands, you should have:

```
✅ Database: PostgreSQL on port 5432
✅ Cache: Redis on port 6379
✅ Search: Elasticsearch on port 9200
✅ API: Running on port 3000
✅ Docs: Available at localhost:3000/api/docs
```

**If any status is missing, check logs**:
```powershell
docker-compose logs -f
```

---

**Phase 1 Complete!** Ready for Phase 2 development.
