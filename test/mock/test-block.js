// checkRegisterVoterCalls.js
const Web3 = require("web3");

// Replace with your Infura/Alchemy/WebSocket/HTTP endpoint
const providerUrl = "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"; 
const web3 = new Web3(providerUrl);

// Replace with your deployed contract address
const contractAddress = "0xYourContractAddress";

// Replace with your contract ABI (must include VoterRegistered event)
const contractABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "voter",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "const",
        "type": "string"
      }
    ],
    "name": "VoterRegistered",
    "type": "event"
  }
];

const contract = new web3.eth.Contract(contractABI, contractAddress);

async function checkVoterRegistrations() {
  try {
    const events = await contract.getPastEvents("VoterRegistered", {
      fromBlock: 0,
      toBlock: "latest"
    });

    if (events.length > 0) {
      console.log(`✅ Found ${events.length} registerVoter() calls:`);
      events.forEach((event, index) => {
        console.log(`${index + 1}. Voter: ${event.returnValues.voter}, Const: ${event.returnValues.const}`);
      });
    } else {
      console.log("❌ No registerVoter() calls found.");
    }
  } catch (err) {
    console.error("Error fetching events:", err);
  }
}

checkVoterRegistrations();
