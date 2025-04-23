import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

interface CandidateRegistrationData {
  candidateAddress: string;
  idHash: string;
  name: string;
  constituency: string;
}

interface ApiResponse {
  success: boolean;
  error?: string;
  data?: any;
}

/**
 * Register a new candidate
 */
export const registerCandidate = async (candidateData: CandidateRegistrationData): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/candidates/register`, candidateData);
    return { 
      success: true, 
      data: response.data 
    };
  } catch (error: any) {
    console.error('Error registering candidate:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to register candidate' 
    };
  }
};

/**
 * Update candidate status
 */
export const updateCandidateStatus = async (candidateAddress: string, status: string): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/candidates/${candidateAddress}/status`, { status });
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Error updating candidate status:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to update candidate status' 
    };
  }
};

/**
 * Get candidate status
 */
export const getCandidateStatus = async (candidateAddress: string): Promise<string | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/candidates/${candidateAddress}/status`);
    return response.data.status;
  } catch (error) {
    console.error('Error getting candidate status:', error);
    return null;
  }
};

/**
 * Get all candidates
 */
export const getAllCandidates = async (): Promise<any[]> => {
  try {
    console.log('Fetching all candidates from:', `${API_BASE_URL}/candidates`);
    const response = await axios.get(`${API_BASE_URL}/candidates`);
    console.log('Candidates response:', response.data);
    
    // Extract the candidates array from the response object
    if (response.data && Array.isArray(response.data.candidates)) {
      return response.data.candidates;
    }
    
    // If the response doesn't have the expected structure, return an empty array
    console.warn('Unexpected response format:', response.data);
    return [];
  } catch (error: any) {
    console.error('Error getting all candidates:', error);
    // More detailed error logging
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
    return [];
  }
};

/**
 * Get candidates by constituency
 */
export const getCandidatesByConstituency = async (constituency: string): Promise<any[]> => {
  try {
    const encodedConstituency = encodeURIComponent(constituency);
    const response = await axios.get(`${API_BASE_URL}/candidates/constituency/${encodedConstituency}`);
    return response.data;
  } catch (error) {
    console.error('Error getting candidates by constituency:', error);
    return [];
  }
};

/**
 * Get candidate details
 */
export const getCandidateDetails = async (candidateAddress: string): Promise<any | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/candidates/${candidateAddress}/details`);
    return response.data;
  } catch (error) {
    console.error('Error getting candidate details:', error);
    return null;
  }
};

/**
 * Get all candidates with details
 */
export const getAllCandidatesWithDetails = async (): Promise<any[]> => {
  try {
    console.log('Fetching all candidates from:', `${API_BASE_URL}/candidates`);
    const response = await axios.get(`${API_BASE_URL}/candidates`);
    console.log('Candidates response:', response.data);
    
    // Extract the candidates array from the response object
    if (response.data && Array.isArray(response.data.candidates)) {
      const candidateAddresses = response.data.candidates;
      console.log('Found candidate addresses:', candidateAddresses);
      
      // Fetch details for each candidate
      const candidatesWithDetails = await Promise.all(
        candidateAddresses.map(async (address: string) => {
          console.log(`Fetching details for candidate: ${address}`);
          try {
            const detailsUrl = `${API_BASE_URL}/candidates/${address}/details`;
            console.log(`Making request to: ${detailsUrl}`);
            const detailRes = await axios.get(detailsUrl);
            console.log(`Details response for ${address}:`, detailRes.data);
            
            return {
              address,
              name: detailRes.data.name || 'Unknown',
              constituency: detailRes.data.constituency || 'Unknown',
              status: detailRes.data.status || 'Unknown'
            };
          } catch (error) {
            console.error(`Error fetching details for candidate ${address}:`, error);
            return { address, name: 'Error loading', constituency: 'Error loading', status: 'Error loading' };
          }
        })
      );
      
      console.log('Final candidates with details:', candidatesWithDetails);
      return candidatesWithDetails;
    }
    
    // If the response doesn't have the expected structure, return an empty array
    console.warn('Unexpected response format:', response.data);
    return [];
  } catch (error: any) {
    console.error('Error getting all candidates:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    return [];
  }
};
