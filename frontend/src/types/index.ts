export interface Voter {
  voterAddress: string;
  idHash: string;
  constituency: string;
  hasVoted?: boolean;
}

export interface Candidate {
  candidateAddress: string;
  idHash: string;
  name: string;
  constituency: string;
  status?: 'Pending' | 'Approved' | 'Rejected';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}