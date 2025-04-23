import React, { useState } from 'react';

function VoteCount() {
  const [constituency, setConstituency] = useState('');
  const [candidate, setCandidate] = useState('');
  const [voteCount, setVoteCount] = useState(null);
  const [error, setError] = useState('');

  const fetchVoteCount = async () => {
    setError('');
    setVoteCount(null);
    try {
      const response = await fetch(
        `http://localhost:3000/api/voting/vote-count/${encodeURIComponent(constituency)}/${candidate}`
      );
      const data = await response.json();
      if (data.success) {
        setVoteCount(data.voteCount);
      } else {
        setError(data.error || 'Failed to fetch vote count');
      }
    } catch (err) {
      setError('Error fetching vote count');
    }
  };

  return (
    <div>
      <h2>Check Candidate Vote Count</h2>
      <input
        type="text"
        placeholder="Constituency"
        value={constituency}
        onChange={e => setConstituency(e.target.value)}
      />
      <input
        type="text"
        placeholder="Candidate Address"
        value={candidate}
        onChange={e => setCandidate(e.target.value)}
      />
      <button onClick={fetchVoteCount}>Get Vote Count</button>
      {voteCount !== null && (
        <div>
          <strong>Vote Count:</strong> {voteCount}
        </div>
      )}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export default VoteCount;