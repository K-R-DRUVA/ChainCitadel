import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { api } from '../services/api';
import { ethers } from 'ethers';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
  Text
} from '@chakra-ui/react';

const VoterRegistration = () => {
  const { account, connectWallet } = useWeb3();
  const [idNumber, setIdNumber] = useState('');
  const [constituency, setConstituency] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const toast = useToast();

  // Check if voter is already registered
  useEffect(() => {
    const checkRegistration = async () => {
      if (account) {
        try {
          const { isRegistered } = await api.checkVoterRegistered(account);
          setIsRegistered(isRegistered);
        } catch (error) {
          console.error('Error checking registration:', error);
        }
      }
    };
    checkRegistration();
  }, [account]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!account) {
      await connectWallet();
      return;
    }

    if (!idNumber || !constituency) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      // Hash the ID number using keccak256
      const idHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(idNumber)
      );

      const result = await api.registerVoter(account, idHash, constituency);
      
      if (result.success) {
        toast({
          title: 'Registration Successful',
          description: `Transaction Hash: ${result.txHash}`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        setIsRegistered(true);
      }
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: error.response?.data?.error || error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (isRegistered) {
    return (
      <Box maxW="md" mx="auto" mt="8">
        <Text color="green.500" fontSize="lg" textAlign="center">
          You are already registered as a voter!
        </Text>
      </Box>
    );
  }

  return (
    <Box maxW="md" mx="auto" mt="8">
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>ID Number</FormLabel>
          <Input
            type="text"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            placeholder="Enter your ID number"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Constituency</FormLabel>
          <Select
            value={constituency}
            onChange={(e) => setConstituency(e.target.value)}
            placeholder="Select constituency"
          >
            <option value="District1">District 1</option>
            <option value="District2">District 2</option>
            <option value="District3">District 3</option>
          </Select>
        </FormControl>

        <Button
          colorScheme="blue"
          isLoading={loading}
          onClick={handleRegister}
          width="full"
        >
          {account ? 'Register as Voter' : 'Connect Wallet'}
        </Button>
      </VStack>
    </Box>
  );
};

export default VoterRegistration;