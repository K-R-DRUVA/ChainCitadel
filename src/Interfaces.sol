// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IVoting {
    function pauseVoting(string memory const) external;
    function resumeVoting(string memory const) external;
    function getVotesByConst(string memory const) external view returns (address[] memory, uint256[] memory);
    function getTotalVotes(string memory const) external view returns (uint256);
}

interface IVoterReg {
    function isRegistered(address voter) external view returns (bool);
    function hasVoted(address voter) external view returns (bool);
    function markVoted(address voter) external returns (bool);
    function getConstituency(address voter) external view returns (string memory);
}
    
interface ICandReg {
    function getStatus(address cand) external view returns (string memory);
    function getCandsByConst(string memory const) external view returns (address[] memory);
    function getCandDetails(address cand) external view returns (string memory, string memory, string memory);
    function updateStatus(address cand, string memory status) external returns (bool);

}

interface ICrimCheck {
    function verifyCriminalRecord(address candidateAddr, string calldata idHash) external;
}
