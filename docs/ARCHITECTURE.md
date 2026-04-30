# 🏗️ System Architecture - Iraqi Marketplace Platform

## Phase 1: Backend Foundation & Authentication

---

## 1. System Overview Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │  Web Browser     │  │   Mobile App     │  │   Admin Panel    │  │
│  │  (Next.js)       │  │   (Flutter)      │  │   (Next.js)      │  │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘  │
│           │                     │                      │             │
└───────────┼─────────────────────┼──────────────────────┼─────────────┘
            │                     │                      │
            └─────────────────────┴──────────────────────┘
                                  │
                    ┌─────────────▼──────────────┐
                    │   NGINX Reverse Proxy      │
                    │   (Port 80/443)            │
                    └─────────────┬──────────────┘
                                  │
            ┌─────────────────────▼──────────────────────┐
            │         API GATEWAY (NestJS)               │
            │         (Port 3000)                         │
            │  ┌────────────────────────────────────┐   │
            │  │  Global Middleware & Security      │   │
            │  │  - CORS                            │   │
            │  │  - Rate Limiting                   │   │
            │  │  - Helmet Security Headers         │   │
            │  │  - JWT Authentication              │   │
            │  └────────────────────────────────────┘   │
            └─────────────────────┬──────────────────────┘
                                  │
            ┌─────────────────────▼──────────────────────┐
            │        APPLICATION LAYER (Modules)        │
            │  ┌──────────────────────────────────────┐ │
            │  │  Users Module (Phase 1)              │ │
            │  │  ├── Auth Service                    │ │
            │  │  │   ├── OTP Generation              │ │
            │  │  │   ├── JWT Token Creation          │ │
            │  │  │   ├── User Registration           │ │
            │  │  │   └── Token Refresh               │ │
            │  │  ├── User Service                    │ │
            │  │  │   ├── Profile Management         │ │
            │  │  │   └── User Lookup                │ │
            │  │  └── Controllers                    │ │
            │  │      ├── AuthController            │ │
            │  │      └── UsersController           │ │
            │  └──────────────────────────────────────┘ │
            │                                           │
            │  Future Modules (Phases 2-8)            │
            │  ├── Listings Module                    │
            │  ├── Search Module                      │
            │  ├── Chat Module                        │
            │  ├── Notifications Module               │
            │  ├── Favorites Module                   │
            │  ├── Admin Module                       │
            │  ├── Reports Module                     │
            │  └── Payments Module                    │
            └─────────────────────┬──────────────────────┘
                                  │
            ┌─────────────────────▼──────────────────────┐
            │          DATA ACCESS LAYER                │
            │  ┌──────────────────────────────────────┐ │
            │  │  TypeORM (Database ORM)              │ │
            │  │  └── Repositories                    │ │
            │  │      ├── UserRepository              │ │
            │  │      └── (Future: ListingRepository)│ │
            │  └──────────────────────────────────────┘ │
            └─────────────────────┬──────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
        ▼                         ▼                         ▼
┌───────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│   PostgreSQL      │  │   Redis Cache        │  │  Elasticsearch       │
│   Port: 5432      │  │   Port: 6379         │  │  Port: 9200          │
│                   │  │                      │  │                      │
│ ┌───────────────┐ │  │ ┌────────────────┐  │  │ ┌────────────────┐   │
│ │ Users Table   │ │  │ │ Sessions       │  │  │ │ Listing Index  │   │
│ │ Categories    │ │  │ │ OTP Cache      │  │  │ │ Search Cache   │   │
│ │ Listings      │ │  │ │ User Cache     │  │  │ │ Autocomplete   │   │
│ │ Images        │ │  │ │ Rate Limits    │  │  │ │ Suggestions    │   │
│ │ Conversations │ │  │ │ Real-time Data │  │  │ └────────────────┘   │
│ │ Chat Messages │ │  │ └────────────────┘  │  │                      │
│ │ Favorites     │ │  │                      │  │                      │
│ └───────────────┘ │  │                      │  │                      │
└───────────────────┘  └──────────────────────┘  └──────────────────────┘
        │                         │                         │
        └─────────────────────────┼─────────────────────────┘
                                  │
        ┌─────────────────────────▼─────────────────────────┐
        │       EXTERNAL SERVICES LAYER                     │
        │  ┌──────────────────────────────────────────────┐ │
        │  │  SMS Provider (Twillio/AWS SNS)              │ │
        │  │  └── OTP Delivery                            │ │
        │  └──────────────────────────────────────────────┘ │
        │  ┌──────────────────────────────────────────────┐ │
        │  │  Firebase Cloud Messaging                    │ │
        │  │  └── Push Notifications                      │ │
        │  └──────────────────────────────────────────────┘ │
        │  ┌──────────────────────────────────────────────┐ │
        │  │  Cloudflare R2 (Object Storage)              │ │
        │  │  └── Image Storage & CDN                     │ │
        │  └──────────────────────────────────────────────┘ │
        └──────────────────────────────────────────────────┘
