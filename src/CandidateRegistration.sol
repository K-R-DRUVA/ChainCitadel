// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Interfaces.sol";

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
   
    address private crimCheckAddr;
    
    event CandRegistered(address indexed cand, string name, string const);
    event StatusChanged(address indexed cand, string status);
    
    constructor(address _crimCheckAddr) {
        crimCheckAddr = _crimCheckAddr;
    }
    
    function registerCandidate(
        address cand, 
        string memory idHash, 
        string memory name, 
        string memory const
    ) public returns (bool) {
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
        
        ICrimCheck crimCheck = ICrimCheck(crimCheckAddr);
        crimCheck.verifyCriminalRecord(idHash);
        
        return true;
    }
    
    function updateStatus(address cand, string memory status) public returns (bool) {
        require(msg.sender == crimCheckAddr, "Unauthorized");
        require(candidates[cand].isReg, "Not registered");
        
        candidates[cand].status = status;
        emit StatusChanged(cand, status);
        
        return true;
    }
    
    function getStatus(address cand) public view returns (string memory) {
        require(candidates[cand].isReg, "Not registered");
        return candidates[cand].status;
    }
    
    function getAllCandidates() public view returns (address[] memory) {
        return candAddrs;
    }
    
    function getCandsByConst(string memory const) public view returns (address[] memory) {
        return constCands[const];
    }
    
    function getCandDetails(address cand) public view 
        returns (string memory, string memory, string memory) {
        require(candidates[cand].isReg, "Not registered");
        Candidate memory c = candidates[cand];
        return (c.name, c.const, c.status);
    }
}