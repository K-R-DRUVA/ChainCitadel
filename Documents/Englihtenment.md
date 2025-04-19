# Blockchain Voting System: Data Flow & Operations Breakdown

This document outlines the specific data flow, parameters, and operations happening at each part of the system.

## 1. System Components & Data Flow

```
┌────────────────────┐      ┌────────────────────┐      ┌────────────────────┐
│      Frontend      │ ───► │      Backend       │ ───► │    Blockchain      │
│  (User Interface)  │ ◄─── │   (API Server)     │ ◄─── │  (Smart Contracts) │
└────────────────────┘      └────────────────────┘      └────────────────────┘
```

## 2. Smart Contract Data Parameters

### AdminControl.sol
- **Key Functions**:
  - `changeAdmin(address newAdmin)` - Changes the admin address
  - `addValidator(address val)` - Adds a validator
  - `requestPause(string const)` - Requests pause of voting in a constituency
  - `approvePause(uint256 reqId)` - Approves pause request with validator consensus

### VoterRegistration.sol
- **Key Functions**:
  - `registerVoter(address voter, string idHash, string const)` - Registers a voter
  - `markVoted(address voter)` - Marks a voter as having voted
  - `isRegistered(address voter)` - Checks if voter is registered
  - `getConstituency(address voter)` - Gets voter's constituency

### CandidateRegistration.sol
- **Key Functions**:
  - `registerCandidate(address cand, string idHash, string name, string const)` - Registers a candidate
  - `updateStatus(address cand, string status)` - Updates candidate status
  - `getCandDetails(address cand)` - Gets candidate details (name, constituency, status)

### Voting.sol
- **Key Functions**:
  - `castVote(address cand)` - Casts a vote for a candidate
  - `getVotesByConst(string const)` - Gets votes by constituency
  - `getTotalVotes(string const)` - Gets total votes in a constituency

### ResultCompilation.sol
- **Key Functions**:
  - `tallyVotes(string const)` - Tallies votes for a constituency
  - `getLiveResults(string const)` - Gets live results
  - `getLeader(string const)` - Gets current leader

## 3. Backend API Endpoints & Parameters

### Voter Registration API
```
POST /api/voters/register
Request: {
  "walletAddress": "0x...",  // Voter's blockchain address
  "idHash": "0x...",         // Hashed ID number
  "constituency": "District1" // Electoral constituency
}
Response: {
  "success": true,
  "transactionHash": "0x...", // Blockchain transaction hash
  "message": "Voter registered successfully"
}
```

**What happens**: 
1. Backend validates the request data
2. Calls `VoterRegistration.registerVoter()` with parameters
3. Returns transaction hash to frontend

### Candidate Registration API
```
POST /api/candidates/register
Request: {
  "walletAddress": "0x...",  // Candidate's blockchain address
  "idHash": "0x...",         // Hashed ID number
  "name": "John Doe",        // Candidate name
  "constituency": "District1" // Electoral constituency
}
Response: {
  "success": true,
  "transactionHash": "0x...", // Blockchain transaction hash
  "message": "Candidate registration submitted for verification"
}
```

**What happens**:
1. Backend validates the request data
2. Calls `CandidateRegistration.registerCandidate()` with parameters
3. Triggers criminal check verification process via `CrimCheck.verifyCriminalRecord()`
4. Returns transaction hash to frontend

### Voting API
```
POST /api/voting/cast
Request: {
  "voterWalletAddress": "0x...", // Voter's blockchain address
  "candidateAddress": "0x..."    // Selected candidate's address
}
Response: {
  "success": true,
  "transactionHash": "0x...",
  "message": "Vote cast successfully"
}
```

**What happens**:
1. Backend verifies voter is registered via `VoterRegistration.isRegistered()`
2. Verifies voter hasn't voted via `VoterRegistration.hasVoted()`
3. Calls `Voting.castVote()` with candidate address
4. Returns transaction hash to frontend