```

---

## 2. Request Flow Diagram

### Authentication Request Flow

```
User Mobile/Web App
        │
        │ 1. User enters phone number
        ├──────────────────────────────────────────┐
        │                                          │
        │ 2. POST /api/v1/auth/send-otp           │
        │    { "phoneNumber": "+964771234567" }   │
        │                                          │
        ▼                                          │
NGINX Reverse Proxy                               │
        │                                          │
        │ 3. Forward to API                        │
        ▼                                          │
NestJS API Gateway                                │
        │                                          │
        │ 4. CORS Check ✓                         │
        │ 5. Rate Limit Check ✓                   │
        │ 6. Helmet Security ✓                    │
        │                                          │
        ▼                                          │
Auth Service                                      │
        │                                          │
        ├─ 7. Check rate limit in Redis           │
        │   (max 3 per 5 min)                     │
        │                                          │
        ├─ 8. Generate 6-digit OTP                │
        │                                          │
        ├─ 9. Store in Redis cache                │
        │   (expires in 10 min)                   │
        │                                          │
        ├─ 10. Send SMS via Twillio               │
        │                                          │
        ▼                                          │
Response ◄─────────────────────────────────────┘
        │
        │ 11. { "message": "OTP sent..." }
        │
        ▼
User receives SMS
        │
        │ 12. User enters OTP code
        │
        ├─ POST /api/v1/auth/verify-otp
        │  { "phoneNumber": "+964771234567",
        │    "otp": "123456" }
        │
        ▼
Auth Service
        │
        ├─ 13. Get OTP from Redis
        │
        ├─ 14. Compare OTP codes
        │   (OTP in request == OTP in cache)
        │
        ├─ 15. Create/Update user in PostgreSQL
        │
        ├─ 16. Generate JWT tokens
        │   - Access Token (7 days)
        │   - Refresh Token (30 days)
        │
        ├─ 17. Save refresh token in DB
        │
        │ 18. Delete OTP from cache
        │
        ▼
Response with Tokens
        │
        │ { "accessToken": "...",
        │   "refreshToken": "...",
        │   "expiresIn": 604800,
        │   "user": {...} }
        │
        ▼
User Logged In! ✅
        │
        │ 19. Store tokens securely
        │   - AccessToken: In-memory or secure storage
        │   - RefreshToken: Secure HTTP-only cookie
        │
        ▼
Future Requests
        │
        │ GET /api/v1/auth/me
        │ Authorization: Bearer <accessToken>
        │
        ▼
API validates token
        │
        ├─ Verify signature
        ├─ Check expiration
        └─ If valid → Return user data
           If expired → Return 401 → Use refresh token
```

---

## 3. Module Architecture (Phase 1)

### Users Module Structure

```
Users Module
│
├── entities/
│   └── user.entity.ts
│       ├── id (UUID)
│       ├── phoneNumber
│       ├── firstName, lastName
│       ├── city, profileImage
│       ├── isVerified, status
│       ├── rating, completedTransactions
│       ├── otpCode, otpExpiry, otpAttempts
│       ├── refreshToken, refreshTokenExpiry
│       └── preferences (JSON)
│
├── dto/
│   └── auth.dto.ts
│       ├── SendOtpDto
│       ├── VerifyOtpDto
│       ├── RefreshTokenDto
│       ├── CreateUserDto
│       ├── UpdateUserProfileDto
│       ├── AuthResponseDto
│       └── UserResponseDto
│
├── services/
│   └── auth.service.ts
│       ├── sendOtp(phoneNumber)
│       ├── verifyOtp(phoneNumber, otp)
│       ├── refreshToken(token)
│       ├── logout(userId)
│       ├── getCurrentUser(userId)
│       ├── updateProfile(userId, data)
│       └── getPublicProfile(userId)
│
├── controllers/
│   ├── auth.controller.ts
│   │   ├── POST /auth/send-otp
│   │   ├── POST /auth/verify-otp
│   │   ├── POST /auth/refresh
│   │   ├── POST /auth/logout
│   │   ├── GET /auth/me
│   │   └── PUT /auth/me
│   │
│   └── users.controller.ts
│       └── GET /users/:id
│
└── users.module.ts
    └── Imports: TypeORM, JWT, Config
    └── Providers: AuthService, SmsService
