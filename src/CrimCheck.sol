// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Interfaces.sol";
import {console} from "forge-std/console.sol"; // Add this import for console.log()

contract CrimCheck {
    address private admin;

    constructor() {
        admin = msg.sender;
    }

    // ✅ Now receives candidateAddr explicitly
    function verifyCriminalRecord(address candidateAddr, string calldata idHash) external {
        // Log verification attempt
        console.log("Verifying criminal record for candidate:", candidateAddr, "with idHash:", idHash);

        // Simulated logic: if idHash starts with 'X' (0x58), reject
        string memory status = bytes(idHash)[0] == 0x58 ? "Rejected" : "Approved";

        // Log the determined status
        console.log("Criminal record status:", status);

        ICandReg(msg.sender).updateStatus(candidateAddr, status);
    }
}
