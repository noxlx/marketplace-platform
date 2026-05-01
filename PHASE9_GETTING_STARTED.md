# Phase 9: Getting Started - Backend Testing

## What We've Created

✅ **PHASE9_BACKEND_TESTING.md** - Complete testing plan with scope and checklist
✅ **API_TESTING_GUIDE.md** - Comprehensive manual testing guide with curl examples
✅ **api.test.ts** - Automated TypeScript test suite
✅ **test-api.sh** - Bash script for automated testing

---

## Quick Start (5 minutes)

### Step 1: Ensure Backend is Running
```bash
cd backend
npm run start:dev
```

You should see:
```
✅ Application is running on: http://localhost:3000/api/v1
📚 API Documentation: http://localhost:3000/api/docs
```

### Step 2: Access API Documentation
Open in browser:
```
http://localhost:3000/api/docs
```

This shows all available endpoints with try-it-out functionality.

### Step 3: Run Automated Tests

#### Option A: Using Bash Script
```bash
cd scripts
chmod +x test-api.sh
./test-api.sh
```

This will:
- Check API health
- Test authentication endpoints
- Test all CRUD operations
- Generate a report: `api-test-report-YYYYMMDD-HHMMSS.log`

#### Option B: Using TypeScript Tests
```bash
cd backend
npm install axios  # if not already installed
npm run test:api
```

#### Option C: Manual Testing with curl
```bash
# Test health
curl http://localhost:3000/api/v1/health

# Get all listings
curl http://localhost:3000/api/v1/listings

# Get categories
curl http://localhost:3000/api/v1/categories
```

---

## Testing Workflow

### Phase 9a: Authentication (1 day)
- [ ] Test OTP sending
- [ ] Test OTP verification
- [ ] Test token refresh
- [ ] Test token expiration
- [ ] Test invalid credentials

**Run Test**: Navigate to `/api/docs` → `Auth` section → Try endpoints

---

### Phase 9b: User Operations (1 day)
- [ ] Get current user profile
- [ ] Update user profile
- [ ] Get public user profile
- [ ] Test permission checks (can't edit other users)

**Run Test**:
```bash
# Use token from auth test
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/v1/users/me
```

---

### Phase 9c: Listing CRUD (2 days)
- [ ] Create listing
- [ ] Get all listings
- [ ] Get listing by ID
- [ ] Update listing
- [ ] Delete listing
- [ ] Set listing status
- [ ] Get user's listings

**Run Test**:
```bash
# Create a test listing
curl -X POST http://localhost:3000/api/v1/listings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "title": "Test Item",
    "description": "A test listing",
    "price": 100,
    "categoryId": "electronics",
    "city": "Baghdad"
  }'
```

---

### Phase 9d: Search & Filtering (1 day)
- [ ] Search by keyword
- [ ] Filter by category
- [ ] Filter by price range
- [ ] Filter by city
- [ ] Combined filters
- [ ] Pagination

**Run Test**:
```bash
# Search with multiple filters
curl 'http://localhost:3000/api/v1/listings?search=car&categoryId=cars&minPrice=1000&maxPrice=5000&page=1'
```

---

### Phase 9e: Favorites (1 day)
- [ ] Add to favorites
- [ ] Remove from favorites
- [ ] Get favorites list
- [ ] Check favorite count on listings

**Run Test**:
```bash
# Add to favorites (need listing ID)
curl -X POST http://localhost:3000/api/v1/favorites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"listingId": "LISTING_ID"}'
```

---

### Phase 9f: Error Handling (1 day)
- [ ] Test 400 Bad Request (invalid data)
- [ ] Test 401 Unauthorized (no token)
- [ ] Test 403 Forbidden (permission denied)
- [ ] Test 404 Not Found (item doesn't exist)
- [ ] Test 500 Server Error handling

---

### Phase 9g: Performance (1 day)
- [ ] Measure response times
- [ ] Identify slow endpoints
- [ ] Test with large datasets
- [ ] Database query optimization
- [ ] Caching validation

---

## Key Testing Points

### Authentication
```bash
# Valid phone number (Iraqi format)
9647735123456

# OTP code for testing
000000  # Usually in logs or sent to console

# Expected JWT token format
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Common Issues & Solutions

**Issue 1: 401 Unauthorized**
- [ ] Check token is included in header
- [ ] Format: `Authorization: Bearer TOKEN`
- [ ] Token might be expired
- [ ] Try refreshing token

**Issue 2: 404 Not Found**
- [ ] Verify endpoint spelling
- [ ] Check item ID exists
- [ ] Try different endpoint

**Issue 3: 400 Bad Request**
- [ ] Check JSON syntax
- [ ] Verify required fields
- [ ] Check data types match schema
- [ ] See error message in response

**Issue 4: Timeout/Slow Response**
- [ ] Check database connection
- [ ] Check Redis connection
- [ ] Look for slow queries in logs
- [ ] Restart backend if needed

---

## Test Data

### Test Users
```
Phone: 9647735123456
OTP: 000000
```

### Test Categories (Pre-loaded)
- electronics
- real-estate
- furniture
- cars
- phones
- computers

### Test Cities (Common)
- Baghdad
- Erbil
- Basra
- Mosul
- Najaf
- Karbala

---

## Success Criteria

✅ **Phase 9 is complete when:**

1. All endpoints respond correctly
2. Authentication flow works end-to-end
3. CRUD operations work for listings
4. Search and filtering work correctly
5. Error messages are clear
6. Response times are < 200ms average
7. No SQL injection vulnerabilities
8. Rate limiting works
9. All test scripts pass
10. Documentation is complete

---

## Next Commands to Run

```bash
# 1. Start backend (if not already running)
cd backend
npm run start:dev

# 2. In another terminal, run tests
cd scripts
chmod +x test-api.sh
./test-api.sh

# 3. Check the report
cat api-test-report-*.log

# 4. Browse API docs
# Open: http://localhost:3000/api/docs
```

---

## Files to Review

📄 **PHASE9_BACKEND_TESTING.md** - Full testing plan
📄 **API_TESTING_GUIDE.md** - Detailed curl examples
📄 **backend/src/tests/api.test.ts** - TypeScript test suite
📄 **scripts/test-api.sh** - Bash test script

---

## Deliverables Checklist

- [x] Testing plan created
- [x] Test guide written
- [x] Automated test script created
- [x] TypeScript test suite created
- [ ] Run all tests and fix failures
- [ ] Document all findings
- [ ] Create bug report for failures
- [ ] Performance optimization complete

---

## Estimated Timeline

| Phase | Days | Status |
|-------|------|--------|
| 9a - Authentication | 1 | Not Started |
| 9b - User Operations | 1 | Not Started |
| 9c - Listing CRUD | 2 | Not Started |
| 9d - Search & Filtering | 1 | Not Started |
| 9e - Favorites | 1 | Not Started |
| 9f - Error Handling | 1 | Not Started |
| 9g - Performance | 1 | Not Started |
| **Total** | **8 days** | **Not Started** |

---

**Ready to start testing? Run:**
```bash
./scripts/test-api.sh
```

