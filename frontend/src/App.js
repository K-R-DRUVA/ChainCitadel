import React from 'react';
import { ChakraProvider, Box, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import Auth from './components/auth/Auth';
import VoterRegistration from './components/VoterRegistration';
import CandidateList from './components/candidates/CandidateList';
import VotingPanel from './components/voting/VotingPanel';
import ResultsDisplay from './components/results/ResultsDisplay';
import { Web3Provider } from './contexts/Web3Context';

function App() {
  return (
    <ChakraProvider>
      <Web3Provider>
        <Box p={4}>
          <Auth />
          <Tabs mt={6}>
            <TabList>
              <Tab>Register</Tab>
              <Tab>Candidates</Tab>
              <Tab>Vote</Tab>
              <Tab>Results</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <VoterRegistration />
              </TabPanel>
              <TabPanel>
                <CandidateList />
              </TabPanel>
              <TabPanel>
                <VotingPanel />
              </TabPanel>
              <TabPanel>
                <ResultsDisplay />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Web3Provider>
    </ChakraProvider>
  );
}

export default App;