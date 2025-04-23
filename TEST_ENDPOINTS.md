# API Test Commands for Election Backend

This document provides curl commands to test the election backend API endpoints for both voter and candidate registration.

## Environment Setup

Before running these commands, set these variables in your terminal to simplify the curl commands:

```bash
# Set your server base URL
BASE_URL="http://localhost:3000"

# Example addresses (replace with actual addresses)
VOTER_ADDRESS="0x1234567890123456789012345678901234567890"
CANDIDATE_ADDRESS="0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f"
NEW="0x90F79bf6EB2c4f870365E785982E1f101E93b906"




## Voter Registration API Tests

### 1. Register a new voter

```bash
curl -X POST "${BASE_URL}/api/voters/register" \
  -H "Content-Type: application/json" \
  -d '{
    "voterAddress": "'"${VOTER_ADDRESS}"'",
    "idHash": "0x123abc456def789",
    "constituency": "District 1"
  }'
```

### 2. Check if voter has voted

```bash
curl -X GET "${BASE_URL}/api/voters/${VOTER_ADDRESS}/voted"
```

### 3. Mark voter as having voted

```bash
curl -X POST "${BASE_URL}/api/voters/${VOTER_ADDRESS}/mark-voted"
```

### 4. Check if voter is registered

```bash
curl -X GET "${BASE_URL}/api/voters/${VOTER_ADDRESS}/registered"
```
VOTER_ADDRESS="0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc"
### 5. Get voter constituency

```bash
curl -X GET "${BASE_URL}/api/voters/${VOTER_ADDRESS}/constituency"
```


### 1. Register a new candidate

```bash
curl -X POST "${BASE_URL}/api/candidates/register" \
  -H "Content-Type: application/json" \
  -d '{
    "candidateAddress": "'"${NEW}"'",
    "idHash": "0xabc123def456ghi",
    "name": "John Doe",
    "constituency": "District 1"
  }'
```

### 2. Update candidate status -------------------------------

```bash
curl -X POST "${BASE_URL}/api/candidates/${NEW}/status" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Approved"
  }'
```

### 3. Get candidate status

```bash
curl -X GET "${BASE_URL}/api/candidates/${CANDIDATE_ADDRESS}/status"
```

### 4. Get all candidates

```bash
curl -X GET "${BASE_URL}/api/candidates"
```

### 5. Get candidates by constituency

```bash
curl -X GET "${BASE_URL}/api/candidates/constituency/District%201"
```

### 6. Get candidate details

```bash
CANDIDATE_ADDRESS="0x976EA74026E726554dB657fA54763abd0C3a0aa9"
curl -X GET "${BASE_URL}/api/candidates/${CANDIDATE_ADDRESS}/details"
```

## Testing Workflow Example

Here's a typical workflow to test the entire system:

1. Register a new voter
2. Check if the voter is registered (should return `true`)
3. Register a new candidate
4. Check candidate status (should return `"Pending"`)
5. Update candidate status to `"Approved"`
6. Get candidate details to confirm update
7. Get all candidates from the specific constituency
8. Check if voter has voted (should return `false`)
9. Mark voter as having voted 
10. Check if voter has voted again (should return `true`)

## Error Handling Tests

### Test with invalid Ethereum address

```bash
curl -X GET "${BASE_URL}/api/voters/invalidaddress/registered"
```

### Test with missing fields

```bash
curl -X POST "${BASE_URL}/api/candidates/register" \
  -H "Content-Type: application/json" \
  -d '{
    "candidateAddress": "'"${CANDIDATE_ADDRESS}"'",
    "idHash": "0xabc123def456ghi"
  }'
```




































<!-- ---------------------------------------------------------------------------------------------------------------------------------------------- -->

## Voting API Tests

### 1. Cast a vote

```bash
curl -X POST "${BASE_URL}/api/voting/cast" \
  -H "Content-Type: application/json" \
  -d '{
    "voterAddress": "'"${VOTER_ADDRESS}"'",
    "candidateAddress": "'"${CANDIDATE_ADDRESS}"'"
  }'
```
