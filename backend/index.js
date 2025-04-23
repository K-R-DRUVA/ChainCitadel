
// voter-backend/index.js
import express from 'express';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
import cors from 'cors';
import cfonts from 'cfonts';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Configure blockchain connection
const setupProvider = () => {
  // Use your RPC_URL from environment variables
  const providerUrl = process.env.RPC_URL || "http://127.0.0.1:8545";
  return new ethers.providers.JsonRpcProvider(providerUrl);
};

// Contract configurations
const VOTER_REGISTRATION_ADDRESS = process.env.VOTER_REGISTRATION_CONTRACT_ADDRESS;
const CANDIDATE_REGISTRATION_ADDRESS = process.env.CANDIDATE_REGISTRATION_CONTRACT_ADDRESS;
const RESULT_COMPILATION_ADDRESS = process.env.RESULT_COMPILATION_ADDRESS;

// Flag to check if Result Compilation is available
const resultCompilationAvailable = !!RESULT_COMPILATION_ADDRESS;

// Voter Registration ABI
const voterRegistrationABI = [
  "function registerVoter(address voter, string memory idHash, string memory const) public returns (bool)",
  "function hasVoted(address voter) public view returns (bool)",
  "function markVoted(address voter) public returns (bool)",
  "function isRegistered(address voter) public view returns (bool)",
  "function getConstituency(address voter) public view returns (string memory)"
];





// Get contract instance - Voter Registration
const getVoterRegistrationContract = (withSigner = false) => {
  const provider = setupProvider();

  if (withSigner) {
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("Private key not found in environment variables");
    }
    const wallet = new ethers.Wallet(privateKey, provider);
    return new ethers.Contract(VOTER_REGISTRATION_ADDRESS, voterRegistrationABI, wallet);
  }

  return new ethers.Contract(VOTER_REGISTRATION_ADDRESS, voterRegistrationABI, provider);
};

// Get contract instance - Candidate Registration
const getCandidateRegistrationContract = (withSigner = false) => {
  const provider = setupProvider();

  if (withSigner) {
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("Private key not found in environment variables");
    }
    const wallet = new ethers.Wallet(privateKey, provider);
    return new ethers.Contract(CANDIDATE_REGISTRATION_ADDRESS, candidateRegistrationABI, wallet);
  }

  return new ethers.Contract(CANDIDATE_REGISTRATION_ADDRESS, candidateRegistrationABI, provider);
};

// Get contract instance - Result Compilation
const getResultCompilationContract = (withSigner = false) => {
  if (!resultCompilationAvailable) {
    throw new Error("Result Compilation contract address not set in environment variables");
  }

  const provider = setupProvider();

  if (withSigner) {
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("Private key not found in environment variables");
    }
    const wallet = new ethers.Wallet(privateKey, provider);
    return new ethers.Contract(RESULT_COMPILATION_ADDRESS, resultCompilationABI, wallet);
  }

  return new ethers.Contract(RESULT_COMPILATION_ADDRESS, resultCompilationABI, provider);
};

// API Endpoints - Voter Registration

