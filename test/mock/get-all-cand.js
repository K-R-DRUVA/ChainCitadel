const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545"); // Adjust to your network URL
const candidateRegAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Replace with your contract address

const candidateRegABI = [
  "function getAllCandidates() public view returns (address[] memory)"
];

const contract = new ethers.Contract(candidateRegAddress, candidateRegABI, provider);

async function getRegisteredCandidates() {
  const candidates = await contract.getAllCandidates();
  console.log("Registered Candidates:", candidates);
}

getRegisteredCandidates();