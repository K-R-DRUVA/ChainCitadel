import axios from 'axios';

// Define the base URL for API calls
const API_BASE_URL = 'http://localhost:3000/api';

interface VoterRegistrationData {
  voterAddress: string;
  idHash: string;
  constituency: string;
}

interface ApiResponse {
  success: boolean;
  error?: string;
  data?: any;
}

/**
 * Register a new voter
 */
export const registerVoter = async (data: VoterRegistrationData): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/voters/register`, data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Error registering voter:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to register voter' 
    };
  }
};

/**
 * Check if a voter has voted
 */
// Add or update this function in your voters.ts file
export const checkVoterHasVoted = async (voterAddress: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/voters/${voterAddress}/voted`);
    return { 
      success: true, 
      data: { 
        hasVoted: response.data.hasVoted 
      } 
    };
  } catch (error: any) {
    console.error('Error checking if voter has voted:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to check voting status' 
    };
  }
};

/**
 * Mark a voter as having voted
 */
export const markVoterAsVoted = async (voterAddress: string): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/voters/${voterAddress}/mark-voted`);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Error marking voter as voted:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to mark voter as voted' 
    };
  }
};

/**
 * Check if a voter is registered
 */
export const checkVoterRegistered = async (voterAddress: string): Promise<any> => {
  try {
    console.log(`Making API call to: ${API_BASE_URL}/voters/${voterAddress}/registered`);
    const response = await axios.get(`${API_BASE_URL}/voters/${voterAddress}/registered`);
    console.log("Raw API response:", response);
    
    return { 
      success: true, 
      data: { 
        isRegistered: response.data.isRegistered 
      } 
    };
  } catch (error: any) {
    console.error('Error checking if voter is registered:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to check registration status' 
    };
  }
};

export const getVoterConstituency = async (voterAddress: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/voters/${voterAddress}/constituency`);
    return { 
      success: true, 
      data: { 
        constituency: response.data.constituency 
      } 
    };
  } catch (error: any) {
    console.error('Error getting voter constituency:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to get constituency' 
    };
  }
};