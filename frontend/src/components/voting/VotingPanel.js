import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { api } from '../../services/api';
import {
  Box,
  Button,
  Grid,
  Heading,
  Text,
  Card,
  CardBody,
  CardHeader,
  useToast,
  Spinner
} from '@chakra-ui/react';

const VotingPanel = () => {
  const { account } = useWeb3();
  const [candidates, setCandidates] = useState([]);
  const [constituency, setConstituency] = useState('');
  const [loading, setLoading] = useState(false);
  const [votingActive, setVotingActive] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const initialize = async () => {
      if (!account) return;
      
      try {
        setLoading(true);
        // Get voter's constituency
        const voterStatus = await api.checkVoterStatus(account);
        if (voterStatus.isRegistered) {
          setConstituency(voterStatus.constituency);
          
          // Check if voting is active
          const status = await api.checkVotingStatus(voterStatus.constituency);
          setVotingActive(status.isActive);

          // Load candidates
          const result = await api.getCandidatesByConstituency(voterStatus.constituency);
          setCandidates(result.candidates);
        }
      } catch (error) {
        toast({
          title: 'Error initializing voting panel',
          description: error.message,
          status: 'error',
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [account, toast]);

  const handleVote = async (candidateAddress) => {
    try {
      setLoading(true);
      const result = await api.castVote(account, candidateAddress, constituency);
      
      toast({
        title: 'Vote Cast Successfully',
        description: `Transaction Hash: ${result.txHash}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Voting Failed',
        description: error.response?.data?.error || error.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <Box maxW="6xl" mx="auto" mt="8" p="4">
        <Text>Please connect your wallet first</Text>
      </Box>
    );
  }

  return (
    <Box maxW="6xl" mx="auto" mt="8" p="4">
      <Heading mb="6">Cast Your Vote</Heading>
      <Text mb="4">Constituency: {constituency}</Text>
      
      {!votingActive && (
        <Text color="red.500" mb="4">Voting is currently not active in your constituency</Text>
      )}

      {loading ? (
        <Spinner />
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
          {candidates.map((candidate) => (
            <Card key={candidate.address}>
              <CardHeader>
                <Heading size="md">{candidate.name}</Heading>
              </CardHeader>
              <CardBody>
                <Text mb="4">{candidate.address}</Text>
                <Button
                  colorScheme="blue"
                  onClick={() => handleVote(candidate.address)}
                  isDisabled={!votingActive}
                  width="full"
                >
                  Vote
                </Button>
              </CardBody>
            </Card>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default VotingPanel;