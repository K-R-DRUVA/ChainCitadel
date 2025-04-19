// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Interfaces.sol";

contract AdminControl {
    struct PauseReq {
        string const;
        uint256 approvals;
        bool executed;
        mapping(address => bool) approved;
    }

    address private votingAddr;
    address private admin;
    mapping(address => bool) private validators;
    uint256 private valCount;
    uint256 private threshold;
    mapping(uint256 => PauseReq) private pauseReqs;
    uint256 private nextReqId;

    event PauseRequest(uint256 reqId, string constName);
    event ValidatorApproved(uint256 reqId, address val);
    event VotingPaused(string const);
    event VotingResumed(string const);
    event ValidatorAdded(address val);
    event ValidatorRemoved(address val);
    event AdminChanged(address oldAdmin, address newAdmin); // New event for admin change

    constructor(address _votingAddr) {
        admin = msg.sender;
        votingAddr = _votingAddr;
        threshold = 67; // 67% consensus required
        validators[msg.sender] = true;
        valCount = 1;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Admin only");
        _;
    }

    modifier onlyValidator() {
        require(validators[msg.sender], "Validator only");
        _;
    }

    function changeAdmin(address newAdmin) public onlyAdmin {
        require(newAdmin != address(0), "Invalid admin address");
        require(newAdmin != admin, "Same admin");
        address oldAdmin = admin;
        admin = newAdmin;
        emit AdminChanged(oldAdmin, newAdmin);
    }

    function addValidator(address val) public onlyAdmin {
        require(!validators[val], "Already validator");
        validators[val] = true;
        valCount++;
        emit ValidatorAdded(val);
    }

    function removeValidator(address val) public onlyAdmin {
        require(validators[val], "Not validator");
        validators[val] = false;
        valCount--;
        emit ValidatorRemoved(val);
    }

    function setThreshold(uint256 newThresh) public onlyAdmin {
        require(newThresh > 0 && newThresh <= 100, "1-100 only");
        threshold = newThresh;
    }

    function requestPause(string memory const) public onlyAdmin returns (uint256) {
        uint256 reqId = nextReqId++;

        PauseReq storage req = pauseReqs[reqId];
        req.const = const;
        req.approvals = 0;
        req.executed = false;

        emit PauseRequest(reqId, const);
        return reqId;
    }

    function approvePause(uint256 reqId) public onlyValidator {
        PauseReq storage req = pauseReqs[reqId];
        require(!req.executed, "Already executed");
        require(!req.approved[msg.sender], "Already approved");

        req.approved[msg.sender] = true;
        req.approvals++;

        emit ValidatorApproved(reqId, msg.sender);

        if (req.approvals * 100 / valCount >= threshold) {
            IVoting voting = IVoting(votingAddr);
            voting.pauseVoting(req.const);
            req.executed = true;
            emit VotingPaused(req.const);
        }
    }

    function requestResume(string memory const) public onlyAdmin returns (uint256) {
        uint256 reqId = nextReqId++;

        PauseReq storage req = pauseReqs[reqId];
        req.const = const;
        req.approvals = 0;
        req.executed = false;

        emit PauseRequest(reqId, const);
        return reqId;
    }

    function approveResume(uint256 reqId) public onlyValidator {
        PauseReq storage req = pauseReqs[reqId];
        require(!req.executed, "Already executed");
        require(!req.approved[msg.sender], "Already approved");

        req.approved[msg.sender] = true;
        req.approvals++;

        if (req.approvals * 100 / valCount >= threshold) {
            IVoting voting = IVoting(votingAddr);
            voting.resumeVoting(req.const);
            req.executed = true;
            emit VotingResumed(req.const);
        }
    }

    function isValidator(address val) public view returns (bool) {
        return validators[val];
    }

    function getAdmin() public view returns (address) {
        return admin;
    }
}