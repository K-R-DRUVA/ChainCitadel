import React, { useState } from 'react';
import { Vote as VoteIcon, ArrowLeft, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { checkVoterHasVoted } from '../../services/voters';
import toast from 'react-hot-toast';

const VoterCheckVoted: React.FC = () => {
  const [voterAddress, setVoterAddress] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<{
    checked: boolean;
    hasVoted: boolean;
  }>({
    checked: false,
    hasVoted: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoterAddress(e.target.value);
    // Reset results when input changes
    if (checkResult.checked) {
      setCheckResult({
        checked: false,
        hasVoted: false,
      });
    }
  };

  const handleCheck = async () => {
    if (!voterAddress) {
      toast.error('Please enter a wallet address');
      return;
    }
    
    setIsChecking(true);
    try {
      const response = await checkVoterHasVoted(voterAddress);
      
      if (response.success && response.data) {
        setCheckResult({
          checked: true,
          hasVoted: response.data.hasVoted,
        });
      } else {
        toast.error(response.error || 'Failed to check voting status');
      }
    } catch (error) {
      console.error('Error checking voter status:', error);
      toast.error('An error occurred while checking voting status');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link to="/voters" className="text-blue-600 hover:text-blue-800 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Voter Portal
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <VoteIcon className="h-8 w-8 text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">Check Voting Status</h1>
        </div>
        
        <Card>
          <div className="mb-6">
            <label htmlFor="voterAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Enter Wallet Address
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="voterAddress"
                value={voterAddress}
                onChange={handleInputChange}
                className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-l-md border-gray-300"
                placeholder="0x..."
              />
              <Button
                type="button"
                onClick={handleCheck}
                className="rounded-l-none"
                isLoading={isChecking}
              >
                Check Status
              </Button>
            </div>
          </div>
          
          {checkResult.checked && (
            <div className={`mt-6 p-4 rounded-lg ${checkResult.hasVoted ? 'bg-blue-50' : 'bg-yellow-50'}`}>
              <div className="flex items-start">
                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${checkResult.hasVoted ? 'bg-blue-100' : 'bg-yellow-100'}`}>
                  {checkResult.hasVoted ? (
                    <VoteIcon className={`h-6 w-6 text-blue-600`} />
                  ) : (
                    <X className={`h-6 w-6 text-yellow-600`} />
                  )}
                </div>
                <div className="ml-3">
                  <h3 className={`text-lg font-medium ${checkResult.hasVoted ? 'text-blue-800' : 'text-yellow-800'}`}>
                    {checkResult.hasVoted ? 'Vote Recorded' : 'No Vote Recorded'}
                  </h3>
                  <div className="mt-2 text-sm">
                    {checkResult.hasVoted ? (
                      <p className="text-blue-700">
                        This wallet address has already cast a vote in the current election.
                      </p>
                    ) : (
                      <p className="text-yellow-700">
                        This wallet address has not yet voted in the current election.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default VoterCheckVoted;