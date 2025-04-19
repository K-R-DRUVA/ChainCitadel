// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Test.sol";
import "../src/AdminControl.sol";
import "./mock/VotingMock.sol";

contract FunctionalityTesting is Test {

    AdminControl public adminControl;
    VotingMock public votingMock;

    address newAdmin = address(0xBEEF);

    function setUp() public {
        votingMock = new VotingMock();
        adminControl = new AdminControl(address(votingMock));
    }

    function testAdminIsCorrect() public {
        // Because deployer should be admin
        assertTrue(adminControl.isValidator(address(this)), "Deployer should be validator");
    }

    function testChangeAdmin() public {
        adminControl.changeAdmin(newAdmin);
        // You can add another getter function to AdminControl if you want to assert:
        // assertEq(adminControl.getAdmin(), newAdmin, "Admin change failed");
    }

    function testAddValidator() public {
        address val = address(0x1234);
        adminControl.addValidator(val);
        assertTrue(adminControl.isValidator(val), "Validator not added");
    }
}
