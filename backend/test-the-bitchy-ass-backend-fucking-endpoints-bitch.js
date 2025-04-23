import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

// Replace with valid addresses from your local blockchain
const VOTER_ADDRESS = '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955';
const CANDIDATE_ADDRESS = '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f';
const NEW = '0x90F79bf6EB2c4f870365E785982E1f101E93b906';
const ID_HASH = '0x0308f08857fa8b513c384cf18baed9b052ae19bca7788fb31503ce2edfacd1ed';

async function runTests() {
  try {
    console.log('1. Register a new voter');
    await axios.post(`${BASE_URL}/api/voters/register`, {
      voterAddress: VOTER_ADDRESS,
      idHash: '0x123abc456def787',
      constituency: 'District 1'
    });

    console.log('2. Check if voter is registered');
    await axios.get(`${BASE_URL}/api/voters/${VOTER_ADDRESS}/registered`);

    console.log('3. Register a new candidate');
    await axios.post(`${BASE_URL}/api/candidates/register`, {
      candidateAddress: NEW,
      idHash: `${ID_HASH}r`,
      name: 'John Doe',
      constituency: 'District 1'
    });

    console.log('4. Check candidate status');
    await axios.get(`${BASE_URL}/api/candidates/${NEW}/status`);

    console.log('5. Update candidate status to Approved');
    await axios.post(`${BASE_URL}/api/candidates/${NEW}/status`, {
      status: 'Approved'
    });

    console.log('6. Get candidate details');
    await axios.get(`${BASE_URL}/api/candidates/${NEW}/details`);

    console.log('7. Get all candidates');
    await axios.get(`${BASE_URL}/api/candidates`);

    console.log('8. Get candidates by constituency');
    await axios.get(`${BASE_URL}/api/candidates/constituency/District%201`);

    console.log('9. Check if voter has voted');
    await axios.get(`${BASE_URL}/api/voters/${VOTER_ADDRESS}/voted`);

    console.log('10. Mark voter as voted');
    await axios.post(`${BASE_URL}/api/voters/${VOTER_ADDRESS}/mark-voted`);

    console.log('11. Check again if voter has voted');
    await axios.get(`${BASE_URL}/api/voters/${VOTER_ADDRESS}/voted`);

    console.log('12. Test with invalid Ethereum address');
    try {
      await axios.get(`${BASE_URL}/api/voters/invalidaddress/registered`);
    } catch (err) {
      console.log('   Expected error for invalid address:', err.response.data);
    }

    console.log('13. Test missing fields on candidate registration');
    try {
      await axios.post(`${BASE_URL}/api/candidates/register`, {
        candidateAddress: CANDIDATE_ADDRESS,
        idHash: '0xabc123def456ghi'
      });
    } catch (err) {
      console.log('   Expected error for missing fields:', err.response.data);
    }

    console.log('✅ All tests attempted');
  } catch (err) {
    console.error('❌ Error during test run:', err.response?.data || err.message);
  }
}

runTests();
