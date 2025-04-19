// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "forge-std/Script.sol";
import "../src/VoterRegistration.sol";
import "../src/CandidateRegistration.sol";
import "../src/Voting.sol";
import "../src/CrimCheck.sol"; 
import "../src/Interfaces.sol";
import "../src/AdminControl.sol"; 
import {console2} from "forge-std/console2.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy CrimCheck first
        CrimCheck crimCheck = new CrimCheck();

        // Pass crimCheck address to CandidateRegistration constructor
        CandidateRegistration candidateReg = new CandidateRegistration(address(crimCheck));

        // Deploy VoterRegistration (assuming no arguments)
        VoterRegistration voterReg = new VoterRegistration();

        // Deploy Voting contract with voterReg & candidateReg addresses
        Voting voting = new Voting(address(voterReg), address(candidateReg));

        AdminControl adminControl = new AdminControl(address(voting));

        
        // Printing The CONTRACT_ADDRESS of the Deployed SMART contracts
        console2.log("CRIMCHECK_CONTRACT_ADDRESS:", address(crimCheck));
        console2.log("CANDIDATE_REGISTRATION_CONTRACT_ADDRESS:", address(candidateReg));
        console2.log("VOTER_REGISTRATION_CONTRACT_ADDRESS:", address(voterReg));
        console2.log("VOTING_CONTRACT_ADDRESS:", address(voting));
        console2.log("ADMIN_CONTROL_CONTRACT_ADDRESS:", address(adminControl));
        
        vm.stopBroadcast();
    }
}


