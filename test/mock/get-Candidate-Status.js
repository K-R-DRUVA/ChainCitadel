const { Web3 } = require('web3'); // Import Web3
const web3 = new Web3("http://127.0.0.1:8545"); // Your RPC URL

// Example to fetch a candidate's status:
const candidateAddress = "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f"; // Candidate address here
const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Replace with your contract address
(async () => {
    

    // 1) Manually ABI‑encode the call to getStatus(address)
    const getStatusSig = web3.eth.abi.encodeFunctionSignature('getStatus(address)');
    const data = getStatusSig + candidateAddress.replace(/^0x/, '').padStart(64, '0');

    // 2) eth_call to get the raw return data
    const raw = await web3.eth.call({ to: contractAddress, data });

    // raw looks like:
    // 0x
    //   <32‑byte offset>  000...20
    //   <32‑byte length>  000...08    (if string length=8)
    //   <padded UTF‑8>    417070726f7665640000...
    //
    // 3) slice out only the UTF‑8 bytes:
    const offset = 2 + 64 * 2;
    const length = parseInt(raw.slice(2 + 64, 2 + 128), 16) * 2;
    const hexStr = '0x' + raw.slice(offset, offset + length);

    // 4) decode to UTF‑8
    const status = web3.utils.hexToUtf8(hexStr);

    console.log('Candidate Status:', status);
})();