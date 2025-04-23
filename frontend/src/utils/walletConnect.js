import { ethers } from 'ethers';

/**
 * Utility functions for connecting to MetaMask wallet
 */
const walletConnect = {
  /**
   * Connect to MetaMask wallet
   * @returns {Promise<string>} The connected wallet address
   */
  connectWallet: async () => {
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed. Please install MetaMask to continue.");
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Get the first account
      const address = accounts[0];
      
      // Create ethers provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          console.log('User disconnected from MetaMask');
        } else {
          console.log('Account changed to:', accounts[0]);
        }
      });

      return { address, signer, provider };
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      throw error;
    }
  },

  /**
   * Check if wallet is connected
   * @returns {Promise<boolean>} True if wallet is connected
   */
  isWalletConnected: async () => {
    try {
      if (!window.ethereum) return false;
      
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      return accounts.length > 0;
    } catch (error) {
      console.error("Error checking wallet connection:", error);
      return false;
    }
  },

  /**
   * Get current wallet address
   * @returns {Promise<string|null>} The current wallet address or null if not connected
   */
  getCurrentWalletAddress: async () => {
    try {
      if (!window.ethereum) return null;
      
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      return accounts.length > 0 ? accounts[0] : null;
    } catch (error) {
      console.error("Error getting wallet address:", error);
      return null;
    }
  },

  /**
   * Get network information
   * @returns {Promise<Object>} Network information
   */
  getNetworkInfo: async () => {
    try {
      if (!window.ethereum) return null;
      
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      return {
        chainId,
        isMainnet: chainId === '0x1',
        isRopsten: chainId === '0x3',
        isRinkeby: chainId === '0x4',
        isGoerli: chainId === '0x5',
        isKovan: chainId === '0x2a',
        isLocalhost: chainId === '0x539' // Ganache default
      };
    } catch (error) {
      console.error("Error getting network info:", error);
      return null;
    }
  }
};

export default walletConnect;