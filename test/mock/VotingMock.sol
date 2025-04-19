// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../../src/Interfaces.sol";


contract VotingMock is IVoting {
    string public lastPaused;
    string public lastResumed;
    uint256 public totalVotes;

    function pauseVoting(string memory constName) external override {
        lastPaused = constName;
    }

    function resumeVoting(string memory constName) external override {
        lastResumed = constName;
    }

    function getVotesByConst(string memory) external pure override returns (address[] memory, uint256[] memory) {
        // Return empty arrays for simplicity
        address[] memory candidates = new address[](0);
        uint256[] memory voteCounts = new uint256[](0);
        return (candidates, voteCounts);
    }

    function getTotalVotes(string memory) external view override returns (uint256) {
        return totalVotes;
    }
}