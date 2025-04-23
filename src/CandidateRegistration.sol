// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Interfaces.sol";
import {console} from "forge-std/console.sol"; // Add this import for console.log()

contract CandidateRegistration {
    struct Candidate {
        bool isReg;
        string idHash;
        string name;
        string const;
        string status; // "Pending", "Approved", "Rejected"
    }

    mapping(address => Candidate) private candidates;
    address[] private candAddrs;
    mapping(string => address[]) private constCands;

    address public crimCheckAddr;

    event CandRegistered(address indexed cand, string name, string const);
    event StatusChanged(address indexed cand, string status);

    constructor(address _crimCheckAddr) {
        crimCheckAddr = _crimCheckAddr;
    }

    // 🔧 Add this setter function
    function setCrimCheckAddr(address _crimCheckAddr) external {
        console.log("Setting new CrimCheck address:", _crimCheckAddr); // Log the address change
        crimCheckAddr = _crimCheckAddr;
    }

    function registerCandidate(
        address cand,
        string memory idHash,
        string memory name,
        string memory const
    ) public returns (bool) {
        // Log candidate registration attempt
        console.log("Attempting to register candidate:", cand);
        console.log("Is Registered?", candidates[cand].isReg);
        
        require(!candidates[cand].isReg, "Already registered");

        candidates[cand] = Candidate({
            isReg: true,
            idHash: idHash,
            name: name,
            const: const,
            status: "Pending"
        });

        candAddrs.push(cand);
        constCands[const].push(cand);

        emit CandRegistered(cand, name, const);

        // Log the registration event
        console.log("Candidate registered:", cand, name, const);

        // Call verifyCriminalRecord
        console.log("Calling verifyCriminalRecord with candidate:", cand, "and idHash:", idHash);
        ICrimCheck(crimCheckAddr).verifyCriminalRecord(cand, idHash); // ✅ Pass candidate explicitly

        return true;
    }

    function updateStatus(address cand, string memory status) public returns (bool) {
        console.log("Updating status for candidate:", cand, "to:", status);
        
        require(msg.sender == crimCheckAddr, "Unauthorized");
        require(candidates[cand].isReg, "Not registered from the updateStatus CandidateRegistration.sol");

        candidates[cand].status = status;
        emit StatusChanged(cand, status);

        return true;
    }

    function getStatus(address cand) public view returns (string memory) {
        require(candidates[cand].isReg, "Not registered from getStatus CandidateRegistration.sol");
        return candidates[cand].status;
    }

    function getAllCandidates() public view returns (address[] memory) {
        return candAddrs;
    }

    function getCandsByConst(string memory const) public view returns (address[] memory) {
        return constCands[const];
    }

    function getCandDetails(address cand) public view returns (string memory, string memory, string memory) {
        require(candidates[cand].isReg, "Not registered from getCandDetails in CandidateRegistration.sol");
        Candidate memory c = candidates[cand];
        return (c.name, c.const, c.status);
    }
}
