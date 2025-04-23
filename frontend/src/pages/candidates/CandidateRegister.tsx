import React, { useState, FormEvent } from 'react';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { registerCandidate } from '../../services/candidates';
import toast from 'react-hot-toast';
import ConnectWalletButton from '../../components/ConnectWalletButton';
import walletConnect from '../../utils/walletConnect';
import { ethers } from 'ethers';

const CandidateRegister: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    candidateAddress: '',
    aadharNumber: '',
    name: '',
    constituency: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Check wallet connection on component mount
  React.useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        const connected = await walletConnect.isWalletConnected();
        setIsWalletConnected(connected);
        
        if (connected) {
          const address = await walletConnect.getCurrentWalletAddress();
          setWalletAddress(address);
          setFormData(prev => ({
            ...prev,
            candidateAddress: address || ''
          }));
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    };
    
    checkWalletConnection();
  }, []);

  const handleWalletConnect = (walletData: any) => {
    console.log("Wallet connected:", walletData.address);
    setIsWalletConnected(true);
    setWalletAddress(walletData.address);
    setFormData(prev => ({
      ...prev,
      candidateAddress: walletData.address
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.candidateAddress) {
      newErrors.candidateAddress = 'Candidate address is required';
    }

    if (!formData.aadharNumber) {
      newErrors.aadharNumber = 'Aadhar number is required';
    } else if (!/^\d{12}$/.test(formData.aadharNumber)) {
      newErrors.aadharNumber = 'Aadhar number must be 12 digits';
    }

    if (!formData.name) {
      newErrors.name = 'Name is required';
    }

    if (!formData.constituency) {
      newErrors.constituency = 'Constituency is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to hash the Aadhar number
  const hashAadharNumber = (aadharNumber: string): string => {
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(aadharNumber));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Hash the Aadhar number using the same function as VoterRegister
      const idHash = hashAadharNumber(formData.aadharNumber);
      
      const response = await registerCandidate({
        candidateAddress: formData.candidateAddress,
        idHash: idHash,
        name: formData.name,
        constituency: formData.constituency
      });
      
      if (response.success) {
        toast.success('Candidate registration successful!');
        navigate('/candidates');
      } else {
        toast.error(response.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error registering candidate:', error);
      toast.error('An error occurred during registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link to="/candidates" className="text-blue-600 hover:text-blue-800 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Candidates
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <UserPlus className="h-8 w-8 text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">Register as Candidate</h1>
        </div>
        
        <Card>
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-700 mb-2">Connect Your Wallet</h2>
            <p className="text-sm text-gray-500 mb-4">
              Connect your Ethereum wallet to automatically fill your wallet address and proceed with registration.
            </p>
            <ConnectWalletButton 
              onConnect={handleWalletConnect} 
              isConnected={isWalletConnected}
              address={walletAddress}
            />
          </div>

          <form onSubmit={handleSubmit}>
            

            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`block w-full rounded-md shadow-sm ${
                  errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="aadharNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Aadhar Number
              </label>
              <input
                type="text"
                id="aadharNumber"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleChange}
                className={`block w-full rounded-md shadow-sm ${
                  errors.aadharNumber ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="123456789012"
              />
              {errors.aadharNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.aadharNumber}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">Your 12-digit Aadhar number. This will be securely hashed.</p>
            </div>

            <div className="mb-6">
              <label htmlFor="constituency" className="block text-sm font-medium text-gray-700 mb-1">
                Constituency
              </label>
              <input
                type="text"
                id="constituency"
                name="constituency"
                value={formData.constituency}
                onChange={handleChange}
                className={`block w-full rounded-md shadow-sm ${
                  errors.constituency ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="District 1"
              />
              {errors.constituency && (
                <p className="mt-1 text-sm text-red-600">{errors.constituency}</p>
              )}
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                variant="primary"
                isLoading={isSubmitting}
                disabled={!isWalletConnected}
              >
                Register as Candidate
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CandidateRegister;