```

---

## 4. Database Schema (Phase 1)

### Users Table

```
users
├── id (UUID, Primary Key)
├── phoneNumber (VARCHAR, UNIQUE, INDEX)
├── email (VARCHAR, UNIQUE, NULLABLE)
├── firstName (VARCHAR)
├── lastName (VARCHAR)
├── city (VARCHAR, INDEX)
├── profileImage (TEXT)
├── bio (TEXT)
├── isVerified (BOOLEAN)
├── status (VARCHAR: active/inactive/suspended/banned, INDEX)
├── rating (DECIMAL 0-5)
├── completedTransactions (INT)
├── totalReviews (INT)
├── otpCode (VARCHAR, NULLABLE)
├── otpExpiry (TIMESTAMP, NULLABLE)
├── otpAttempts (INT)
├── lastOtpSentAt (TIMESTAMP, NULLABLE)
├── refreshToken (VARCHAR, NULLABLE)
├── refreshTokenExpiry (TIMESTAMP, NULLABLE)
├── lastLoginAt (TIMESTAMP, NULLABLE)
├── deviceToken (VARCHAR, NULLABLE)
├── preferences (JSONB)
├── createdAt (TIMESTAMP, INDEX)
├── updatedAt (TIMESTAMP)
└── deletedAt (TIMESTAMP, NULLABLE)

Indexes:
├── idx_users_phone_number
├── idx_users_email
├── idx_users_created_at
└── idx_users_status
```

### Categories Table (Prepared)

```
categories
├── id (UUID, Primary Key)
├── name (VARCHAR, UNIQUE)
├── slug (VARCHAR, UNIQUE, INDEX)
├── description (TEXT)
├── icon (VARCHAR)
├── imageUrl (VARCHAR)
├── sortOrder (INT)
├── isActive (BOOLEAN, INDEX)
├── createdAt (TIMESTAMP)
└── updatedAt (TIMESTAMP)

Sample Data:
├── Cars
├── Real Estate
├── Electronics
├── Jobs
├── Furniture
└── General
```

---

## 5. Security Architecture

```
Security Layers
│
├── 1. HTTP Security
│   ├── HTTPS/TLS (in production)
│   ├── Helmet.js (headers)
│   ├── CORS (origin validation)
│   └── Compression (gzip)
│
├── 2. Request Validation
│   ├── Input sanitization
│   ├── Type validation (class-validator)
│   ├── XSS prevention
│   └── SQL injection prevention (TypeORM)
│
├── 3. Authentication
│   ├── JWT tokens (HS256)
│   ├── Refresh token rotation
│   ├── Token expiration
│   └── Secure token storage
│
├── 4. Rate Limiting
│   ├── OTP: 3 per 5 minutes
│   ├── API: 100 per 15 minutes
│   └── Stored in Redis
│
├── 5. Data Protection
│   ├── Password hashing (bcrypt)
│   ├── Database encryption (SSL)
│   ├── Sensitive data masking
│   └── Audit logging
│
└── 6. Infrastructure
    ├── Docker isolation
    ├── Environment variables
    ├── Secrets management
    └── Backup strategy
