import React, { useState, FormEvent, useEffect } from 'react';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { registerVoter } from '../../services';
import toast from 'react-hot-toast';
import walletConnect from '../../utils/walletConnect';
import { ethers } from 'ethers';

const VoterRegister: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    voterAddress: '',
    aadharNumber: '',
    constituency: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      const connected = await walletConnect.isWalletConnected();
      setIsWalletConnected(connected);
      
      if (connected) {
        const address = await walletConnect.getCurrentWalletAddress();
        setFormData(prev => ({
          ...prev,
          voterAddress: address || ''
        }));
      }
    };
    
    checkWalletConnection();
  }, []);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      const walletData = await walletConnect.connectWallet();
      setIsWalletConnected(true);
      setFormData(prev => ({
        ...prev,
        voterAddress: walletData.address
      }));
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast.error("Failed to connect wallet. Please try again.");
    } finally {
      setIsConnecting(false);
    }
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

    if (!formData.voterAddress) {
      newErrors.voterAddress = 'Wallet connection is required';
    }

    if (!formData.aadharNumber) {
      newErrors.aadharNumber = 'Aadhar number is required';
    } else if (!/^\d{12}$/.test(formData.aadharNumber)) {
      newErrors.aadharNumber = 'Aadhar number must be 12 digits';
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
    
    if (!isWalletConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Hash the Aadhar number
      const hashedAadhar = hashAadharNumber(formData.aadharNumber);
      
      // Use the registerVoter service function
      const result = await registerVoter({
        voterAddress: formData.voterAddress,
        idHash: hashedAadhar,
        constituency: formData.constituency
      });
      
      if (result.success) {
        toast.success('Voter registration successful!');
        navigate('/voters');
      } else {
        toast.error(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error registering voter:', error);
      toast.error('An error occurred during registration');
    } finally {
      setIsSubmitting(false);
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
          <UserPlus className="h-8 w-8 text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">Register as Voter</h1>
        </div>
        
        <Card>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wallet Address
              </label>
              {isWalletConnected ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={formData.voterAddress}
                    readOnly
                    className="block w-full rounded-md shadow-sm border-gray-300 bg-gray-100 cursor-not-allowed"
                  />
                  <div className="ml-2 text-sm text-green-600 font-medium">Connected</div>
                </div>
              ) : (
                <div>
                  <Button 
                    type="button" 
                    onClick={connectWallet} 
                    isLoading={isConnecting}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Connect MetaMask Wallet
                  </Button>
                  {errors.voterAddress && (
                    <p className="mt-1 text-sm text-red-600">{errors.voterAddress}</p>
                  )}
                </div>
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
                placeholder="12-digit Aadhar number"
                maxLength={12}
              />
              {errors.aadharNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.aadharNumber}</p>
              )}
              
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
                Register as Voter
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default VoterRegister;