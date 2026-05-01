# Phase 9: Backend Testing & API Validation

**Status**: In Progress
**Priority**: High
**Timeline**: 1-2 weeks

## Objectives

✅ Complete API endpoint testing
✅ Validate database operations
✅ Performance benchmarking
✅ Security testing
✅ Error handling validation

---

## Testing Scope

### 1. Authentication Endpoints ✅
- [x] POST `/api/v1/auth/send-otp` - Send OTP
- [x] POST `/api/v1/auth/verify-otp` - Verify OTP
- [x] POST `/api/v1/auth/refresh` - Refresh token
- [x] POST `/api/v1/auth/logout` - Logout

### 2. User Endpoints
- [ ] GET `/api/v1/users/me` - Get current user
- [ ] PUT `/api/v1/users/me` - Update profile
- [ ] GET `/api/v1/users/:id` - Get user public profile
- [ ] POST `/api/v1/users/avatar` - Upload avatar
- [ ] DELETE `/api/v1/users/me` - Delete account

### 3. Listings Endpoints
- [ ] POST `/api/v1/listings` - Create listing
- [ ] GET `/api/v1/listings` - Get all listings with filters
- [ ] GET `/api/v1/listings/:id` - Get listing details
- [ ] PUT `/api/v1/listings/:id` - Update listing
- [ ] DELETE `/api/v1/listings/:id` - Delete listing
- [ ] GET `/api/v1/listings/user/me` - Get my listings
- [ ] GET `/api/v1/listings/user/:userId` - Get user's listings
- [ ] GET `/api/v1/listings/featured/top` - Get featured listings
- [ ] GET `/api/v1/listings/search` - Search listings
- [ ] POST `/api/v1/listings/:id/images` - Add image
- [ ] DELETE `/api/v1/listings/:id/images/:imageId` - Remove image
- [ ] PUT `/api/v1/listings/:id/status/:status` - Set status
- [ ] POST `/api/v1/listings/:id/promote` - Promote listing

### 4. Categories Endpoints
- [ ] GET `/api/v1/categories` - List all categories
- [ ] GET `/api/v1/categories/:id` - Get category details
- [ ] POST `/api/v1/categories` - Create category (Admin)
- [ ] PUT `/api/v1/categories/:id` - Update category (Admin)
- [ ] DELETE `/api/v1/categories/:id` - Delete category (Admin)

### 5. Favorites Endpoints
- [ ] POST `/api/v1/favorites` - Add to favorites
- [ ] DELETE `/api/v1/favorites/:listingId` - Remove from favorites
- [ ] GET `/api/v1/favorites` - Get my favorites

### 6. Chat Endpoints
- [ ] POST `/api/v1/conversations` - Start conversation
- [ ] GET `/api/v1/conversations` - Get my conversations
- [ ] GET `/api/v1/conversations/:id` - Get conversation details
- [ ] POST `/api/v1/conversations/:id/messages` - Send message
- [ ] GET `/api/v1/conversations/:id/messages` - Get messages

### 7. Notifications Endpoints
- [ ] GET `/api/v1/notifications` - Get notifications
- [ ] PUT `/api/v1/notifications/:id` - Mark as read
- [ ] DELETE `/api/v1/notifications/:id` - Delete notification
- [ ] PUT `/api/v1/notifications` - Mark all as read

### 8. Admin Endpoints
- [ ] GET `/api/v1/admin/stats` - Get platform statistics
- [ ] GET `/api/v1/admin/users` - List users (Admin)
- [ ] GET `/api/v1/admin/listings` - List listings (Admin)
- [ ] PUT `/api/v1/admin/users/:id` - Ban/unban user (Admin)
- [ ] PUT `/api/v1/admin/listings/:id` - Moderate listing (Admin)

### 9. Search Endpoints
- [ ] GET `/api/v1/search` - Search with Elasticsearch
- [ ] GET `/api/v1/search/suggestions` - Autocomplete suggestions

---

