import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Match the exact request/response structure from backend
export const api = {
  // Voter Registration
  registerVoter: async (voterAddress, idHash, constituency) => {
    const response = await axios.post(`${API_BASE_URL}/voters/register`, {
      voterAddress,
      idHash,
      constituency
    });
    // Backend returns: { success: true, message: 'Voter registered successfully', txHash: receipt.transactionHash }
    return response.data;
  },

  // Check if voter has voted
  checkVoterVoted: async (address) => {
    const response = await axios.get(`${API_BASE_URL}/voters/${address}/voted`);
    // Backend returns: { address: voterAddress, hasVoted: boolean }
    return response.data;
  },

  // Mark voter as voted
  markVoterAsVoted: async (address) => {
    const response = await axios.post(`${API_BASE_URL}/voters/${address}/mark-voted`);
    // Backend returns: { success: true, message: 'Voter marked as voted', txHash: receipt.transactionHash }
    return response.data;
  },

  // Check if voter is registered
  checkVoterRegistered: async (address) => {
    const response = await axios.get(`${API_BASE_URL}/voters/${address}/registered`);
    // Backend returns: { address: voterAddress, isRegistered: boolean }
    return response.data;
  },

  // Get voter constituency
  getVoterConstituency: async (address) => {
    const response = await axios.get(`${API_BASE_URL}/voters/${address}/constituency`);
    // Backend returns: { address: voterAddress, constituency: string }
    return response.data;
  }
};