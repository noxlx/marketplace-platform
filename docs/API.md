# 📚 API Documentation - Iraqi Marketplace Platform

## Phase 1: Authentication & User Management API

**Base URL**: `http://localhost:3000/api/v1`

**API Documentation (Interactive)**: `http://localhost:3000/api/docs`

---

## Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [User Endpoints](#user-endpoints)
3. [Response Format](#response-format)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)
6. [Security Headers](#security-headers)

---

## Authentication Endpoints

### 1. Send OTP

**Endpoint**: `POST /auth/send-otp`

**Purpose**: Send a 6-digit OTP to a user's phone number via SMS

**Request Body**:
```json
{
  "phoneNumber": "+964771234567"
}
```

**Parameters**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| phoneNumber | string | Yes | Iraqi phone number in international format (+964...) |

**Success Response (201)**:
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

**Error Responses**:

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Too many OTP requests | More than 3 requests in 5 minutes |
| 400 | Invalid phone number | Not a valid Iraqi phone number |

**Example with cURL**:
```bash
curl -X POST http://localhost:3000/api/v1/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+964771234567"
  }'
```

---

### 2. Verify OTP

**Endpoint**: `POST /auth/verify-otp`

**Purpose**: Verify OTP code and receive JWT tokens

**Request Body**:
```json
{
  "phoneNumber": "+964771234567",
  "otp": "123456"
}
```

**Parameters**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| phoneNumber | string | Yes | Iraqi phone number (must match send-otp call) |
| otp | string | Yes | 6-digit OTP code |

**Success Response (201)**:
```json
{
  "statusCode": 201,
  "message": "Success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJwaG9uZU51bWJlciI6IiswOTc3MTIzNDU2NyIsImlhdCI6MTcxNDQ3OTIwMCwiZXhwIjoxNzE1MDg0MDAwfQ.XXX",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJwaG9uZU51bWJlciI6IiswOTc3MTIzNDU2NyIsImlhdCI6MTcxNDQ3OTIwMCwiZXhwIjoxNzE3MDcxMjAwfQ.YYY",
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

**Error Responses**:

| Status | Error | Description |
|--------|-------|-------------|
| 400 | OTP expired or not found | OTP validity period expired |
| 400 | Invalid OTP code | OTP doesn't match |
| 400 | Invalid phone number | Phone number format incorrect |

**Notes**:
- `accessToken`: Use in Authorization header: `Authorization: Bearer <accessToken>`
- `refreshToken`: Store securely, use to refresh when accessToken expires
- `expiresIn`: Token expiration in seconds (7 days = 604800 seconds)

---

### 3. Refresh Token

**Endpoint**: `POST /auth/refresh`

**Purpose**: Get a new access token using refresh token

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Parameters**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| refreshToken | string | Yes | Refresh token from login response |

**Success Response (201)**:
```json
{
  "statusCode": 201,
  "message": "Success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 604800,
    "user": { ... }
  },
  "timestamp": "2026-04-30T12:00:00Z"
}
```

**Error Responses**:

| Status | Error | Description |
|--------|-------|-------------|
| 401 | Invalid refresh token | Token signature is invalid |
| 401 | Refresh token expired | Token validity period expired |

---

### 4. Logout

**Endpoint**: `POST /auth/logout`

**Purpose**: Logout user and invalidate refresh token

**Authentication**: Required (Bearer token)

**Request Header**:
```
Authorization: Bearer <accessToken>
```

**Request Body**: Empty

**Success Response (201)**:
```json
{
  "statusCode": 201,
  "message": "Success",
  "data": {
    "message": "Logged out successfully."
  },
  "timestamp": "2026-04-30T12:00:00Z"
}
```

**Error Responses**:

| Status | Error | Description |
|--------|-------|-------------|
| 401 | Unauthorized | Missing or invalid token |
| 500 | Internal Server Error | Database error |

---

## User Endpoints

### 1. Get Current User Profile

**Endpoint**: `GET /auth/me`

**Purpose**: Get authenticated user's profile

**Authentication**: Required (Bearer token)

**Request Header**:
```
Authorization: Bearer <accessToken>
```

**Success Response (200)**:
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "phoneNumber": "+964771234567",
    "firstName": "Ahmad",
    "lastName": "Al-Iraqi",
    "city": "Baghdad",
    "profileImage": "https://r2.marketplace.iq/profiles/user123.jpg",
    "isVerified": true,
    "rating": 4.8,
    "completedTransactions": 15,
    "createdAt": "2026-04-30T12:00:00Z",
    "updatedAt": "2026-04-30T12:00:00Z"
  },
  "timestamp": "2026-04-30T12:00:00Z"
}
```

**Error Responses**:

| Status | Error | Description |
|--------|-------|-------------|
| 401 | Unauthorized | Missing or invalid token |
| 404 | User not found | User doesn't exist |

---

### 2. Update User Profile

**Endpoint**: `PUT /auth/me`

**Purpose**: Update current user's profile

**Authentication**: Required (Bearer token)

**Request Header**:
```
Authorization: Bearer <accessToken>
```

**Request Body** (all fields optional):
```json
{
  "firstName": "Ahmad",
  "lastName": "Al-Iraqi",
  "city": "Baghdad",
  "profileImage": "https://r2.marketplace.iq/profiles/user123.jpg"
}
```

**Parameters**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| firstName | string | No | First name (min 2 characters) |
| lastName | string | No | Last name (min 2 characters) |
| city | string | No | City name |
| profileImage | string | No | Profile image URL from Cloudflare R2 |

**Success Response (200)**:
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "phoneNumber": "+964771234567",
    "firstName": "Ahmad",
    "lastName": "Al-Iraqi",
    "city": "Baghdad",
    "profileImage": "https://r2.marketplace.iq/profiles/user123.jpg",
    "isVerified": true,
    "rating": 0,
    "completedTransactions": 0,
    "createdAt": "2026-04-30T12:00:00Z",
    "updatedAt": "2026-04-30T12:00:01Z"
  },
  "timestamp": "2026-04-30T12:00:01Z"
}
```

**Error Responses**:

| Status | Error | Description |
|--------|-------|-------------|
| 401 | Unauthorized | Missing or invalid token |
| 400 | Validation error | Invalid input format |

---

### 3. Get User Public Profile

**Endpoint**: `GET /users/:id`

**Purpose**: Get public profile of any user

**Authentication**: Not required

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | User ID (UUID) |

**Success Response (200)**:
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "phoneNumber": "+964771234567",
    "firstName": "Ahmad",
    "lastName": "Al-Iraqi",
    "city": "Baghdad",
    "profileImage": "https://r2.marketplace.iq/profiles/user123.jpg",
    "isVerified": true,
    "rating": 4.8,
    "completedTransactions": 15,
    "createdAt": "2026-04-30T12:00:00Z",
    "updatedAt": "2026-04-30T12:00:00Z"
  },
  "timestamp": "2026-04-30T12:00:00Z"
}
```

