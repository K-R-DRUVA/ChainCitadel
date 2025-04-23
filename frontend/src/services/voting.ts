import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

interface VoteData {
  voterAddress: string;
  candidateAddress: string;
  constituency: string;
}

interface ApiResponse {
  success: boolean;
  error?: string;
  data?: any;
}

/**
 * Cast a vote
//  */
// export const castVote = async (data: VoteData): Promise<ApiResponse> => {
//   console.log('Casting vote with data:', data);
//   try {
//     const response = await axios.post(`${API_BASE_URL}/voting/cast`, data);
//     return { success: true, data: response.data };
//   // } catch (error: any) {
//   //   console.error('Error casting vote:', error);
//   //   return { 
//   //     success: false, 
//   //     error: error.response?.data?.message || 'Failed to cast vote' 
//   //   };
//   // }} 
//   } catch (error: any) {
//     console.error('Error casting vote:', {
//       message: error.message,
//       reason: error.reason,
//       code: error.code,
//       stack: error.stack
//     });
  
//     res.status(500).json({
//       success: false,
//       error: error.reason || error.message
//     });
// }

//};
// export const castVote = async (data: VoteData): Promise<ApiResponse> => {
//   console.log('Casting vote with data:', data);

//   try {
//     const response = await axios.post(`${API_BASE_URL}/voting/cast`, data);
//     return { success: true, data: response.data };
//   } catch (error: any) {
//     console.error('Error casting vote:', {
//       message: error.message,
//       reason: error?.response?.data?.error || error?.response?.data?.message,
//       code: error.code,
//       stack: error.stack
//     });

//     return {
//       success: false,
//       error: error?.response?.data?.error || error.message || 'Failed to cast vote'
//     };
//   }
// };
export const castVote = async (data: VoteData): Promise<ApiResponse> => {
  console.log('Casting vote with data:', data);

  try {
    // Log the voter address and candidate address
    console.log('Voter address:', data.voterAddress); // Ensure this is the correct address
    console.log('Candidate address:', data.candidateAddress);

    const response = await axios.post(`${API_BASE_URL}/voting/cast`, data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Error casting vote:', {
      message: error.message,
      reason: error?.response?.data?.error || error?.response?.data?.message,
      code: error.code,
      stack: error.stack
    });

    return {
      success: false,
      error: error?.response?.data?.error || error.message || 'Failed to cast vote'
    };
  }
};

/**
 * Get election results by constituency
 */
export const getElectionResults = async (constituency: string): Promise<any[]> => {
  try {
    //const encodedConstituency = encodeURIComponent(constituency);
    const response = await axios.get(`${API_BASE_URL}/voting/results/${constituency}`);
    return response.data;
  } catch (error) {
    console.error('Error getting election results:', error);
    return [];
  }
};

/**
 * Get vote count for a specific candidate
 */
export const getCandidateVoteCount = async (candidateAddress: string): Promise<number> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/voting/count/${candidateAddress}`);
    return response.data.count;
  } catch (error) {
    console.error('Error getting candidate vote count:', error);
    return 0;
  }
};