```

---

## 6. Data Flow: Authentication

```
┌──────────────────────────────────────────────────────────────────┐
│ USER ACTION: Register / Login via OTP                           │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ STEP 1: Send OTP                                                 │
│ - User enters phone number                                       │
│ - Frontend sends: POST /auth/send-otp                           │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ STEP 2: Generate OTP in Redis                                    │
│ - Generate random 6-digit code                                   │
│ - Store in Redis with 10-min expiry                             │
│ - Increment rate limit counter                                   │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ STEP 3: Send SMS via Twillio                                     │
│ - Call Twillio API                                               │
│ - SMS contains: "Your code is: 123456"                          │
│ - In dev mode: Log to console                                    │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ STEP 4: User Receives SMS                                        │
│ - Check phone for OTP                                            │
│ - Note: In dev, check Docker logs                               │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ STEP 5: Verify OTP                                               │
│ - User enters OTP code                                           │
│ - Frontend sends: POST /auth/verify-otp                         │
│ - Body: { phoneNumber, otp }                                     │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ STEP 6: Validate in Redis                                        │
│ - Get OTP from Redis cache                                       │
│ - Compare with submitted OTP                                     │
│ - If match → continue, else → error                             │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ STEP 7: Find or Create User                                      │
│ - Query PostgreSQL for user with this phone                      │
│ - If exists: Update lastLoginAt                                 │
│ - If new: Create user with default values                        │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ STEP 8: Generate JWT Tokens                                      │
│ - Access Token:                                                  │
│   - Payload: { sub: userId, phoneNumber, email }               │
│   - Expires: 7 days                                             │
│ - Refresh Token:                                                │
│   - Payload: { sub: userId, phoneNumber, email }               │
│   - Expires: 30 days                                            │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ STEP 9: Save Tokens & Cleanup                                    │
│ - Save refreshToken in PostgreSQL                                │
│ - Set refreshTokenExpiry                                         │
│ - Delete OTP from Redis                                         │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ STEP 10: Return Response to Client                               │
│ {                                                                │
│   "accessToken": "eyJ...",  (7 day expiry)                      │
│   "refreshToken": "eyJ...", (30 day expiry)                     │
│   "expiresIn": 604800,                                          │
│   "user": {                                                      │
│     "id": "550e8400...",                                         │
│     "phoneNumber": "+964771234567",                             │
│     "firstName": "User",                                         │
│     ...                                                          │
│   }                                                              │
│ }                                                                │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ STEP 11: Client Stores Tokens                                    │
│ - AccessToken: In-memory or localStorage                         │
│ - RefreshToken: Secure HTTP-only cookie                         │
│ - User logged in! ✅                                             │
└──────────────────────────────────────────────────────────────────┘
```

---

## 7. Scalability Architecture

```
Current Architecture (Phase 1 - Monolith)
│
├── Single NestJS Server
├── Single PostgreSQL Database
├── Redis Cache (single instance)
└── Elasticsearch (single instance)

Future Scalability Options (Phase 8+)
│
├── Horizontal Scaling
│   ├── Load Balancer (Nginx / HAProxy)
│   ├── Multiple API instances
│   ├── Session store in Redis Cluster
│   └── Database read replicas
│
├── Database Scaling
│   ├── Sharding by user ID
│   ├── Partitioning by date
│   ├── Connection pooling
│   └── Read replicas
│
├── Cache Scaling
│   ├── Redis Cluster
│   ├── Cache warming
│   ├── Cache invalidation strategy
│   └── Multi-region replication
│
├── Search Scaling
│   ├── Elasticsearch Cluster
│   ├── Index sharding
│   └── Dedicated search nodes
│
└── Infrastructure
    ├── CDN for static assets
    ├── Microservices (if needed)
    ├── Message queue (RabbitMQ/Kafka)
    └── Serverless functions for tasks
