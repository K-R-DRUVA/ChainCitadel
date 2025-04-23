// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "./Interfaces.sol";
import {console2} from "forge-std/console2.sol";



contract VoterRegistration {
    struct Voter {
        bool isReg;
        bool hasVoted;
        string const;
        string idHash;
    }
    
    mapping(address => Voter) private voters;
    mapping(string => bool) private usedIds;
    
    event VoterRegistered(address indexed voter, string const);
    event VoterHasVoted(address indexed voter);
    
    function registerVoter(address voter, string memory idHash, string memory const) public returns (bool) {
        require(!voters[voter].isReg, "Already registered");
        require(!usedIds[idHash], "ID already used");
        
        voters[voter] = Voter({
            isReg: true,
            hasVoted: false,
            const: const,
            idHash: idHash
        });
        
        usedIds[idHash] = true;
        emit VoterRegistered(voter, const);
        return true;
    }
    
    function hasVoted(address voter) public view returns (bool) {
        return voters[voter].hasVoted;
    }
    
    function markVoted(address voter) public returns (bool) {
        require(!isRegistered(voter), "Voter is not registered");
        require(!voters[voter].hasVoted, "Already voted");
        
        if(isRegistered(voter)) {
            console2.log("Voter is registered and marking as voted:", voter);
        }
        
        voters[voter].hasVoted = true;
        emit VoterHasVoted(voter);
        return true;
    }
    function isRegistered(address voter) public view returns (bool) {
        return voters[voter].isReg;
    }
    
    function getConstituency(address voter) public view returns (string memory) {
        require(voters[voter].isReg, "Not registered from getConstituency from VoterRegistration.sol");
        return voters[voter].const;
    }
}
//