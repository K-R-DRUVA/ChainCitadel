import { keccak256, toUtf8Bytes } from "ethers";

const rawId = "some-unique-id-" + Date.now();
const idHash = keccak256(toUtf8Bytes(rawId));

console.log("Generated idHash:", idHash);
