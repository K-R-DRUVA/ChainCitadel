// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Interfaces.sol";

contract Voting {
    address private voterRegAddr;
    address private candRegAddr;
    mapping(string => bool) private constPaused;
    mapping(string => mapping(address => uint256)) private votes;
    mapping(string => uint256) private totalVotes;
    
    event VoteCast(address indexed voter, string const);
    event VotingPaused(string const);
    event VotingResumed(string const);
    
    constructor(address _voterRegAddr, address _candRegAddr) {
        voterRegAddr = _voterRegAddr;
        candRegAddr = _candRegAddr;
    }
    
    function castVote(address cand) public returns (bool) {
        IVoterReg voterReg = IVoterReg(voterRegAddr);
        ICandReg candReg = ICandReg(candRegAddr);
        
        require(voterReg.isRegistered(msg.sender), "Not registered");
        require(!voterReg.hasVoted(msg.sender), "Already voted");
        
        string memory const = voterReg.getConstituency(msg.sender);
        require(!constPaused[const], "Voting paused");
        
        string memory status = candReg.getStatus(cand);
        require(keccak256(bytes(status)) == keccak256(bytes("Approved")), "Not approved");
        
        // Replaced getCandDetails with direct constituency check
        (string memory candConst,,) = candReg.getCandDetails(cand);
        require(keccak256(bytes(const)) == keccak256(bytes(candConst)), "Wrong constituency");
        
        voterReg.markVoted(msg.sender);
        votes[const][cand]++;
        totalVotes[const]++;
        
        emit VoteCast(msg.sender, const);
        return true;
    }
    
    function getVoteCount(string memory const, address cand) public view returns (uint256) {
        return votes[const][cand];
    }
    
    function getVotesByConst(string memory const) public view returns (address[] memory, uint256[] memory) {
        ICandReg candReg = ICandReg(candRegAddr);
        
        address[] memory cands = candReg.getCandsByConst(const);
        uint256[] memory voteCounts = new uint256[](cands.length);
        
        for (uint i = 0; i < cands.length; i++) {
            voteCounts[i] = votes[const][cands[i]];
        }
        
        return (cands, voteCounts);
    }
    
    function getTotalVotes(string memory const) public view returns (uint256) {
        return totalVotes[const];
    }
    
    function pauseVoting(string memory const) public {
        constPaused[const] = true;
        emit VotingPaused(const);
    }
    
    function resumeVoting(string memory const) public {
        constPaused[const] = false;
        emit VotingResumed(const);
    }
    
    function isVotingPaused(string memory const) public view returns (bool) {
        return constPaused[const];
    }
}