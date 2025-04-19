// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Interfaces.sol";

contract ResultCompilation {   
    address private votingAddr;
    address private candRegAddr;
    
    struct Result {
        address cand;
        string name;
        uint256 votes;
    }
    
    event TallyUpdated(string const);
    
    constructor(address _votingAddr, address _candRegAddr) {
        votingAddr = _votingAddr;
        candRegAddr = _candRegAddr;
    }
    
    function tallyVotes(string memory const) public returns (Result[] memory) {
        IVoting voting = IVoting(votingAddr);
        ICandReg candReg = ICandReg(candRegAddr);
        
        (address[] memory cands, uint256[] memory voteCounts) = voting.getVotesByConst(const);
        
        Result[] memory results = new Result[](cands.length);
        
        for (uint i = 0; i < cands.length; i++) {
            (string memory name, , ) = candReg.getCandDetails(cands[i]);
            
            results[i] = Result({
                cand: cands[i],
                name: name,
                votes: voteCounts[i]
            });
        }
        
        emit TallyUpdated(const);
        return results;
    }
    
    function getLiveResults(string memory const) public view returns (Result[] memory) {
        IVoting voting = IVoting(votingAddr);
        ICandReg candReg = ICandReg(candRegAddr);
        
        (address[] memory cands, uint256[] memory voteCounts) = voting.getVotesByConst(const);
        
        Result[] memory results = new Result[](cands.length);
        
        for (uint i = 0; i < cands.length; i++) {
            (string memory name, , ) = candReg.getCandDetails(cands[i]);
            
            results[i] = Result({
                cand: cands[i],
                name: name,
                votes: voteCounts[i]
            });
        }
        
        return results;
    }
    
    function getLeader(string memory const) public view returns (address, string memory, uint256) {
        Result[] memory results = getLiveResults(const);
        
        if (results.length == 0) {
            return (address(0), "", 0);
        }
        
        address leader = results[0].cand;
        string memory name = results[0].name;
        uint256 maxVotes = results[0].votes;
        
        for (uint i = 1; i < results.length; i++) {
            if (results[i].votes > maxVotes) {
                maxVotes = results[i].votes;
                leader = results[i].cand;
                name = results[i].name;
            }
        }
        
        return (leader, name, maxVotes);
    }
    
    function getTurnout(string memory const, uint256 totalRegs) public view returns (uint256) {
        IVoting voting = IVoting(votingAddr);
        
        uint256 total = voting.getTotalVotes(const);
        
        if (totalRegs == 0) {
            return 0;
        }
        
        return (total * 10000) / totalRegs / 100;
    }
}