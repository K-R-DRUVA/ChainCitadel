# Check if voter is registered
curl -X GET http://localhost:3000/api/voters/0xf39fd6e51aad88f6f4ce6ab8827279c4ffb92266/registered

# Check if voter has voted
curl -X GET http://localhost:3000/api/voters/0xf39fd6e51aad88f6f4ce6ab8827279c4ffb92266/voted

# Get voter constituency
curl -X GET http://localhost:3000/api/voters/0xf39fd6e51aad88f6f4ce6ab8827279c4ffb92266/constituency

# Mark voter as having voted
curl -X POST http://localhost:3000/api/voters/0xf39fd6e51aad88f6f4ce6ab8827279c4ffb92266/mark-voted

# Register a new voter (with different address)
curl -X POST http://localhost:3000/api/voters/register \
  -H "Content-Type: application/json" \
  -d '{
    "voterAddress": "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
    "idHash": "0xabcdef123456789...",
    "constituency": "District43"
  }'