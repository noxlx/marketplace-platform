# API Testing Guide - Complete Walkthrough

This guide helps you manually test all API endpoints using curl or Postman.

## Setup

### Option 1: Using Postman
1. Open Postman
2. Import the API collection from `docs/postman-collection.json`
3. Set environment variables:
   - `BASE_URL` = `http://localhost:3000/api/v1`
   - `TOKEN` = (will be set after auth)

### Option 2: Using curl
Save this as `test-api.sh` and run with `bash test-api.sh`

---

## 1. Authentication Tests

### Test 1.1: Send OTP
```bash
curl -X POST http://localhost:3000/api/v1/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "9647735123456"}'
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "OTP sent to phone",
  "expiresIn": 600
}
```

**Checklist:**
- [ ] Status 200 returned
- [ ] Message indicates OTP was sent
- [ ] Phone number is valid format
- [ ] Expires in 10 minutes (600 seconds)

---

### Test 1.2: Verify OTP
```bash
curl -X POST http://localhost:3000/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "9647735123456", "code": "000000"}'
```

**Expected Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "user-uuid",
    "phone": "9647735123456",
    "displayName": "User Name"
  }
}
```

**Checklist:**
- [ ] Status 200 returned
- [ ] Access token is JWT format
- [ ] Refresh token is JWT format
- [ ] User object includes phone and ID
- [ ] Invalid OTP returns 400

---

### Test 1.3: Verify Invalid OTP
```bash
curl -X POST http://localhost:3000/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "9647735123456", "code": "999999"}'
```

**Expected Response:**
```json
{
  "status": "error",
  "message": "Invalid or expired OTP"
}
```

**Checklist:**
- [ ] Status 400 returned
- [ ] Error message is clear
- [ ] No token is issued

---

### Test 1.4: Refresh Token
```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_REFRESH_TOKEN" \
  -d '{}'
```

**Expected Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**Checklist:**
- [ ] Status 200 returned
- [ ] New access token provided
- [ ] Invalid token returns 401

---

## 2. User Endpoints Tests

### Test 2.1: Get Current User
```bash
curl -X GET http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "id": "user-uuid",
  "phone": "9647735123456",
  "displayName": "User Name",
  "city": "Baghdad",
  "avatar": "https://...",
  "createdAt": "2026-04-30T12:00:00Z",
  "updatedAt": "2026-04-30T12:00:00Z"
}
```

**Checklist:**
- [ ] Status 200 returned
- [ ] User object has all required fields
- [ ] No token returns 401
- [ ] Invalid token returns 401

---

### Test 2.2: Update User Profile
```bash
curl -X PUT http://localhost:3000/api/v1/users/me \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "displayName": "New Name",
    "city": "Erbil",
    "bio": "I am a seller"
  }'
```

**Expected Response:**
```json
{
  "id": "user-uuid",
  "displayName": "New Name",
  "city": "Erbil",
  "bio": "I am a seller",
  "updatedAt": "2026-04-30T12:00:00Z"
}
```

**Checklist:**
- [ ] Status 200 returned
- [ ] Fields are updated correctly
- [ ] Timestamp is updated
- [ ] Invalid data returns 400

---

## 3. Listing Endpoints Tests

### Test 3.1: Create Listing
```bash
curl -X POST http://localhost:3000/api/v1/listings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "iPhone 15 Pro Max",
    "description": "Brand new, 256GB, Black",
    "price": 1200,
    "categoryId": "electronics",
    "city": "Baghdad",
    "condition": "new",
    "attributes": {
      "brand": "Apple",
      "color": "Black",
      "storage": "256GB"
    }
  }'
