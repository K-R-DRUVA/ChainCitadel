import React from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { api } from '../../services/api';
import {
  Box,
  Button,
  Text,
  useToast,
  VStack
} from '@chakra-ui/react';

const Auth = () => {
  const { account, connectWallet } = useWeb3();
  const toast = useToast();

  const handleAuth = async () => {
    try {
      if (!account) {
        await connectWallet();
        return;
      }

      const result = await api.login(account);
      if (!result.success) {
        // If not registered, register the user
        await api.registerUser(account);
      }

      toast({
        title: 'Authentication Successful',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Authentication Failed',
        description: error.response?.data?.error || error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt="8">
      <VStack spacing={4}>
        <Text fontSize="xl">Blockchain Voting System</Text>
        <Button
          colorScheme="blue"
          onClick={handleAuth}
          width="full"
        >
          {account ? 'Authenticate Wallet' : 'Connect Wallet'}
        </Button>
        {account && (
          <Text fontSize="sm">Connected: {account}</Text>
        )}
      </VStack>
    </Box>
  );
};

export default Auth;