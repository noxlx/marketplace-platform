#!/bin/bash

##############################################################################
# Marketplace Platform - API Testing Script
# Usage: ./test-api.sh
# 
# This script performs comprehensive API tests and generates a report
##############################################################################

# Configuration
API_URL="http://localhost:3000/api/v1"
TEST_PHONE="9647735$(shuf -i 10000-99999 -n 1)"
REPORT_FILE="api-test-report-$(date +%Y%m%d-%H%M%S).log"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TIME=0

# Utility functions
log() {
  echo -e "${BLUE}[INFO]${NC} $1" | tee -a $REPORT_FILE
}

log_pass() {
  echo -e "${GREEN}[PASS]${NC} $1" | tee -a $REPORT_FILE
  ((TESTS_PASSED++))
}

log_fail() {
  echo -e "${RED}[FAIL]${NC} $1" | tee -a $REPORT_FILE
  ((TESTS_FAILED++))
}

log_warn() {
  echo -e "${YELLOW}[WARN]${NC} $1" | tee -a $REPORT_FILE
}

test_endpoint() {
  local test_name=$1
  local method=$2
  local endpoint=$3
  local data=$4
  local expected_status=$5
  local token=$6

  ((TESTS_RUN++))
  
  local start_time=$(date +%s%N)
  
  local headers='-H "Content-Type: application/json"'
  if [ ! -z "$token" ]; then
    headers="$headers -H 'Authorization: Bearer $token'"
  fi

  local response=$(eval "curl -s -w '\n%{http_code}' -X $method $API_URL$endpoint $headers ${data:+-d '$data'}")
  
  local end_time=$(date +%s%N)
  local duration=$(( (end_time - start_time) / 1000000 ))
  ((TOTAL_TIME += duration))
  
  local status_code=$(echo "$response" | tail -n1)
  local body=$(echo "$response" | head -n-1)

  if [[ $status_code == $expected_status ]]; then
    log_pass "$test_name (${status_code}) - ${duration}ms"
    echo "$body" >> $REPORT_FILE
  else
    log_fail "$test_name (expected: $expected_status, got: $status_code) - ${duration}ms"
    echo "$body" >> $REPORT_FILE
  fi
}

##############################################################################
# Start Testing
##############################################################################

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Marketplace Platform - API Testing Suite            ║${NC}"
echo -e "${BLUE}║  Report: $REPORT_FILE          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Initialize report
echo "Marketplace Platform - API Testing Report" > $REPORT_FILE
echo "Started: $(date)" >> $REPORT_FILE
echo "API URL: $API_URL" >> $REPORT_FILE
echo "" >> $REPORT_FILE

# Health check
log "Checking API health..."
HEALTH=$(curl -s $API_URL/../health)
if [[ $HEALTH == *"ok"* ]]; then
  log_pass "API is healthy"
else
  log_fail "API health check failed"
  log_warn "Aborting tests"
  exit 1
fi

echo ""
log "Starting API tests with phone: $TEST_PHONE"
echo ""

##############################################################################
# 1. Authentication Tests
##############################################################################

echo -e "${YELLOW}━━━ 1. AUTHENTICATION TESTS ━━━${NC}" | tee -a $REPORT_FILE

log "Sending OTP to $TEST_PHONE..."
OTP_RESPONSE=$(curl -s -X POST $API_URL/auth/send-otp \
  -H "Content-Type: application/json" \
  -d "{\"phone\": \"$TEST_PHONE\"}")
echo "$OTP_RESPONSE" >> $REPORT_FILE

test_endpoint "Send OTP" "POST" "/auth/send-otp" \
  "{\"phone\": \"$TEST_PHONE\"}" "200"

