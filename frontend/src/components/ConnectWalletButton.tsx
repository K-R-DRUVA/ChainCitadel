import React, { useState } from 'react';
import walletConnect from '../utils/walletConnect';

interface ConnectWalletButtonProps {
  onConnect: (walletData: any) => void;
  isConnected?: boolean;
  address?: string | null;
}

const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({ 
  onConnect,
  isConnected = false,
  address = null
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    if (isConnected) return;
    
    setIsLoading(true);
    try {
      const walletData = await walletConnect.connectWallet();
      onConnect(walletData);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format address for display
  const formatAddress = (addr: string | null) => {
    if (!addr) return 'Connected';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <button
      onClick={handleConnect}
      disabled={isLoading || isConnected}
      className={`px-4 py-2 rounded-md font-medium transition-colors ${
        isConnected
          ? 'bg-green-600 text-white cursor-default'
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      } ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
    >
      {isLoading ? (
        'Connecting...'
      ) : isConnected ? (
        formatAddress(address)
      ) : (
        'Connect Wallet'
      )}
    </button>
  );
};

export default ConnectWalletButton;