import React, { useState } from 'react';
import { CheckCircle, XCircle, Search, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { checkVoterRegistered, getVoterConstituency } from '../../services/voters';
import toast from 'react-hot-toast';

const VoterCheckRegistration: React.FC = () => {
  const [voterAddress, setVoterAddress] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<{
    checked: boolean;
    isRegistered: boolean;
    constituency: string | null;
  }>({
    checked: false,
    isRegistered: false,
    constituency: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoterAddress(e.target.value);
    // Reset results when input changes
    if (checkResult.checked) {
      setCheckResult({
        checked: false,
        isRegistered: false,
        constituency: null,
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
      // Add more error handling and logging
      console.log("Checking registration for address:", voterAddress);
      const registrationResponse = await checkVoterRegistered(voterAddress);
      console.log("Registration response:", registrationResponse);
      
      if (registrationResponse && registrationResponse.success) {
        const isRegistered = registrationResponse.data.isRegistered;
        
        let constituency = null;
        if (isRegistered) {
          // If registered, get constituency
          console.log("Getting constituency for address:", voterAddress);
          const constituencyResponse = await getVoterConstituency(voterAddress);
          console.log("Constituency response:", constituencyResponse);
          
          if (constituencyResponse && constituencyResponse.success) {
            constituency = constituencyResponse.data.constituency;
          }
        }
        
        setCheckResult({
          checked: true,
          isRegistered,
          constituency,
        });
      } else {
        const errorMsg = registrationResponse?.error || 'Failed to check registration status';
        console.error("Registration check failed:", errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('Error checking voter registration:', error);
      toast.error('An error occurred while checking registration status');
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
          <Search className="h-8 w-8 text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">Check Voter Registration</h1>
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
            <div className={`mt-6 p-4 rounded-lg ${checkResult.isRegistered ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-start">
                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${checkResult.isRegistered ? 'bg-green-100' : 'bg-red-100'}`}>
                  {checkResult.isRegistered ? (
                    <CheckCircle className={`h-6 w-6 text-green-600`} />
                  ) : (
                    <XCircle className={`h-6 w-6 text-red-600`} />
                  )}
                </div>
                <div className="ml-3">
                  <h3 className={`text-lg font-medium ${checkResult.isRegistered ? 'text-green-800' : 'text-red-800'}`}>
                    {checkResult.isRegistered ? 'Registered' : 'Not Registered From VoterCheckRegistration.tsx'}
                  </h3>
                  <div className="mt-2 text-sm">
                    {checkResult.isRegistered ? (
                      <div>
                        <p className="text-green-700">
                          This wallet address is registered to vote.
                        </p>
                        {checkResult.constituency && (
                          <p className="mt-1 text-green-700">
                            <span className="font-medium">Constituency:</span> {checkResult.constituency}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <p className="text-red-700">
                          This wallet address is not registered to vote.
                        </p>
                        <div className="mt-4">
                          <Link to="/voters/register">
                            <Button variant="primary" size="sm">Register Now</Button>
                          </Link>
                        </div>
                      </div>
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

export default VoterCheckRegistration;