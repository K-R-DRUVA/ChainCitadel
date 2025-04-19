// voter-backend/index.js
import express from 'express';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
import cors from 'cors';

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

// Contract configuration - using your provided address
const VOTER_REGISTRATION_ADDRESS = process.env.VOTER_REGISTRATION_CONTRACT_ADDRESS;
const voterRegistrationABI = [
  "function registerVoter(address voter, string memory idHash, string memory const) public returns (bool)",
  "function hasVoted(address voter) public view returns (bool)",
  "function markVoted(address voter) public returns (bool)",
  "function isRegistered(address voter) public view returns (bool)",
  "function getConstituency(address voter) public view returns (string memory)"
];

// Get contract instance
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

// API Endpoints


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
      message: 'Voter registered successfully',
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

// Start the server
app.listen(port, () => {
  console.log(`Voter Registration API running on port 3000`);
  console.log(`Voter Registration CONNECTED TO CONTRACT AT ${VOTER_REGISTRATION_ADDRESS}`);
});