import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { api } from '../../services/api';
import {
  Box,
  Grid,
  Heading,
  Text,
  Card,
  CardBody,
  CardHeader,
  useToast,
  Spinner
} from '@chakra-ui/react';

const CandidateList = () => {
  const { account } = useWeb3();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [constituency, setConstituency] = useState('');
  const toast = useToast();

  useEffect(() => {
    const loadCandidates = async () => {
      if (!account) return;
      
      try {
        setLoading(true);
        const { constituency } = await api.getVoterConstituency(account);
        setConstituency(constituency);
        
        const candidateList = await api.getCandidatesByConstituency(constituency);
        setCandidates(candidateList);
      } catch (error) {
        toast({
          title: 'Error loading candidates',
          description: error.message,
          status: 'error',
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    loadCandidates();
  }, [account]);

  if (loading) return <Spinner />;

  return (
    <Box>
      <Heading size="md" mb={4}>Candidates for {constituency}</Heading>
      <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
        {candidates.map((candidate) => (
          <Card key={candidate.address}>
            <CardHeader>
              <Heading size="sm">{candidate.name}</Heading>
            </CardHeader>
            <CardBody>
              <Text fontSize="sm">Address: {candidate.address}</Text>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </Box>
  );
};

export default CandidateList;
