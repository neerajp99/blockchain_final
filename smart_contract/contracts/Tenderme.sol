
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract TenderMe {
    address public organisation;
    address payable[] public contractors;
    address public winner;
    // bytes32 constant byteText32 = "Hello World";
    uint public status = 0;
    uint public tenderID;
    uint public tenderCount = 0;

    mapping (uint => address payable) public contracts;

    constructor() {
        // Add the organisation as the person initialising the contract
        organisation = msg.sender;
        tenderID = 1;
        // initTender(_tenderName, _tenderDetails);
    }

    struct Tender {
        uint id;
        string tenderName;
        string tenderDescription;
        address userHash;
    }

    mapping (uint => Tender) public tenders;

    // Method to apply for the tender
    function applyForTender() 
        public
        onlyEligibleContractor(msg.sender) 
        payable {
            // Append the address of the contractor applying 
            contractors.push(payable(msg.sender));
        }
    
    function initTender(
        string memory _tenderName, 
        string memory _tenderDetails
        ) public {
            tenderCount += 1;
            tenders[tenderCount] = Tender(tenderCount, _tenderName, _tenderDetails, msg.sender);
        }

    
    // Modifier to check for enough ether to continue
    modifier onlyEligibleContractor(address _contractor) {
        require(address(_contractor).balance > 0.01 ether, "You don't have enough balance.");
        _;
    }

    // Method to choose the contractor 
    function chooseContractor(uint index) 
        public 
        onlyEligibleOrganisation()
        returns (address){
        // contractors[index].transfer(address(this).balance);
        winner = contractors[index];
        contracts[tenderID] = contractors[index];
        tenderID += 1;
        contractors = new address payable[](0);
        // status = 1;
        return winner;
    }

    // Modifier to check for the owner
    modifier onlyEligibleOrganisation() {
        require(msg.sender == organisation);
        _;
    }

    // Get the status of the tender
    function getStatus()
        public
        view 
        returns(uint) {
            // Return 0 for in progress, and 1 for declared
            return status;
        }

    // Get the list of all the contractors from the pool 
    function getContractors()
        public 
        view 
        returns(address payable[] memory) {
            return contractors;
        }
    
    function getTenderDetails(uint index) 
        public 
        view
        returns(uint, string memory, string memory, address) {
            return (tenders[index].id, tenders[index].tenderName, tenders[index].tenderDescription, tenders[index].userHash);
        }
}