import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import CandidateCard from '../../components/CandidateCard';
import { getAllCandidates, getCandidatesByConstituency } from '../../services/candidates';
import { Candidate } from '../../types';
import toast from 'react-hot-toast';

const CandidatesPage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConstituency, setSelectedConstituency] = useState<string>('');
  
  // Get unique constituencies from candidate data
  const constituencies = [...new Set(candidates.map(c => c.constituency))];

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      try {
        let response;
        if (selectedConstituency) {
          response = await getCandidatesByConstituency(selectedConstituency);
        } else {
          response = await getAllCandidates();
        }

        if (response.success && response.data) {
          setCandidates(response.data);
        } else {
          toast.error(response.error || 'Failed to fetch candidates');
          setCandidates([]);
        }
      } catch (error) {
        console.error('Error fetching candidates:', error);
        toast.error('An error occurred while fetching candidates');
        setCandidates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [selectedConstituency]);

  // Filter candidates based on search term
  const filteredCandidates = candidates.filter(candidate => 
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.candidateAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Users className="mr-2 h-8 w-8 text-blue-600" />
            Candidates
          </h1>
          <p className="text-gray-600 mt-1">
            View and manage all candidates across constituencies
          </p>
        </div>
        <Link to="/candidates/register" className="mt-4 md:mt-0">
          <Button
            variant="primary"
            leftIcon={<PlusCircle className="h-5 w-5" />}
          >
            Register as Candidate
          </Button>
        </Link>
      </div>

      <Card className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-grow">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Candidates
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full md:w-64">
            <label htmlFor="constituency" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Constituency
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="constituency"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={selectedConstituency}
                onChange={(e) => setSelectedConstituency(e.target.value)}
              >
                <option value="">All Constituencies</option>
                {constituencies.map((constituency) => (
                  <option key={constituency} value={constituency}>
                    {constituency}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredCandidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => (
            <CandidateCard key={candidate.candidateAddress} candidate={candidate} />
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No candidates found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedConstituency 
                ? 'Try adjusting your search or filter criteria' 
                : 'No candidates have registered yet'}
            </p>
            <div className="mt-6">
              <Link to="/candidates/register">
                <Button variant="primary">Register as Candidate</Button>
              </Link>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CandidatesPage;