# 🚀 Project Setup Guide - Iraqi Marketplace Platform

**Phase 1: Backend Foundation & Authentication**

This guide walks you through setting up the entire project for **local development**. Follow each step carefully.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Backend Setup](#backend-setup)
4. [Database Setup](#database-setup)
5. [Running the Application](#running-the-application)
6. [Testing the API](#testing-the-api)
7. [Troubleshooting](#troubleshooting)
8. [Next Steps](#next-steps)

---

## Prerequisites

Before you start, you need to have the following installed on your computer:

### Software to Download

1. **Docker Desktop** (Contains Docker & Docker Compose)
   - Download: https://www.docker.com/products/docker-desktop
   - Click "Download for Windows"
   - Installation: Run the installer and follow instructions
   - After installation: Restart your computer

2. **Node.js** (JavaScript runtime)
   - Download: https://nodejs.org/
   - Choose the LTS version (e.g., 18.17.1)
   - Installation: Run the installer and follow instructions

3. **Visual Studio Code** (Code editor)
   - Download: https://code.visualstudio.com/
   - Installation: Run the installer

4. **Git** (Version control)
   - Download: https://git-scm.com/
   - Installation: Run the installer

5. **Postman or Insomnia** (API testing tool) - Optional but recommended
   - Postman: https://www.postman.com/downloads/
   - Insomnia: https://insomnia.rest/download

### Verify Installation

Open PowerShell and type:

```powershell
# Check Node.js
node --version
# Should show: v18.17.1 or higher

# Check npm (comes with Node.js)
npm --version
# Should show: 9.x.x or higher

# Check Docker
docker --version
# Should show: Docker version 24.x.x or higher

# Check Docker Compose
docker-compose --version
# Should show: Docker Compose version 2.x.x or higher

# Check Git
git --version
# Should show: git version 2.x.x or higher
```

If any command shows an error, the software isn't installed correctly. Restart your computer and try again.

---

## Initial Setup

### Step 1: Open the Project

1. Open **Visual Studio Code**
2. Click **File** → **Open Folder**
3. Navigate to `C:\marketplace-platform` and click **Select Folder**

### Step 2: Create Environment Configuration

1. In VS Code, right-click on the root folder and select **New File**
2. Name it `.env.local`
3. Copy the content from `.env.example` into `.env.local`
4. Replace `changeme` values with your configuration (for development, you can leave most as-is)

Your `.env.local` file should look like:

```env
# Application
NODE_ENV=development
APP_NAME=iraqi-marketplace
APP_PORT=3000

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=marketplace_db
DATABASE_USER=marketplace_user
DATABASE_PASSWORD=change_me_in_production
DATABASE_URL=postgresql://marketplace_user:change_me_in_production@localhost:5432/marketplace_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Elasticsearch
ELASTICSEARCH_NODE=http://localhost:9200

# SMS (Twillio) - Leave as-is for development
TWILLIO_ACCOUNT_SID=test_account_sid
TWILLIO_AUTH_TOKEN=test_auth_token
TWILLIO_PHONE_NUMBER=+1234567890
```

---

## Backend Setup

### Step 3: Install Backend Dependencies

1. Open **PowerShell** in VS Code
   - Click **Terminal** → **New Terminal**
   
2. Navigate to the backend folder:

```powershell
cd backend
```

3. Install dependencies:

```powershell
npm install
```

This will download and install all required packages. **This takes 2-5 minutes.**

Expected output:
```
added 500+ packages in 2m
```

### Step 4: Start Docker Containers

1. Go back to root folder:

```powershell
cd ..
```

2. Start all services (PostgreSQL, Redis, Elasticsearch):

```powershell
docker-compose up -d
```

**What this does:**
- Starts PostgreSQL database on port 5432
- Starts Redis cache on port 6379
- Starts Elasticsearch on port 9200
- Runs in the background (doesn't block terminal)

Expected output:
```
Creating marketplace-postgres ... done
Creating marketplace-redis ... done
Creating marketplace-elasticsearch ... done
```

### Step 5: Verify Docker Containers

Check if containers are running:

```powershell
docker-compose ps
```

You should see three containers with status `Up`:
```
NAME                     STATUS
marketplace-postgres     Up 2 minutes
marketplace-redis        Up 2 minutes
marketplace-elasticsearch Up 2 minutes
```

---

## Database Setup

### Step 6: Initialize Database

The database should already be initialized via the init.sql file. However, let's verify:

1. Connect to PostgreSQL:

```powershell
docker exec -it marketplace-postgres psql -U marketplace_user -d marketplace_db
```

2. You should see the PostgreSQL prompt:
```
marketplace_db=>
```

3. List tables to verify creation:

```sql
\dt
```

You should see tables: `users`, `categories`, `listings`, etc.

4. Exit PostgreSQL:

```
\q
```

---

## Running the Application

### Step 7: Start Backend Server

1. Open a new PowerShell terminal in VS Code
2. Navigate to backend folder:

```powershell
cd backend
```

3. Start the development server:

```powershell
npm run start:dev
```

Expected output:
```
[Nest] 12345 - 04/30/2026, 2:30:00 PM     LOG [NestFactory] Starting Nest application...
[Nest] 12345 - 04/30/2026, 2:30:01 PM     LOG [InstanceLoader] AppModule dependencies initialized
✅ Application is running on: http://localhost:3000/api/v1
📚 API Documentation: http://localhost:3000/api/docs
```

**The server is now running!** ✅

### Step 8: Access API Documentation

1. Open your browser
2. Go to: `http://localhost:3000/api/docs`
3. You should see the Swagger UI with all API endpoints

---

## Testing the API

### Step 9: Test Authentication Flow

We'll test the **OTP authentication** using Postman or Insomnia.

#### Option A: Using Postman

1. Download and open **Postman**
2. Click **+** to create a new request
3. Set method to **POST**
4. Enter URL: `http://localhost:3000/api/v1/auth/send-otp`
5. Click **Body** tab
6. Select **raw** and **JSON**
7. Paste:

```json
{
  "phoneNumber": "+964771234567"
}
```

8. Click **Send**
9. You should receive:

```json
{
  "statusCode": 201,
  "message": "Success",
  "data": {
    "message": "OTP sent to +964771234567. Valid for 10 minutes."
  },
  "timestamp": "2026-04-30T12:00:00Z"
}
```

#### Test OTP Verification

1. Check Docker logs for the OTP code (in development mode):

```powershell
docker-compose logs backend
```

Look for: `[DEV] OTP for +964771234567: 123456`

2. Create another POST request:
   - URL: `http://localhost:3000/api/v1/auth/verify-otp`
   - Body:

```json
{
  "phoneNumber": "+964771234567",
  "otp": "123456"
}
```

3. You should receive JWT tokens:

```json
{
  "statusCode": 201,
  "message": "Success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 604800,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "phoneNumber": "+964771234567",
      "firstName": "User",
      "lastName": "+964771234567",
      "city": "Baghdad",
      "profileImage": null,
      "isVerified": true,
      "rating": 0,
      "completedTransactions": 0,
      "createdAt": "2026-04-30T12:00:00Z",
      "updatedAt": "2026-04-30T12:00:00Z"
    }
  },
  "timestamp": "2026-04-30T12:00:00Z"
}
```

**Congratulations! Phase 1 is working!** ✅

---

## Troubleshooting

### Problem: Docker containers won't start

**Solution:**
```powershell
# Stop all containers
docker-compose down

# Remove volumes (WARNING: This deletes data)
docker volume prune

# Start fresh
docker-compose up -d
```

### Problem: Port 5432 already in use

**Solution:**
```powershell
# Find process using port 5432
netstat -ano | findstr :5432

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Problem: npm install fails

**Solution:**
```powershell
# Clear npm cache
npm cache clean --force

# Try install again
npm install
```

### Problem: "Cannot find module" errors

**Solution:**
```powershell
# Delete node_modules and reinstall
rm -r node_modules -Force
npm install
```

### Problem: Cannot connect to database

**Solution:**
1. Verify containers are running: `docker-compose ps`
2. Check container logs: `docker-compose logs postgres`
3. Restart database: `docker-compose restart postgres`

---

## Database Commands

```powershell
# Connect to PostgreSQL
docker exec -it marketplace-postgres psql -U marketplace_user -d marketplace_db

# View all tables
\dt

# View specific table
SELECT * FROM users;

# Exit PostgreSQL
\q

# View Redis data
docker exec -it marketplace-redis redis-cli

# View all keys
KEYS *

# Exit Redis
exit

# View Elasticsearch
curl http://localhost:9200/_search
```

---

## Useful Commands

```powershell
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f postgres

# Rebuild containers
docker-compose up -d --build

# Remove all containers and volumes
docker-compose down -v

# Backend development
cd backend
npm run start:dev

# Run backend tests
npm test

# Run linter
npm run lint

# Format code
npm run format
```

---

## What's Working (Phase 1)

✅ **Authentication via OTP SMS**
- Send OTP to phone number
- Verify OTP and get JWT tokens
- Refresh access token
- Logout user
- User registration (automatic on first OTP verification)

✅ **User Profile Management**
- Get current user profile
- Update user profile
- Get public user profile

✅ **API Documentation**
- Full Swagger UI at `/api/docs`
- All endpoints documented with examples

✅ **Database**
- PostgreSQL initialized with all tables
- Proper indexes for performance
- User table ready for data

✅ **Security**
- JWT authentication
- Password hashing
- Rate limiting on OTP requests
- CORS configured
- Helmet security headers

---

## Next Steps

**When Phase 1 is fully tested:**

1. **Phase 2: Listings System** (Weeks 4-6)
   - Create/edit/delete listings
   - Upload multiple images
   - Dynamic category fields

2. **Phase 3: Search & Elasticsearch** (Weeks 7-9)
   - Full-text search
   - Filters and sorting
   - Autocomplete

3. **Phase 4: Web Frontend** (Weeks 4-9, parallel)
   - Next.js website
   - React components
   - TailwindCSS styling

See [ARCHITECTURE.md](./ARCHITECTURE.md) for full system design.

---

## Getting Help

If you encounter issues:

1. Check the logs: `docker-compose logs -f`
2. Verify Docker is running: `docker ps`
3. Restart services: `docker-compose restart`
4. Check environment variables in `.env.local`

---

**Phase 1 Complete!** 🎉

Next: Set up Phase 2 (Listings System)
