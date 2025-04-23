import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ConnectWalletButton from './ConnectWalletButton';
import walletConnect from '../utils/walletConnect';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Check wallet connection on component mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        const connected = await walletConnect.isWalletConnected();
        setIsWalletConnected(connected);
        
        if (connected) {
          const address = await walletConnect.getCurrentWalletAddress();
          setWalletAddress(address);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    };
    
    checkWalletConnection();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleWalletConnect = (walletData: any) => {
    console.log("Wallet connected:", walletData.address);
    setIsWalletConnected(true);
    setWalletAddress(walletData.address);
  };

  return (
    <nav className="bg-[#1f1b24] text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Distributed Voting System
        </Link>
        
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/voters" className="hover:text-blue-400">
            Voters
          </Link>
          <Link to="/candidates" className="hover:text-blue-400">
            Candidates
          </Link>
          <ConnectWalletButton 
            onConnect={handleWalletConnect} 
            isConnected={isWalletConnected}
            address={walletAddress}
          />
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/voters"
            className="block hover:text-blue-400 py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Voters
          </Link>
          <Link
            to="/candidates"
            className="block hover:text-blue-400 py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Candidates
          </Link>
          <div className="py-2">
            <ConnectWalletButton 
              onConnect={handleWalletConnect} 
              isConnected={isWalletConnected}
              address={walletAddress}
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;