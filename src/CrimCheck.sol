// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface ICandidateRegistration {
    function updateStatus(address cand, string calldata status) external returns (bool);
}

contract CrimCheck {
    address private admin;

    constructor() {
        admin = msg.sender;
    }

    // Called by CandidateRegistration to start a check
    function verifyCriminalRecord(string calldata idHash) external {
        // You could emit an event here to simulate async processing
        // emit CriminalCheckStarted(idHash);

        // 🔥 In a real system this might be async. Here we simulate a direct call back.
        // You'd likely store the candidate address along with the idHash if needed.

        // Simulated instant pass/fail — you might want to control this manually in tests
        address candidateAddr = tx.origin; // 🔎 only valid for testing/demo purposes
        string memory status = bytes(idHash)[0] == 0x58 ? "Rejected" : "Approved"; // random logic

        ICandidateRegistration(msg.sender).updateStatus(candidateAddr, status);
    }
}
