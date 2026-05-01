# API Testing Quick Reference

## Essential Commands

### Start Backend
```bash
cd backend && npm run start:dev
```

### Run Automated Tests
```bash
cd scripts && ./test-api.sh
```

### Access API Documentation
```
http://localhost:3000/api/docs
```

### Check API Health
```bash
curl http://localhost:3000/api/v1/health
```

---

## Authentication Flow

```bash
# 1. Send OTP
curl -X POST http://localhost:3000/api/v1/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "9647735123456"}'

# Response: OTP code sent (check logs)
# Use OTP code: 000000

# 2. Verify OTP & Get Token
curl -X POST http://localhost:3000/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "9647735123456", "code": "000000"}'

# Save the accessToken for authenticated requests
export TOKEN="<accessToken_here>"

# 3. Use token in requests
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/users/me
```

---

## Common Test Endpoints

### Public (No Token Required)
```bash
# Get all listings
curl 'http://localhost:3000/api/v1/listings?page=1&pageSize=20'

# Get single listing
curl 'http://localhost:3000/api/v1/listings/{LISTING_ID}'

# Get all categories
curl 'http://localhost:3000/api/v1/categories'

# Search listings
curl 'http://localhost:3000/api/v1/listings/search?q=phone'

# Get featured listings
curl 'http://localhost:3000/api/v1/listings/featured/top?limit=12'
```

### Protected (Requires Token)
```bash
# Get current user
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/users/me

# Update user
curl -X PUT http://localhost:3000/api/v1/users/me \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"displayName": "New Name", "city": "Baghdad"}'

# Get my listings
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/listings/user/me

# Get favorites
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/favorites
```

---

## Create Listing (Complete Example)

```bash
curl -X POST http://localhost:3000/api/v1/listings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "iPhone 15 Pro Max 256GB",
    "description": "Brand new, sealed box, black color",
    "price": 1200000,
    "categoryId": "electronics",
    "city": "Baghdad",
    "condition": "new",
    "attributes": {
      "brand": "Apple",
      "storage": "256GB",
      "color": "Black"
    }
  }'
```

---

## Favorites Operations

```bash
# Add to favorites
curl -X POST http://localhost:3000/api/v1/favorites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"listingId": "{LISTING_ID}"}'

# Remove from favorites
curl -X DELETE http://localhost:3000/api/v1/favorites/{LISTING_ID} \
  -H "Authorization: Bearer $TOKEN"

# Get all favorites
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/favorites
```

---

## Search & Filter Examples

```bash
# By keyword
curl 'http://localhost:3000/api/v1/listings/search?q=iphone'

# By category
curl 'http://localhost:3000/api/v1/listings?categoryId=electronics'

# By city
curl 'http://localhost:3000/api/v1/listings?city=Baghdad'

# By price range
curl 'http://localhost:3000/api/v1/listings?minPrice=100000&maxPrice=500000'

# Combined
curl 'http://localhost:3000/api/v1/listings?search=car&categoryId=cars&minPrice=1000000&maxPrice=5000000&city=Baghdad&page=1&pageSize=20'
```

---

## Listing Status Updates

```bash
# Set listing to active
curl -X PUT http://localhost:3000/api/v1/listings/{LISTING_ID}/status/active \
  -H "Authorization: Bearer $TOKEN"

# Valid statuses: draft, active, sold, expired, suspended
```

---

## Update Listing

```bash
curl -X PUT http://localhost:3000/api/v1/listings/{LISTING_ID} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Updated Title",
    "price": 1100000,
    "description": "Updated description"
  }'
```

---

## Delete Listing

```bash
curl -X DELETE http://localhost:3000/api/v1/listings/{LISTING_ID} \
  -H "Authorization: Bearer $TOKEN"
```

---

## Expected HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | GET request succeeded |
| 201 | Created | POST request succeeded |
| 400 | Bad Request | Invalid data sent |
| 401 | Unauthorized | No/invalid token |
| 403 | Forbidden | No permission |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Backend error |

---

## Response Headers to Check

```bash
# See all response headers
curl -i http://localhost:3000/api/v1/listings

# Key headers:
# Content-Type: application/json
# X-Response-Time: <milliseconds>
# Authorization: Bearer <token>
```

---

## Troubleshooting

### 401 Unauthorized
```bash
# Check token format
echo "Token: $TOKEN"
# Should start with: eyJ...

# Re-authenticate if expired
# Get new token from /auth/verify-otp
```

### 404 Not Found
```bash
# Check endpoint spelling
# Check ID format (usually UUID)
# Try get all first to find valid ID
```

### 400 Bad Request
```bash
# Look at error message in response
# Check JSON syntax: python -m json.tool
# Check required fields
```

### Timeout
```bash
# Restart backend
cd backend && npm run start:dev

# Check database connection
# Check Redis connection
```

---

## Test Data Reference

### Test Phone
```
9647735123456
```

### Test OTP
```
000000
```

### Categories
```
- electronics
- real-estate
- furniture
- cars
- phones
- computers
```

### Cities
```
- Baghdad
- Erbil
- Basra
- Mosul
- Najaf
- Karbala
```

---

## Save Token for Reuse

```bash
# After getting token, save it
curl -X POST http://localhost:3000/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "9647735123456", "code": "000000"}' | \
  grep -o '"accessToken":"[^"]*' | \
  cut -d'"' -f4 > token.txt

# Use saved token
export TOKEN=$(cat token.txt)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/users/me
```

---

## Performance Checking

```bash
# See response time
curl -w "Response time: %{time_total}s\n" \
  http://localhost:3000/api/v1/listings

# Run multiple requests and average
for i in {1..10}; do
  curl -w "%{time_total}\n" \
    http://localhost:3000/api/v1/listings | tail -1
done
```

---

## Useful Tools

### Pretty Print JSON
```bash
curl http://localhost:3000/api/v1/listings | jq '.'
```

### Save Response to File
```bash
curl http://localhost:3000/api/v1/listings > listings.json
```

### Test with file data
```bash
curl -X POST http://localhost:3000/api/v1/listings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d @listing.json
```

---

## Quick Test Checklist

- [ ] API is running (`npm run start:dev`)
- [ ] Health check passes (`curl .../health`)
- [ ] Can authenticate (OTP flow)
- [ ] Can get listings
- [ ] Can search
- [ ] Can create listing (with auth)
- [ ] Can update own listing
- [ ] Can add to favorites
- [ ] Response times < 200ms
- [ ] Error messages are clear

---

## Documentation Links

- Full Testing Guide: `docs/API_TESTING_GUIDE.md`
- Testing Plan: `PHASE9_BACKEND_TESTING.md`
- Getting Started: `PHASE9_GETTING_STARTED.md`
- Swagger UI: `http://localhost:3000/api/docs`

