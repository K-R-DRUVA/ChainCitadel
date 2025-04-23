import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';

// Candidate pages
import CandidatesPage from './pages/candidates/CandidatesPage';
import CandidateRegister from './pages/candidates/CandidateRegister';
import CandidateDetails from './pages/candidates/CandidateDetails';

// Voter pages
import VotersPage from './pages/voters/VotersPage';
import VoterRegister from './pages/voters/VoterRegister';
import VoterCheckRegistration from './pages/voters/VoterCheckRegistration';
import VoterCheckVoted from './pages/voters/VoterCheckVoted';
import CastVotePage from './pages/voters/CastVotePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
        
          <Route index element={<HomePage />} />
          
          {/* Candidate Routes */}
          
          <Route path="candidates" element={<CandidatesPage />} />
          <Route path="candidates/register" element={<CandidateRegister />} />
          <Route path="candidates/:candidateAddress" element={<CandidateDetails />} />
          
          {/* Voter Routes */}
          <Route path="voters" element={<VotersPage />} />
          <Route path="voters/register" element={<VoterRegister />} />
          <Route path="voters/check-registration" element={<VoterCheckRegistration />} />
          <Route path="voters/check-voted" element={<VoterCheckVoted />} />
          <Route path="/voters/cast-vote" element={<CastVotePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;