```

---

## 8. Deployment Architecture

### Development Environment (Current)
```
Your Computer
├── Docker Desktop
│   ├── PostgreSQL container
│   ├── Redis container
│   ├── Elasticsearch container
│   └── NestJS app (npm run start:dev)
└── VS Code terminal
```

### Production Environment (Future)
```
Hetzner/DigitalOcean VPS
├── Docker Engine
│   ├── PostgreSQL container (port 5432)
│   ├── Redis container (port 6379)
│   ├── Elasticsearch container (port 9200)
│   ├── NestJS app container (port 3000)
│   └── Next.js app container (port 3001)
│
├── Nginx
│   ├── Reverse proxy (port 80/443)
│   ├── SSL/TLS (Let's Encrypt)
│   ├── Load balancing
│   └── Static file serving
│
├── Monitoring
│   ├── Prometheus (metrics)
│   ├── Grafana (dashboards)
│   └── ELK Stack (logs)
│
├── Backups
│   ├── Daily PostgreSQL backups
│   ├── Offsite storage
│   └── Point-in-time recovery
│
└── CI/CD
    ├── GitHub Actions
    ├── Automated tests
    └── Auto-deployment on push
```

---

## 9. Technology Stack Details

### Backend
```
NestJS Framework
├── Controllers (HTTP request handling)
├── Services (business logic)
├── Modules (feature organization)
├── Guards (authentication/authorization)
├── Interceptors (request/response transformation)
├── Filters (exception handling)
├── Pipes (data validation/transformation)
└── Middleware (CORS, compression, rate limiting)
```

### Databases & Caching
```
PostgreSQL (Relational Data)
├── User accounts
├── Listings
├── Messages
├── Images metadata
└── System data

Redis (Cache & Sessions)
├── OTP temporary storage
├── Session management
├── Rate limit counters
├── Real-time data
└── Cache

Elasticsearch (Search)
├── Listing full-text search
├── Autocomplete
├── Filtering
└── Analytics
```

### Security & Performance
```
JWT (Authentication)
├── Access tokens (short-lived)
├── Refresh tokens (long-lived)
└── Stateless auth

Helmet (HTTP Security)
├── XSS protection
├── CSP headers
├── HSTS
└── Other security headers

Rate Limiting
├── Per IP
├── Per user
├── Per endpoint
└── Stored in Redis

Validation
├── Input validation (class-validator)
├── Type checking (TypeScript)
├── Sanitization
└── Error handling
```

---

## 10. Integration Points

### Current (Phase 1)
```
Backend ← → PostgreSQL Database
Backend ← → Redis Cache
Backend ← → Twillio (SMS API)
Backend ← → Logs/Monitoring
```

### Future (Phase 2+)
```
Backend ← → Elasticsearch (Search)
Backend ← → Firebase (Push Notifications)
Backend ← → Cloudflare R2 (Image Storage)
Backend ← → WebSocket (Real-time Chat)
Web Frontend ← → Backend API
Mobile App ← → Backend API
Admin Dashboard ← → Backend API
```

---

## 11. Data Consistency Strategy

```
Transaction Flow
├── User registers via OTP
│   ├── 1. Check rate limit in Redis
│   ├── 2. Generate OTP, store in Redis
│   ├── 3. Send SMS (external, may fail)
│   └── Continue even if SMS fails
│
├── User verifies OTP
│   ├── 1. Get OTP from Redis (atomic)
│   ├── 2. Compare (atomic)
│   ├── 3. Find/create user (atomic transaction)
│   ├── 4. Generate & save tokens (atomic transaction)
│   └── 5. Delete OTP (atomic)
│
└── Failure Handling
    ├── OTP timeout: Auto-cleanup after 10 min
    ├── SMS failure: Graceful degradation (dev mode)
    ├── DB failure: Rollback transaction
    └── Token issue: User can request new OTP
```

---

## 12. Performance Metrics

### Phase 1 Targets
```
Authentication Performance
├── Send OTP: < 500ms
├── Verify OTP: < 200ms
├── Get user profile: < 100ms
├── Refresh token: < 150ms
└── Login roundtrip: < 3 seconds

Database Performance
├── User lookup: < 50ms (indexed)
├── Insert user: < 100ms
└── Update profile: < 100ms

Cache Performance
├── Redis get: < 5ms
├── Redis set: < 5ms
└── Cache hit rate: > 80%

API Response
├── P95 latency: < 500ms
├── P99 latency: < 1000ms
├── Error rate: < 0.1%
└── Availability: > 99.9%
```

---

## Summary

This architecture is designed to be:

✅ **Secure**: JWT, rate limiting, input validation, encryption  
✅ **Scalable**: Indexed database, caching, asynchronous tasks  
✅ **Maintainable**: Modular structure, clear separation of concerns  
✅ **Testable**: Services, controllers, DTOs all independently testable  
✅ **Observable**: Logging, monitoring, error tracking  
✅ **Reliable**: Error handling, retries, graceful degradation  

---

**Next Phase**: Listings System (Phase 2)