// Register a new voter
app.post('/api/voters/register', async (req, res) => {
  try {
    const { voterAddress, idHash, constituency } = req.body;

    if (!voterAddress || !idHash || !constituency) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!ethers.utils.isAddress(voterAddress)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }

    const contract = getVoterRegistrationContract(true);
    const tx = await contract.registerVoter(voterAddress, idHash, constituency);
    const receipt = await tx.wait();

    res.status(201).json({
      success: true,
      message: `Voter ${voterAddress} registered successfully`,
      txHash: receipt.transactionHash
    });
  } catch (error) {
    console.error('Error registering voter:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Check if voter has voted
app.get('/api/voters/:address/voted', async (req, res) => {
  try {
    const voterAddress = req.params.address;

    if (!ethers.utils.isAddress(voterAddress)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }

    const contract = getVoterRegistrationContract();
    const hasVoted = await contract.hasVoted(voterAddress);

    res.json({
      address: voterAddress,
      hasVoted
    });
  } catch (error) {
    console.error('Error checking voter status:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Mark voter as having voted
app.post('/api/voters/:address/mark-voted', async (req, res) => {
  try {
    const voterAddress = req.params.address;

    if (!ethers.utils.isAddress(voterAddress)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }

    const contract = getVoterRegistrationContract(true);
    const tx = await contract.markVoted(voterAddress);
    const receipt = await tx.wait();

    res.json({
      success: true,
      message: 'Voter marked as voted',
      txHash: receipt.transactionHash
    });
  } catch (error) {
    console.error('Error marking voter as voted:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Check if voter is registered
app.get('/api/voters/:address/registered', async (req, res) => {
  try {
    const voterAddress = req.params.address;

    if (!ethers.utils.isAddress(voterAddress)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }

    const contract = getVoterRegistrationContract();
    console.log("voterAddress", voterAddress)
    const isRegistered = await contract.isRegistered(voterAddress);

    res.json({
      address: voterAddress,
      isRegistered
    });
  } catch (error) {
    console.error('Error checking registration status:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get voter constituency
app.get('/api/voters/:address/constituency', async (req, res) => {
  try {
    const voterAddress = req.params.address;

    if (!ethers.utils.isAddress(voterAddress)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }

    const contract = getVoterRegistrationContract();
    const constituency = await contract.getConstituency(voterAddress);

    res.json({
      address: voterAddress,
      constituency
    });
  } catch (error) {
    console.error('Error getting constituency:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Candidate Registration ABI
const candidateRegistrationABI = [
  "function registerCandidate(address cand, string memory idHash, string memory name, string memory const) public returns (bool)",
  //"function updateStatus(address cand, string memory status) public returns (bool)",
  "function getStatus(address cand) public view returns (string memory)",
  "function getAllCandidates() public view returns (address[] memory)",
  "function getCandsByConst(string memory const) public view returns (address[] memory)",
  "function getCandDetails(address cand) public view returns (string memory, string memory, string memory)"
];
// API Endpoints - Candidate Registration

// Register a new candidate
app.post('/api/candidates/register', async (req, res) => {
  try {
    const { candidateAddress, idHash, name, constituency } = req.body;

    if (!candidateAddress || !idHash || !name || !constituency) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!ethers.utils.isAddress(candidateAddress)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }

    const contract = getCandidateRegistrationContract(true);
    const tx = await contract.registerCandidate(candidateAddress, idHash, name, constituency);
    const receipt = await tx.wait();

    res.status(201).json({
      success: true,
      message: 'Candidate registered successfully',
      txHash: receipt.transactionHash
    });
  } catch (error) {
    console.error('Error registering candidate:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update candidate status (restricted to authorized users)
app.post('/api/candidates/:address/status', async (req, res) => {
  try {
    const candidateAddress = req.params.address;
    const { status } = req.body;

    if (!candidateAddress || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!ethers.utils.isAddress(candidateAddress)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }

    // Note: This endpoint should ideally have additional authorization checks
    // since the contract requires msg.sender to be crimCheckAddr

    const contract = getCandidateRegistrationContract(true);
    // const tx = await contract.updateStatus(candidateAddress, status);
    // const receipt = await tx.wait();

    res.json({
      success: true,
      message: 'Candidate status updated successfully',
      // txHash: receipt.transactionHash
    });
  } catch (error) {
    console.error('Error updating candidate status:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get candidate status
app.get('/api/candidates/:address/status', async (req, res) => {
  try {
    const candidateAddress = req.params.address;

    if (!ethers.utils.isAddress(candidateAddress)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }

    const contract = getCandidateRegistrationContract();
    const status = await contract.getStatus(candidateAddress);

    res.json({
      address: candidateAddress,
      status
    });
  } catch (error) {
    console.error('Error getting candidate status:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all candidates
app.get('/api/candidates', async (req, res) => {
  try {
    const contract = getCandidateRegistrationContract();
    const candidates = await contract.getAllCandidates();

    res.json({
      candidates
    });
  } catch (error) {
    console.error('Error getting all candidates:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get candidates by constituency
app.get('/api/candidates/constituency/:constituency', async (req, res) => {
  try {
    const constituency = req.params.constituency;

    const contract = getCandidateRegistrationContract();
    const candidates = await contract.getCandsByConst(constituency);

    res.json({
      constituency,
      candidates
    });
  } catch (error) {
    console.error('Error getting candidates by constituency:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get candidate details
app.get('/api/candidates/:address/details', async (req, res) => {
  try {
    const candidateAddress = req.params.address;

    if (!ethers.utils.isAddress(candidateAddress)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }

    const contract = getCandidateRegistrationContract();
    const [name, constituency, status] = await contract.getCandDetails(candidateAddress);

    res.json({
      address: candidateAddress,
      name,
      constituency,
      status
    });
  } catch (error) {
    console.error('Error getting candidate details:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
// Result Compilation ABI
const resultCompilationABI = [
  "function tallyVotes(string memory const) public returns (tuple(address cand, string name, uint256 votes)[] memory)",
  "function getLiveResults(string memory const) public view returns (tuple(address cand, string name, uint256 votes)[] memory)",
  "function getLeader(string memory const) public view returns (address, string memory, uint256)",
  "function getTurnout(string memory const, uint256 totalRegs) public view returns (uint256)"
];

// Only add Result Compilation endpoints if the contract address is available
if (resultCompilationAvailable) {
  // API Endpoints - Result Compilation

  // Get live results for a constituency
  app.get('/api/results/:constituency', async (req, res) => {
    try {
      const constituency = req.params.constituency;

      const contract = getResultCompilationContract();
      const results = await contract.getLiveResults(constituency);

      // Format the results into a more usable structure
      const formattedResults = results.map(result => ({
        candidateAddress: result.cand,
        candidateName: result.name,
        voteCount: result.votes.toString()
      }));

      res.json({
        success: true,
        constituency,
        results: formattedResults
      });
    } catch (error) {
      console.error('Error getting live results:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Get the current leader for a constituency
  app.get('/api/results/:constituency/leader', async (req, res) => {
    try {
      const constituency = req.params.constituency;

      const contract = getResultCompilationContract();
      const [leaderAddress, leaderName, voteCount] = await contract.getLeader(constituency);

      res.json({
        success: true,
        constituency,
        leader: {
          address: leaderAddress,
          name: leaderName,
          votes: voteCount.toString()
        }
      });
    } catch (error) {
      console.error('Error getting leader:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Get voter turnout for a constituency
  app.get('/api/results/:constituency/turnout', async (req, res) => {
    try {
      const constituency = req.params.constituency;
      const totalRegistered = parseInt(req.query.registered || '0');

      const contract = getResultCompilationContract();
      const turnout = await contract.getTurnout(constituency, totalRegistered);

      res.json({
        success: true,
        constituency,
        turnoutPercentage: turnout.toString(),
        totalRegistered: totalRegistered.toString()
      });
    } catch (error) {
      console.error('Error getting turnout:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Trigger vote tallying for a constituency (admin only)
  app.post('/api/admin/tally/:constituency', async (req, res) => {
    try {
      const constituency = req.params.constituency;

      // Admin-only endpoint - should have authentication
      // Using admin wallet for this transaction
      const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;
      if (!adminPrivateKey) {
        throw new Error("Admin private key not found in environment variables");
      }

      const provider = setupProvider();
      const adminWallet = new ethers.Wallet(adminPrivateKey, provider);
      const contract = new ethers.Contract(RESULT_COMPILATION_ADDRESS, resultCompilationABI, adminWallet);

      const tx = await contract.tallyVotes(constituency);
      const receipt = await tx.wait();

      res.json({
        success: true,
        message: 'Votes tallied successfully',
        constituency,
        transactionHash: receipt.transactionHash
      });
    } catch (error) {
      console.error('Error tallying votes:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
}
// Voting Contract ABI
const votingABI = [
  "function castVote(address cand) public returns (bool)",
  "function getVoteCount(string memory const, address cand) public view returns (uint256)"
];


// Voting Contract Address
const VOTING_CONTRACT_ADDRESS = process.env.VOTING_CONTRACT_ADDRESS;

// Get Voting Contract Instance
const getVotingContract = (withSigner = false) => {
  const provider = setupProvider();
  if (withSigner) {
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("Private key not found in environment variables");
    }
    const wallet = new ethers.Wallet(privateKey, provider);
    return new ethers.Contract(VOTING_CONTRACT_ADDRESS, votingABI, wallet);
  }
  return new ethers.Contract(VOTING_CONTRACT_ADDRESS, votingABI, provider);
};

// // Cast Vote Endpoint
app.post('/api/voting/cast', async (req, res) => {
  try {
    const { candidateAddress, voterAddress } = req.body;

    if (!candidateAddress) {
      return res.status(400).json({ error: 'Missing candidateAddress' });
    }

    if (!ethers.utils.isAddress(candidateAddress)) {
      return res.status(400).json({ error: 'Invalid candidate Ethereum address' });
    }

    // Check if voterAddress is provided
    if (!voterAddress) {
      return res.status(400).json({ error: 'Missing voterAddress' });
    }

    if (!ethers.utils.isAddress(voterAddress)) {
      return res.status(400).json({ error: 'Invalid voter Ethereum address' });
    }

    // First check if voter is registered
    const voterContract = getVoterRegistrationContract();
    const isRegistered = await voterContract.isRegistered(voterAddress);
    
    if (!isRegistered) {
      return res.status(400).json({ 
        success: false, 
        error: 'Voter is not registered In the Index File' 
      });
    }

    // Then check if voter has already voted
    const hasVoted = await voterContract.hasVoted(voterAddress);
    
    if (hasVoted) {
      return res.status(400).json({ 
        success: false, 
        error: 'Voter has already cast a vote' 
      });
    }

    const contract = getVotingContract(true);
    console.log("Voting contract address:", contract.address);

    // Simulate the call to catch possible reverts
    try {
      console.log("Attempting to cast vote for candidate:", candidateAddress);
      await contract.callStatic.castVote(candidateAddress);
    } catch (staticErr) {
      if (staticErr instanceof Error) {
        console.error('Static call failed:', staticErr.message || staticErr.reason);
        return res.status(400).json({
          success: false,
          error: staticErr.message || 'Vote simulation failed'
        });
      }
      // If error is not an instance of Error, log it generically
      console.error('Static call failed:', staticErr);
      return res.status(400).json({
        success: false,
        error: 'Unknown error during vote simulation'
      });
    }

    // ✅ Real transaction only if simulation succeeded
    const tx = await contract.castVote(candidateAddress);
    const receipt = await tx.wait();

    return res.json({
      success: true,
      message: 'Vote cast successfully',
      txHash: receipt.transactionHash
    });

  } catch (error) {
    // Check if the error is an instance of Error (TypeScript-safe)
    if (error instanceof Error) {
      console.error('Error casting vote:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });

      return res.status(500).json({
        success: false,
        error: error.message || 'Unexpected error'
      });
    }

    // If error is not an instance of Error, log it generically
    console.error('Unexpected error casting vote:', error);
    return res.status(500).json({
      success: false,
      error: 'Unknown error during vote casting'
    });
  }
});


app.listen(port, () => {
  cfonts.say('Server is Running SweetHeart', {
    font: 'chrome',
    align: 'center',
    colors: ['cyan'],
    background: 'black',
    letterSpacing: 1,
    lineHeight: 1,
    space: true,
    maxLength: '0',
  });

  console.log(`\n🚀 Server is running on port ${port}\n`);

  console.log(`🗳️  Voter Registration connected to contract at:`);
  console.log(`    ${VOTER_REGISTRATION_ADDRESS}\n`);

  console.log(`👤 Candidate Registration connected to contract at:`);
  console.log(`    ${CANDIDATE_REGISTRATION_ADDRESS}\n`);

  if (resultCompilationAvailable) {
    console.log(`📊 Result Compilation connected to contract at:`);
    console.log(`    ${RESULT_COMPILATION_ADDRESS}\n`);
  } else {
    console.log(`⚠️  Result Compilation not available.`);
    console.log(`    ➤ Please deploy the contract and set RESULT_COMPILATION_ADDRESS\n`);
  }
});

// Get candidate vote count for a constituency
app.get('/api/voting/vote-count/:constituency/:candidate', async (req, res) => {
  try {
    const constituency = req.params.constituency;
    const candidateAddress = req.params.candidate;

    if (!constituency || !candidateAddress) {
      return res.status(400).json({ error: 'Missing constituency or candidate address' });
    }
    if (!ethers.utils.isAddress(candidateAddress)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }

    const contract = getVotingContract();
    const voteCount = await contract.getVoteCount(constituency, candidateAddress);

    res.json({
      success: true,
      constituency,
      candidate: candidateAddress,
      voteCount: voteCount.toString() 
    });
  } catch (error) {
    console.error('Error getting vote count:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