## Test Plan

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:e2e
```

### Manual Testing Checklist

#### 1. Authentication Flow
```
[ ] User sends OTP request with valid phone
  Expected: OTP code sent (check email/console)
  
[ ] User receives OTP and verifies
  Expected: JWT token returned
  
[ ] User uses token to access protected endpoints
  Expected: Request succeeds
  
[ ] User uses expired token
  Expected: 401 Unauthorized
  
[ ] User refreshes token
  Expected: New token issued
```

#### 2. Listing Creation
```
[ ] Create listing with required fields
  Expected: 201 Created, listing ID returned
  
[ ] Create listing with missing required field
  Expected: 400 Bad Request with error message
  
[ ] Create listing with invalid category
  Expected: 400 Bad Request
  
[ ] Create listing without authentication
  Expected: 401 Unauthorized
  
[ ] List shows up in GET /api/v1/listings
  Expected: Listing appears in results
```

#### 3. Listing Update
```
[ ] Update own listing
  Expected: 200 OK with updated fields
  
[ ] Update other user's listing
  Expected: 403 Forbidden
  
[ ] Update with invalid data
  Expected: 400 Bad Request
```

#### 4. Image Upload
```
[ ] Add image to listing
  Expected: Image URL returned, listing updated
  
[ ] Add multiple images
  Expected: All images stored and returned
  
[ ] Remove image
  Expected: 200 OK, image deleted from listing
  
[ ] Remove non-existent image
  Expected: 404 Not Found
```

#### 5. Search & Filters
```
[ ] Search by keyword
  Expected: Relevant listings returned
  
[ ] Filter by category
  Expected: Only category listings returned
  
[ ] Filter by price range
  Expected: Listings within range returned
  
[ ] Filter by city
  Expected: Only city listings returned
  
[ ] Combine multiple filters
  Expected: Listings matching all filters returned
```

#### 6. Favorites
```
[ ] Add to favorites
  Expected: 200 OK
  
[ ] Remove from favorites
  Expected: 200 OK
  
[ ] Get favorites list
  Expected: All favorited listings returned
  
[ ] Favorite by anonymous user
  Expected: 401 Unauthorized
```

#### 7. Error Handling
```
[ ] Request invalid endpoint
  Expected: 404 Not Found
  
[ ] Request with malformed JSON
  Expected: 400 Bad Request
  
[ ] Request with invalid query parameters
  Expected: 400 Bad Request
  
[ ] Database connection error
  Expected: 500 Internal Server Error with descriptive message
```

---

## Performance Benchmarks

Target metrics:
- Response time: < 200ms for most endpoints
- List endpoint (20 items): < 300ms
- Search: < 500ms
- Database query: < 100ms

Run: `npm run test:performance`

---

## Security Checklist

- [ ] CORS is properly configured
- [ ] SQL injection protection (TypeORM parameterized queries)
- [ ] XSS protection (Helmet headers)
- [ ] CSRF protection
- [ ] Rate limiting enabled
- [ ] Password hashing (not applicable - using OTP)
- [ ] JWT token validation
- [ ] Authorization checks on protected routes
- [ ] Input validation and sanitization
- [ ] Error messages don't leak sensitive data

---

## Known Issues & Fixes

### Issue 1: Listing search not working
**Status**: PENDING
**Fix**: Implement Elasticsearch integration

### Issue 2: Image upload endpoint missing
**Status**: PENDING
**Fix**: Add multipart upload handler

### Issue 3: Chat real-time not implemented
**Status**: PENDING
**Fix**: Implement Socket.io

---

## Deliverables

- [x] Complete endpoint documentation
- [ ] Integration test suite (50+ test cases)
- [ ] Performance test results
- [ ] Security audit report
- [ ] Bug fixes and patches
- [ ] API usage examples

---

## Next Steps

1. Run all integration tests
2. Fix failing tests
3. Add missing endpoints
4. Optimize slow queries
5. Implement security improvements
6. Create API client library
7. Document all endpoints

