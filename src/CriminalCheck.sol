// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Interfaces.sol";

contract CriminalCheck {
    address private candRegAddr;
    mapping(address => bool) private verifiers;
    address private admin;
    mapping(string => address) private idToCand;
    mapping(string => bool) private verStatus;

    event VerRequested(string indexed idHash);
    event VerCompleted(string indexed idHash, bool hasCrimRec);

    constructor(address _candRegAddr) {
        admin = msg.sender;
        candRegAddr = _candRegAddr;
        verifiers[msg.sender] = true;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Admin only");
        _;
    }

    modifier onlyVerifier() {
        require(verifiers[msg.sender], "Verifier only");
        _;
    }

    function addVerifier(address ver) public onlyAdmin {
        verifiers[ver] = true;
    }

    function removeVerifier(address ver) public onlyAdmin {
        verifiers[ver] = false;
    }

    // Used to register candidates for verification
    function registerForVerification(string memory idHash, address cand) public {
        require(msg.sender == candRegAddr, "Unauthorized");
        idToCand[idHash] = cand;
        emit VerRequested(idHash);
    }

    // Simulate the criminal check (you can implement real checks here)
    function verifyCriminalRecord(string memory idHash) public returns (bool) {
        emit VerRequested(idHash);
        return true;
    }

    // Submit the result after verification
    function submitResult(string memory idHash, bool hasCrimRec) public onlyVerifier {
        address cand = idToCand[idHash];
        require(cand != address(0), "Not registered");

        verStatus[idHash] = !hasCrimRec;

        ICandReg candReg = ICandReg(candRegAddr);


        // Update the candidate's status based on criminal record result
        if (hasCrimRec) {
            candReg.updateStatus(cand, "Rejected");
        } else {
            candReg.updateStatus(cand, "Approved");
        }

        emit VerCompleted(idHash, hasCrimRec);
    }

    // Check if the candidate passed the criminal check (Approved)
    function isEligible(string memory idHash) public view returns (bool) {
        return verStatus[idHash];
    }
}
