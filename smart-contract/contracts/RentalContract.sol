// contracts/RentalContract.sol
pragma solidity ^0.8.0;

contract RentalContract {
    address public owner;
    address public renter;
    uint public startDate;
    uint public endDate;
    string public details;
    uint public depositAmount;
    uint public monthlyRent;
    string public propertyId; 
    
    // Enum để quản lý trạng thái hợp đồng
    enum Status {  WAITING, ACCEPTED, REJECTED, CANCELLED }
    Status public status;

    constructor(
        address _owner,
        address _renter,
        uint _startDate,
        uint _endDate,
        string memory _details,
        uint _depositAmount,
        uint _monthlyRent,
        string memory _propertyId 
    ) {
        owner = _owner;
        renter = _renter;
        startDate = _startDate;
        endDate = _endDate;
        details = _details;
        depositAmount = _depositAmount;
        monthlyRent = _monthlyRent;
        propertyId = _propertyId; 
        status = Status.ACCEPTED;
    }

    function terminateContract() public {
        require(msg.sender == owner || msg.sender == renter, "Only owner or renter can terminate the contract");
        status = Status.CANCELLED;
    }
}
