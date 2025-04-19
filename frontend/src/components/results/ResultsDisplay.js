import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { api } from '../../services/api';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useToast,
  Spinner
} from '@chakra-ui/react';

const ResultsDisplay = () => {
  const { account } = useWeb3();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [constituency, setConstituency] = useState('');
  const toast = useToast();

  useEffect(() => {
    const loadResults = async () => {
      if (!account) return;
      
      try {
        setLoading(true);
        const { constituency } = await api.getVoterConstituency(account);
        setConstituency(constituency);
        
        const liveResults = await api.getLiveResults(constituency);
        const turnout = await api.getTurnout(constituency);
        
        setResults({ ...liveResults, turnout });
      } catch (error) {
        toast({
          title: 'Error loading results',
          description: error.message,
          status: 'error',
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    loadResults();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(loadResults, 30000);
    return () => clearInterval(interval);
  }, [account]);

  if (loading) return <Spinner />;
  if (!results) return null;

  return (
    <Box>
      <Heading size="md" mb={4}>Election Results - {constituency}</Heading>
      
      <VStack spacing={6} align="stretch">
        <Stat>
          <StatLabel>Voter Turnout</StatLabel>
          <StatNumber>{results.turnout}%</StatNumber>
          <StatHelpText>Total Votes: {results.totalVotes}</StatHelpText>
        </Stat>

        {results.candidates.map((candidate) => (
          <Box key={candidate.address} p={4} borderWidth={1} borderRadius="md">
            <HStack justify="space-between" mb={2}>
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold">{candidate.name}</Text>
                <Text fontSize="sm">{candidate.address}</Text>
              </VStack>
              <Text fontWeight="bold">{candidate.votes} votes</Text>
            </HStack>
            <Progress 
              value={(candidate.votes / results.totalVotes) * 100} 
              colorScheme="blue"
              size="sm"
            />
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default ResultsDisplay;