```

**Expected Response:**
```json
{
  "id": "listing-uuid",
  "title": "iPhone 15 Pro Max",
  "description": "Brand new, 256GB, Black",
  "price": 1200,
  "categoryId": "electronics",
  "city": "Baghdad",
  "userId": "user-uuid",
  "status": "draft",
  "views": 0,
  "favoritesCount": 0,
  "createdAt": "2026-04-30T12:00:00Z"
}
```

**Checklist:**
- [ ] Status 201 returned
- [ ] Listing ID is UUID format
- [ ] Status is "draft" by default
- [ ] Missing required field returns 400
- [ ] No token returns 401

---

### Test 3.2: Get All Listings
```bash
curl -X GET 'http://localhost:3000/api/v1/listings?page=1&pageSize=20'
```

**Expected Response:**
```json
{
  "data": [
    {
      "id": "listing-uuid",
      "title": "iPhone 15 Pro Max",
      "price": 1200,
      "city": "Baghdad",
      "categoryId": "electronics",
      "views": 5,
      "favoritesCount": 2,
      "primaryImage": "https://...",
      "userName": "Seller Name",
      "userRating": 4.8
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

**Checklist:**
- [ ] Status 200 returned
- [ ] Returns array of listings
- [ ] Pagination info included
- [ ] Each listing has required fields
- [ ] Invalid page returns error

---

### Test 3.3: Get Listing by ID
```bash
curl -X GET 'http://localhost:3000/api/v1/listings/listing-uuid'
```

**Expected Response:**
```json
{
  "id": "listing-uuid",
  "title": "iPhone 15 Pro Max",
  "description": "Brand new, 256GB, Black",
  "price": 1200,
  "categoryId": "electronics",
  "city": "Baghdad",
  "condition": "new",
  "status": "active",
  "views": 10,
  "favoritesCount": 3,
  "isFeatured": false,
  "images": [
    { "id": "img-1", "url": "https://...", "isPrimary": true }
  ],
  "userId": "user-uuid",
  "userName": "Seller Name",
  "userRating": 4.8,
  "userPhone": "9647735123456",
  "attributes": {
    "brand": "Apple",
    "color": "Black"
  },
  "createdAt": "2026-04-30T12:00:00Z"
}
```

**Checklist:**
- [ ] Status 200 returned
- [ ] All listing details returned
- [ ] Seller info included
- [ ] Images array included
- [ ] Nonexistent ID returns 404

---

### Test 3.4: Update Listing
```bash
curl -X PUT http://localhost:3000/api/v1/listings/listing-uuid \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "iPhone 15 Pro Max - Price Reduced",
    "price": 1100,
    "description": "Mint condition, comes with box"
  }'
```

**Expected Response:**
```json
{
  "id": "listing-uuid",
  "title": "iPhone 15 Pro Max - Price Reduced",
  "price": 1100,
  "description": "Mint condition, comes with box",
  "updatedAt": "2026-04-30T12:00:00Z"
}
```

**Checklist:**
- [ ] Status 200 returned
- [ ] Only owner can update (403 if not owner)
- [ ] No token returns 401
- [ ] Nonexistent listing returns 404

---

### Test 3.5: Set Listing Status
```bash
curl -X PUT http://localhost:3000/api/v1/listings/listing-uuid/status/active \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "id": "listing-uuid",
  "status": "active",
  "updatedAt": "2026-04-30T12:00:00Z"
}
```

**Checklist:**
- [ ] Valid statuses: draft, active, sold, expired, suspended
- [ ] Status 200 returned
- [ ] Invalid status returns 400
- [ ] Only owner can set status

---

### Test 3.6: Delete Listing
```bash
curl -X DELETE http://localhost:3000/api/v1/listings/listing-uuid \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "message": "Listing deleted successfully"
}
```

**Checklist:**
- [ ] Status 200 returned
- [ ] Only owner can delete (403 if not owner)
- [ ] Listing disappears from GET request
- [ ] Nonexistent listing returns 404

---

## 4. Search Tests

### Test 4.1: Search Listings
```bash
curl -X GET 'http://localhost:3000/api/v1/listings/search?q=iphone&page=1&pageSize=20'
```

**Expected Response:**
```json
{
  "data": [
    {
      "id": "listing-uuid",
      "title": "iPhone 15 Pro Max",
      "price": 1200,
      "relevance": 0.95
    }
  ],
  "pagination": {
    "page": 1,
    "totalResults": 45,
    "totalPages": 3
  }
}
```

**Checklist:**
- [ ] Status 200 returned
- [ ] Returns relevant results
- [ ] Sorted by relevance
- [ ] Handles empty search gracefully

---

### Test 4.2: Filter Listings by Category
```bash
curl -X GET 'http://localhost:3000/api/v1/listings?categoryId=electronics&page=1&pageSize=20'
```

**Checklist:**
- [ ] Only electronics returned
- [ ] Other categories excluded
- [ ] Invalid category returns 400

---

### Test 4.3: Filter Listings by Price Range
```bash
curl -X GET 'http://localhost:3000/api/v1/listings?minPrice=1000&maxPrice=2000&page=1'
```

**Checklist:**
- [ ] Only listings in range returned
- [ ] minPrice inclusive
- [ ] maxPrice inclusive
- [ ] Invalid range returns 400

---

### Test 4.4: Filter Listings by City
```bash
curl -X GET 'http://localhost:3000/api/v1/listings?city=Baghdad&page=1'
```

**Checklist:**
- [ ] Only Baghdad listings returned
- [ ] Case-insensitive search works
- [ ] Multiple filters can be combined

---

## 5. Favorites Tests

### Test 5.1: Add to Favorites
```bash
curl -X POST http://localhost:3000/api/v1/favorites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"listingId": "listing-uuid"}'
```

**Expected Response:**
```json
{
  "message": "Added to favorites",
  "listing": { "id": "listing-uuid" }
}
```

**Checklist:**
- [ ] Status 200 returned
- [ ] No token returns 401
- [ ] Nonexistent listing returns 404
- [ ] Adding twice is idempotent

---

### Test 5.2: Get Favorites
```bash
curl -X GET http://localhost:3000/api/v1/favorites \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "data": [
    {
      "id": "listing-uuid",
      "title": "iPhone 15 Pro Max",
      "price": 1200,
      "favoritedAt": "2026-04-30T12:00:00Z"
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1
  }
}
```

**Checklist:**
- [ ] Status 200 returned
- [ ] Returns only current user's favorites
- [ ] Correct pagination
- [ ] No token returns 401

---

### Test 5.3: Remove from Favorites
```bash
curl -X DELETE http://localhost:3000/api/v1/favorites/listing-uuid \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "message": "Removed from favorites"
}
```

**Checklist:**
- [ ] Status 200 returned
- [ ] Listing no longer in favorites
- [ ] Removing twice returns 404
- [ ] No token returns 401

---

## 6. Categories Tests

### Test 6.1: Get All Categories
```bash
curl -X GET http://localhost:3000/api/v1/categories
```

**Expected Response:**
```json
{
  "data": [
    {
      "id": "electronics",
      "name": "Electronics",
      "slug": "electronics",
      "icon": "📱",
      "sortOrder": 1,
      "isActive": true,
      "fieldDefinitions": [
        { "name": "brand", "type": "string", "required": true },
        { "name": "color", "type": "string", "required": false }
      ]
    }
  ]
}
```

**Checklist:**
- [ ] Status 200 returned
- [ ] All active categories returned
- [ ] Field definitions included
- [ ] Sorted by sortOrder

---

### Test 6.2: Get Category Details
```bash
curl -X GET http://localhost:3000/api/v1/categories/electronics
```

**Checklist:**
- [ ] Status 200 returned
- [ ] Complete category details
- [ ] Field definitions included

---

## Testing Checklist Summary

### Before Running Tests
- [ ] Backend is running (`npm run start:dev`)
- [ ] Database is populated
- [ ] Redis is running
- [ ] API docs available at `/api/docs`

### After Tests
- [ ] All authentication tests pass
- [ ] All CRUD operations work
- [ ] Error handling is consistent
- [ ] Response times are acceptable
- [ ] No SQL injection vulnerabilities
- [ ] Rate limiting works

### Performance Targets
- [ ] Most endpoints: < 200ms
- [ ] List endpoints: < 300ms
- [ ] Search: < 500ms
- [ ] Database queries: < 100ms

---

## Troubleshooting

### 401 Unauthorized
- Check token is valid: `echo $TOKEN`
- Token might be expired - refresh it
- Check Authorization header format: `Bearer TOKEN`

### 404 Not Found
- Check URL spelling
- Verify endpoint path
- Check ID exists in database

### 400 Bad Request
- Check JSON syntax
- Verify required fields
- Check field types match schema
- Look at error message for hints

### 500 Server Error
- Check backend logs
- Verify database connection
- Check Redis connection
- Restart backend if needed