log "Verifying OTP (using default test OTP: 000000)..."
OTP_TOKEN=$(curl -s -X POST $API_URL/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d "{\"phone\": \"$TEST_PHONE\", \"code\": \"000000\"}" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$OTP_TOKEN" ]; then
  log_pass "Got auth token"
  echo "Token: $OTP_TOKEN" >> $REPORT_FILE
else
  log_warn "Could not get auth token (OTP verification may have failed)"
fi

echo ""

##############################################################################
# 2. User Tests
##############################################################################

echo -e "${YELLOW}━━━ 2. USER TESTS ━━━${NC}" | tee -a $REPORT_FILE

if [ ! -z "$OTP_TOKEN" ]; then
  test_endpoint "Get Current User" "GET" "/users/me" "" "200" "$OTP_TOKEN"
  
  test_endpoint "Update User Profile" "PUT" "/users/me" \
    "{\"displayName\": \"Test User\", \"city\": \"Baghdad\"}" "200" "$OTP_TOKEN"
fi

echo ""

##############################################################################
# 3. Category Tests
##############################################################################

echo -e "${YELLOW}━━━ 3. CATEGORY TESTS ━━━${NC}" | tee -a $REPORT_FILE

test_endpoint "Get All Categories" "GET" "/categories" "" "200"

echo ""

##############################################################################
# 4. Listing Tests
##############################################################################

echo -e "${YELLOW}━━━ 4. LISTING TESTS ━━━${NC}" | tee -a $REPORT_FILE

test_endpoint "Get All Listings" "GET" "/listings" "" "200"

test_endpoint "Get Featured Listings" "GET" "/listings/featured/top?limit=12" "" "200"

test_endpoint "Search Listings" "GET" "/listings/search?q=car" "" "200"

if [ ! -z "$OTP_TOKEN" ]; then
  test_endpoint "Get My Listings" "GET" "/listings/user/me" "" "200" "$OTP_TOKEN"
fi

echo ""

##############################################################################
# 5. Favorite Tests
##############################################################################

echo -e "${YELLOW}━━━ 5. FAVORITE TESTS ━━━${NC}" | tee -a $REPORT_FILE

if [ ! -z "$OTP_TOKEN" ]; then
  test_endpoint "Get Favorites" "GET" "/favorites" "" "200" "$OTP_TOKEN"
fi

echo ""

##############################################################################
# Results Summary
##############################################################################

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}" | tee -a $REPORT_FILE
echo -e "${BLUE}║  TEST RESULTS                                        ║${NC}" | tee -a $REPORT_FILE
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}" | tee -a $REPORT_FILE

SUCCESS_RATE=$((TESTS_PASSED * 100 / TESTS_RUN))

echo "" | tee -a $REPORT_FILE
echo "Total Tests Run: $TESTS_RUN" | tee -a $REPORT_FILE
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}" | tee -a $REPORT_FILE
echo -e "${RED}Failed: $TESTS_FAILED${NC}" | tee -a $REPORT_FILE
echo "Success Rate: ${SUCCESS_RATE}%" | tee -a $REPORT_FILE
echo "Total Time: ${TOTAL_TIME}ms" | tee -a $REPORT_FILE
echo "" | tee -a $REPORT_FILE

# Performance recommendation
AVG_TIME=$((TOTAL_TIME / TESTS_RUN))
echo "Average Response Time: ${AVG_TIME}ms" | tee -a $REPORT_FILE

if [ $AVG_TIME -lt 200 ]; then
  echo -e "${GREEN}Performance: EXCELLENT${NC}" | tee -a $REPORT_FILE
elif [ $AVG_TIME -lt 500 ]; then
  echo -e "${YELLOW}Performance: GOOD${NC}" | tee -a $REPORT_FILE
else
  echo -e "${RED}Performance: NEEDS OPTIMIZATION${NC}" | tee -a $REPORT_FILE
fi

echo ""
echo "Report saved to: $REPORT_FILE" | tee -a $REPORT_FILE
echo "Completed: $(date)" >> $REPORT_FILE

# Final status
echo ""
if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}❌ Some tests failed. See report for details.${NC}"
  exit 1
fi
