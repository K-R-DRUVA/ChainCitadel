const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545"); // Your Ethereum node URL
const signer = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider); // Replace with your private key

const candidateRegAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Replace with your contract address
const candidateRegABI = [
  "function updateStatus(address cand, string memory status) public returns (bool)"
];

const contract = new ethers.Contract(candidateRegAddress, candidateRegABI, signer);

async function updateCandidateStatus(candidateAddress, status) {
  try {
    const tx = await contract.updateStatus(candidateAddress, status);
    console.log("Transaction Sent: ", tx);
    await tx.wait();
    console.log("Transaction Confirmed: Candidate status updated to", status);
  } catch (error) {
    console.error("Error updating candidate status:", error);
  }
}

// Update the status for the candidate
const candidateAddress = "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f"; // Registered candidate address
const status = "Approved"; // Set the status you want

updateCandidateStatus(candidateAddress, status);