**Error Responses**:

| Status | Error | Description |
|--------|-------|-------------|
| 404 | User not found | User doesn't exist |

---

## Response Format

### Success Response Structure

All successful responses follow this format:

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": { ... },
  "timestamp": "2026-04-30T12:00:00Z"
}
```

**Fields**:
- `statusCode`: HTTP status code
- `message`: Response message
- `data`: Actual response data
- `timestamp`: ISO 8601 timestamp

### Error Response Structure

All error responses follow this format:

```json
{
  "statusCode": 400,
  "message": "Invalid phone number or rate limit exceeded",
  "path": "/api/v1/auth/send-otp",
  "method": "POST",
  "error": "Bad Request",
  "timestamp": "2026-04-30T12:00:00Z"
}
```

**Fields**:
- `statusCode`: HTTP status code
- `message`: Error description
- `path`: Request path
- `method`: HTTP method
- `error`: Error type
- `timestamp`: ISO 8601 timestamp

---

## Error Handling

### Common HTTP Status Codes

| Code | Name | Meaning |
|------|------|---------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input or request |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Error Examples

**Invalid Phone Number**:
```json
{
  "statusCode": 400,
  "message": "Must be a valid Iraqi phone number",
  "error": "Bad Request"
}
```

**Rate Limit Exceeded**:
```json
{
  "statusCode": 400,
  "message": "Too many OTP requests. Please try again in 5 minutes.",
  "error": "Bad Request"
}
```

**Unauthorized**:
```json
{
  "statusCode": 401,
  "message": "Invalid or expired token",
  "error": "Unauthorized"
}
```

---

## Rate Limiting

### OTP Sending
- **Limit**: 3 OTP requests per 5 minutes per phone number
- **Error**: 400 Bad Request when exceeded

### General API
- **Limit**: 100 requests per 15 minutes per IP
- **Error**: 429 Too Many Requests when exceeded

---

## Security Headers

All responses include security headers:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
```

---

## Authentication

### JWT Token Structure

JWT tokens are divided into 3 parts: `header.payload.signature`

**Header**:
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload** (Access Token):
```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "phoneNumber": "+964771234567",
  "email": "user@example.com",
  "iat": 1714479200,
  "exp": 1715084000
}
```

### Using Access Token

Include in request header:

```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:3000/api/v1/auth/me
```

### Token Expiration

- **Access Token**: 7 days
- **Refresh Token**: 30 days

When access token expires, use refresh token to get new one.

---

## Testing with Postman

### 1. Create Collection

1. Open Postman
2. Click **New** → **Collection**
3. Name: `Iraqi Marketplace API`

### 2. Add Variables

1. Click the collection
2. Click **Variables** tab
3. Add:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| baseUrl | http://localhost:3000/api/v1 | http://localhost:3000/api/v1 |
| accessToken | | (auto-filled after login) |
| refreshToken | | (auto-filled after login) |

### 3. Create Requests

**Send OTP**:
```
POST {{baseUrl}}/auth/send-otp
Body (raw JSON):
{
  "phoneNumber": "+964771234567"
}
```

**Verify OTP**:
```
POST {{baseUrl}}/auth/verify-otp
Body (raw JSON):
{
  "phoneNumber": "+964771234567",
  "otp": "123456"
}
```

Save `accessToken` to Postman variable from response.

**Get Current User**:
```
GET {{baseUrl}}/auth/me
Headers:
  Authorization: Bearer {{accessToken}}
```

---

## Webhook Format (Future)

Future endpoints will support webhooks:

```json
{
  "event": "listing.created",
  "timestamp": "2026-04-30T12:00:00Z",
  "data": { ... }
}
```

---

## Changelog

### Version 1.0.0 (Current)
- ✅ Authentication with OTP
- ✅ JWT token management
- ✅ User profile management
- ✅ Public user profiles

### Upcoming (Phase 2-8)
- 🔜 Listings CRUD
- 🔜 Search & Elasticsearch
- 🔜 Chat system
- 🔜 Notifications
- 🔜 Admin dashboard
- 🔜 Payment integration

---

## Support

- 📚 Full API docs: `http://localhost:3000/api/docs`
- 📖 Setup guide: See [SETUP.md](../SETUP.md)
- 🏗️ Architecture: See [ARCHITECTURE.md](./ARCHITECTURE.md)

---

**Last Updated**: April 30, 2026  
**API Version**: 1.0.0