### Results API
```
GET /api/results/live/:constituency
Response: {
  "candidates": [
    {
      "address": "0x...",
      "name": "John Doe",
      "votes": 120
    },
    {
      "address": "0x...",
      "name": "Jane Smith",
      "votes": 85
    }
  ],
  "totalVotes": 205,
  "turnout": "67.5%"
}
```

**What happens**:
1. Backend calls `ResultCompilation.getLiveResults()` with constituency
2. Formats the data and calculates additional metrics
3. Returns formatted results to frontend

### Admin Control API
```
POST /api/admin/pause-voting
Request: {
  "adminAddress": "0x...",  // Admin's blockchain address
  "constituency": "District1" // Constituency to pause
}
Response: {
  "success": true,
  "requestId": 5,           // Pause request ID
  "message": "Pause request created, awaiting validator approval"
}
```

**What happens**:
1. Backend verifies sender is admin via `AdminControl.getAdmin()`
2. Calls `AdminControl.requestPause()` with constituency
3. Returns request ID to frontend for tracking

## 4. Frontend Component Data Flow

### User Registration Flow
```
[WalletConnect Component] → [Registration Form] → [API Call] → [Blockchain Transaction]
  ↓ Provides                 ↓ Captures           ↓ Sends      ↓ Creates
wallet address               user data            parameters   on-chain record
```

**Data parameters**:
- Wallet address (from wallet connection)
- ID hash (hashed on client side)
- Constituency (selected by user)
- Transaction hash (returned after registration)

### Voting Flow
```
[Constituency Selector] → [Candidate List] → [Vote Button] → [Transaction Confirmation]
  ↓ Fetches               ↓ Loads           ↓ Sends        ↓ Shows
constituency data         candidate data    vote request   transaction status
```

