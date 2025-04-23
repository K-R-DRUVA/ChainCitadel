// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "forge-std/Script.sol";
import "../src/VoterRegistration.sol";
import "../src/CandidateRegistration.sol";
import "../src/Voting.sol";
import "../src/CrimCheck.sol"; 
import "../src/Interfaces.sol";
import "../src/AdminControl.sol"; 
import "../src/ResultCompilation.sol";
import {console2} from "forge-std/console2.sol";

contract DeployScript is Script {
    function run() external {
        // Start broadcasting deployment
        vm.startBroadcast();

        // Deploy CrimCheck contract (without passing any arguments)
        CrimCheck crimCheck = new CrimCheck();

        // Deploy CandidateRegistration with CrimCheck address as constructor argument
        CandidateRegistration candidateReg = new CandidateRegistration(address(crimCheck));

        // Deploy VoterRegistration (assuming no constructor arguments for this contract)
        VoterRegistration voterReg = new VoterRegistration();

        // Deploy Voting contract with the addresses of VoterRegistration and CandidateRegistration
        Voting voting = new Voting(address(voterReg), address(candidateReg));

        // Deploy AdminControl contract with the Voting contract address
        AdminControl adminControl = new AdminControl(address(voting));

        // Deploy ResultCompilation contract with the addresses of Voting and CandidateRegistration
        ResultCompilation resultCompilation = new ResultCompilation(address(voting), address(candidateReg));

        // Log the addresses of the deployed contracts
        console2.log("CANDIDATE_REGISTRATION_CONTRACT_ADDRESS:", address(candidateReg));
        console2.log("VOTER_REGISTRATION_CONTRACT_ADDRESS:", address(voterReg));
        console2.log("VOTING_CONTRACT_ADDRESS:", address(voting));
        console2.log("ADMIN_CONTROL_CONTRACT_ADDRESS:", address(adminControl));
        console2.log("RESULT_COMPILATION_ADDRESS:", address(resultCompilation));

        // End broadcasting deployment
        vm.stopBroadcast();
    }
}