import React, { useEffect, useState } from 'react';
import { getAllCandidatesWithDetails } from '../services/candidates';
import './CandidatesList.css';

interface Candidate {
 

const CandidatesList: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Fetching candidates with details...');
    getAllCandidatesWithDetails()
      .then(data => {
        console.log('Received candidate data:', data);
        setCandidates(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching candidates:', err);
        setError('Failed to load candidates');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading candidates...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Candidates List</h2>
      <ul className="space-y-2">
        {candidates.length === 0 && <li>No candidates found.</li>}
        {candidates.map(candidate => (
          <li key={candidate.address} className="border p-2 rounded">
            <div><strong>Name:</strong> {candidate.name || 'Unknown'}</div>
            <div><strong>Address:</strong> {candidate.address}</div>
            <div><strong>Constituency:</strong> {candidate.constituency || 'Unknown'}</div>
            <div><strong>Status:</strong> {candidate.status || 'Unknown'}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CandidatesList;