**Data parameters**:
- Wallet address (from connected wallet)
- Constituency (from voter's registration)
- Candidate address (selected by user)
- Transaction hash (returned after voting)

### Results Viewing Flow
```
[Constituency Selector] → [Results API Call] → [Results Display Component]
  ↓ Determines            ↓ Fetches           ↓ Shows
which area to view        voting data         visualized results
```

**Data parameters**:
- Constituency (selected by user)
- Candidate data (names, addresses)
- Vote counts
- Turnout percentage

### Admin Dashboard Flow
```
[Admin Authentication] → [Admin Action Selection] → [Action Execution]
  ↓ Verifies              ↓ Determines              ↓ Performs
admin privileges          operation to perform      admin operation
```

**Data parameters for adding validator**:
- Admin wallet address
- Validator address to add
- Transaction hash (returned after operation)

**Data parameters for pausing voting**:
- Admin wallet address
- Constituency to pause
- Request ID (returned after creating request)

## 5. Detailed Operation Flow Diagrams

### Voter Registration Process
```
┌─────────────┐     ┌─────────────┐     ┌──────────────────┐     ┌───────────────────┐
│  Frontend   │     │   Backend   │     │ VoterRegistration│     │ Blockchain Events │
└──────┬──────┘     └──────┬──────┘     └────────┬─────────┘     └─────────┬─────────┘
       │                   │                     │                         │
       │ Submit Form       │                     │                         │
       │ (address,         │                     │                         │
       │  idHash,          │                     │                         │
       │  constituency)    │                     │                         │
       ├──────────────────►│                     │                         │
       │                   │ registerVoter       │                         │
       │                   │ (address, idHash,   │                         │
       │                   │  constituency)      │                         │
       │                   ├────────────────────►│                         │
       │                   │                     │ Transaction Processing   │
       │                   │                     ├────────────────────────►│
       │                   │                     │                         │
       │                   │                     │                         │
       │                   │                     │                         │
       │                   │                     │       VoterRegistered   │
       │                   │                     │       Event             │
       │                   │◄────────────────────┼─────────────────────────┤
       │ Registration      │                     │                         │
       │ Success Response  │                     │                         │
       │◄──────────────────┤                     │                         │
       │                   │                     │                         │
```

### Voting Process
```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐     ┌───────────────┐     ┌───────────────────┐
│  Frontend   │     │   Backend   │     │ VoterReg     │     │ Voting        │     │ Blockchain Events │
└──────┬──────┘     └──────┬──────┘     └──────┬───────┘     └───────┬───────┘     └─────────┬─────────┘
       │                   │                   │                     │                       │
       │ Cast Vote         │                   │                     │                       │
       │ (voter, candidate)│                   │                     │                       │
       ├──────────────────►│                   │                     │                       │
       │                   │ isRegistered      │                     │                       │
       │                   ├──────────────────►│                     │                       │
       │                   │◄──────────────────┤                     │                       │
       │                   │ hasVoted          │                     │                       │
       │                   ├──────────────────►│                     │                       │
       │                   │◄──────────────────┤                     │                       │
       │                   │ castVote          │                     │                       │
       │                   ├────────────────────────────────────────►│                       │
       │                   │                   │                     │ Transaction           │
       │                   │                   │                     │ Processing            │
       │                   │                   │                     ├──────────────────────►│
       │                   │                   │                     │                       │
       │                   │                   │ markVoted           │                       │
       │                   │                   │◄────────────────────┤                       │
       │                   │                   │                     │                       │
       │                   │                   │                     │       VoteCast        │
       │                   │                   │                     │       Event           │
       │                   │◄────────────────────────────────────────┼───────────────────────┤
       │ Vote Success      │                   │                     │                       │
       │ Response          │                   │                     │                       │
       │◄──────────────────┤                   │                     │                       │
       │                   │                   │                     │                       │
```

### Candidate Registration & Verification Process
```
┌─────────────┐     ┌─────────────┐     ┌────────────────┐     ┌────────────┐     ┌───────────────────┐
│  Frontend   │     │   Backend   │     │ CandidateReg   │     │ CrimCheck  │     │ Blockchain Events │
└──────┬──────┘     └──────┬──────┘     └───────┬────────┘     └─────┬──────┘     └─────────┬─────────┘
       │                   │                    │                    │                      │
       │ Register Candidate│                    │                    │                      │
       │ (address, idHash, │                    │                    │                      │
       │  name, const)     │                    │                    │                      │
       ├──────────────────►│                    │                    │                      │
       │                   │ registerCandidate  │                    │                      │
       │                   ├───────────────────►│                    │                      │
       │                   │                    │ Transaction        │                      │
       │                   │                    │ Processing         │                      │
       │                   │                    ├─────────────────────────────────────────►│
       │                   │                    │                    │                      │
       │                   │                    │                    │                      │
       │                   │                    │                    │  CandRegistered      │
       │                   │                    │                    │  Event               │
       │                   │◄────────────────────────────────────────┼──────────────────────┤
       │                   │                    │ verifyCrimRecord   │                      │
       │                   │                    ├───────────────────►│                      │
       │                   │                    │                    │                      │
       │                   │                    │                    │ Manual or            │
       │                   │                    │                    │ Automated            │
       │                   │                    │                    │ Verification         │
       │                   │                    │                    │                      │
       │                   │                    │ updateStatus       │                      │
       │                   │                    │◄────────────────────                      │
       │                   │                    │                    │                      │
       │                   │                    │                    │  StatusChanged       │
       │                   │                    │                    │  Event               │
       │                   │◄────────────────────────────────────────┼──────────────────────┤
       │ Registration      │                    │                    │                      │
       │ Confirmation      │                    │                    │                      │
       │◄──────────────────┤                    │                    │                      │
       │                   │                    │                    │                      │
```

## 6. Where What Is Happening: Key Components & Responsibilities

### Smart Contracts (Blockchain)
- **Where**: Ethereum/Polygon/other blockchain network
- **What**: 
  - Stores all permanent voting records
  - Enforces voting rules and validation
  - Maintains voter and candidate registries
  - Counts votes and maintains tallies
  - Manages administrative access control

### Backend Server
- **Where**: Node.js server deployed on cloud infrastructure
- **What**:
  - Translates frontend requests to blockchain calls
  - Handles wallet authentication
  - Caches blockchain data for faster retrieval
  - Formats and structures data for frontend consumption
  - Manages and processes blockchain events
  - Creates and signs transactions on behalf of server

### Frontend Application
- **Where**: Web application in browser
- **What**:
  - Provides user interface for all operations
  - Connects to user's wallet (MetaMask, etc.)
  - Handles local form validation
  - Displays real-time updates from blockchain
  - Shows transaction status and confirmations
  - Visualizes election results

## 7. Critical Data Parameters & Their Flow

### Voter Identity
- **Parameters**: `walletAddress`, `idHash`, `constituency`
- **Flow**: Frontend → Backend → VoterRegistration.sol → Blockchain Storage

### Candidate Identity  
- **Parameters**: `walletAddress`, `idHash`, `name`, `constituency`
- **Flow**: Frontend → Backend → CandidateRegistration.sol → CrimCheck.sol → Status Update

### Vote Casting
- **Parameters**: `voterAddress`, `candidateAddress`
- **Flow**: Frontend → Backend → Voting.sol → VoterRegistration.sol (mark voted) → Blockchain Storage

### Results Retrieval
- **Parameters**: `constituency`
- **Flow**: Frontend → Backend → ResultCompilation.sol → Format Data → Frontend Display

### Administrative Control
- **Parameters**: `adminAddress`, `operation`, `parameters` (based on operation)
- **Flow**: Frontend → Backend → AdminControl.sol → Target Contract → Blockchain Event → UI Update

## 8. Database Schema for Tracking Blockchain Data

### Voters Collection
```javascript
{
  _id: ObjectId,
  walletAddress: String,        // Voter's blockchain address
  idHash: String,               // Hashed ID for privacy
  constituency: String,         // Electoral constituency
  registrationTxHash: String,   // Transaction hash of registration
  votingStatus: {
    hasVoted: Boolean,          // Whether voter has voted
    voteTxHash: String,         // Transaction hash of vote
    timestamp: Date             // When vote was cast
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Candidates Collection
```javascript
{
  _id: ObjectId,
  walletAddress: String,        // Candidate's blockchain address
  idHash: String,               // Hashed ID for privacy
  name: String,                 // Candidate name
  constituency: String,         // Electoral constituency  
  status: String,               // "Pending", "Approved", "Rejected"
  registrationTxHash: String,   // Transaction hash of registration
  statusUpdateTxHash: String,   // Transaction hash of last status update
  voteCount: Number,            // Current vote count (cache)
  createdAt: Date,
  updatedAt: Date
}
```

### Transactions Collection
```javascript
{
  _id: ObjectId,
  txHash: String,               // Transaction hash
  blockNumber: Number,          // Block number transaction was included in
  type: String,                 // "Registration", "Vote", "AdminAction", etc.
  from: String,                 // Sender address
  to: String,                   // Contract address
  data: Object,                 // Transaction details
  status: String,               // "Pending", "Confirmed", "Failed"
  createdAt: Date,
  confirmedAt: Date
}
```

### Constituencies Collection
```javascript  
{
  _id: ObjectId,
  name: String,                 // Constituency name
  code: String,                 // Unique code
  totalRegisteredVoters: Number,
  totalVotes: Number,
  votingStatus: String,         // "Active", "Paused", "Completed"
  candidates: [                 // Array of candidate references
    {
      address: String,
      name: String
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

This document provides a detailed breakdown of the data flow, parameters being passed, and the specific operations happening at each stage of your blockchain voting system. It should give you a clear understanding of where specific operations are occurring and how data moves through the system.