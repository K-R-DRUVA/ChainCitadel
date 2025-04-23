const { ethers } = require("ethers");

const candidateRegABI = [
    "function updateStatus(address cand, string memory status) public returns (bool)"
];

const candidateRegAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";  // Address of CandidateRegistration contract
const crimCheckAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";          // Address of CrimCheck contract
const candidateAddress = "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f";               // Address of the candidate
const status = "Approved";                                    // Status to update

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const contract = new ethers.Contract(candidateRegAddress, candidateRegABI, provider);

const data = contract.interface.encodeFunctionData("updateStatus", [candidateAddress, status]);

console.log("Encoded data:", data);
