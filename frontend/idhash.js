import { ethers } from 'ethers';

// Original ID or identifier [like AADHAR number, passport number, etc.]
const rawId = "my-secret-id-123";

// Hash it (keccak256 is standard in Ethereum)
const idHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(rawId));

console.log(idHash); // 0x... long hex string
