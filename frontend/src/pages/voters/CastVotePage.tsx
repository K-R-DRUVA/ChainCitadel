import React, { useState, useEffect } from 'react';
import { castVote } from '../../services/voting';
import { getAllCandidatesWithDetails } from '../../services/candidates';

const CastVotePage: React.FC = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');
  const [voterAddress, setVoterAddress] = useState<string>('');
  const [constituency, setConstituency] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [walletConnected, setWalletConnected] = useState<boolean>(false);

  useEffect(() => {
    getAllCandidatesWithDetails().then(setCandidates);
  }, []);

  // Connect to MetaMask and get the user's address
  const connectWallet = async () => {
    setMessage('');
    if ((window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        setVoterAddress(accounts[0]);
        setWalletConnected(true);
      } catch (err) {
        setMessage('Wallet connection failed.');
      }
    } else {
      setMessage('MetaMask is not installed.');
    }
  };

  const handleVote = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (!voterAddress || !selectedCandidate || !constituency) {
      setMessage('Please fill all fields.');
      return;
    }
    const result = await castVote({
      voterAddress,
      candidateAddress: selectedCandidate,
      constituency,
    });
    if (result.success) {
      setMessage('Vote cast successfully!');
    } else {
      setMessage(result.error || 'Failed to cast vote.');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Cast Your Vote</h1>
      {/* Connect Wallet Button */}
      {!walletConnected ? (
        <button
          onClick={connectWallet}
          className="bg-yellow-500 text-white px-4 py-2 rounded mb-4"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="mb-2 text-green-700 font-semibold">
          Connected: {voterAddress}
        </div>
      )}
      <form onSubmit={handleVote} className="space-y-4 max-w-md">
        {/* Voter address is now read-only and filled from MetaMask */}
        <input
          type="text"
          placeholder="Your Voter Address"
          value={voterAddress}
          disabled
          className="w-full border p-2 rounded bg-gray-100"
        />
        <input
          type="text"
          placeholder="Your Constituency"
          value={constituency}
          onChange={e => setConstituency(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <select
          value={selectedCandidate}
          onChange={e => setSelectedCandidate(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Candidate</option>
          {candidates.map(c => (
            <option key={c.address} value={c.address}>
              {c.name} ({c.address})
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={!walletConnected}
        >
          Cast Vote
        </button>
      </form>
      {message && <div className="mt-4 text-center">{message}</div>}
    </div>
  );
};

export default CastVotePage;