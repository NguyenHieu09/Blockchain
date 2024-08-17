// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RentalContract {
    enum RentalStatus { NotCreated, Deposited, Ongoing, Ended }

    struct Rental {
        address payable owner;
        address payable renter;
        uint startDate;
        uint endDate;
        string details;
        uint depositAmount;
        uint monthlyRent;
        string propertyId;
        RentalStatus status;
        uint lastPaymentDate; // Ngày thanh toán cuối cùng
    }

    Rental[] public rentals;

    uint public constant MAX_CREATION_PERIOD = 7 days;

    event ContractCreated(address indexed owner, address indexed renter, string propertyId, uint startDate, uint endDate);
    event RentPaid(address indexed renter, address indexed owner, uint amount, string propertyId, uint timestamp);
    event DepositReturned(address indexed renter, uint amount, string propertyId, uint timestamp);
    event PenaltyApplied(address indexed renter, uint amount, uint timestamp);
    event ContractEnded(address indexed owner, address indexed renter, string propertyId, uint timestamp);
    event DepositMade(address indexed renter, uint amount, string propertyId, uint timestamp);
    event DepositCancelled(address indexed renter, uint amount, string propertyId, uint timestamp);

    modifier onlyOwner(uint _rentalIndex) {
        require(msg.sender == rentals[_rentalIndex].owner, "Only the owner can perform this action");
        _;
    }

    modifier onlyRenter(uint _rentalIndex) {
        require(msg.sender == rentals[_rentalIndex].renter, "Only the renter can perform this action");
        _;
    }

    modifier inRentalPeriod(uint _rentalIndex) {
        require(block.timestamp >= rentals[_rentalIndex].startDate && block.timestamp <= rentals[_rentalIndex].endDate, "Not within rental period");
        _;
    }

    modifier rentalNotEnded(uint _rentalIndex) {
        require(rentals[_rentalIndex].status != RentalStatus.Ended, "Rental has ended");
        _;
    }

    function createContract(
        address payable _owner,
        address payable _renter,
        uint _startDate,
        uint _endDate,
        string memory _details,
        uint _monthlyRent,
        string memory _propertyId,
        uint _depositAmount
    ) public {
        require(_startDate < _endDate, "Invalid rental dates");
        require(msg.sender == _owner, "Only the owner can create the contract");

        Rental memory newRental = Rental({
            owner: _owner,
            renter: _renter,
            startDate: _startDate,
            endDate: _endDate,
            details: _details,
            depositAmount: _depositAmount,
            monthlyRent: _monthlyRent,
            propertyId: _propertyId,
            status: RentalStatus.NotCreated,
            lastPaymentDate: 0
        });

        rentals.push(newRental);
    }

    function depositAndCreateContract(uint _rentalIndex) public payable {
        require(_rentalIndex < rentals.length, "Invalid rental index");
        Rental storage rental = rentals[_rentalIndex];

        require(msg.sender == rental.renter, "Only the renter can make a deposit");
        require(rental.status == RentalStatus.NotCreated, "Contract already created");
        require(msg.value == rental.depositAmount, "Incorrect deposit amount");

        rental.status = RentalStatus.Deposited;

        emit DepositMade(msg.sender, msg.value, rental.propertyId, block.timestamp);
    }

    function payRent(uint _rentalIndex) public payable onlyRenter(_rentalIndex) inRentalPeriod(_rentalIndex) rentalNotEnded(_rentalIndex) {
        require(_rentalIndex < rentals.length, "Invalid rental index");
        Rental storage rental = rentals[_rentalIndex];

        require(rental.status == RentalStatus.Ongoing || rental.status == RentalStatus.Deposited, "Rental period not started or already ended");
        require(msg.value == rental.monthlyRent, "Incorrect rent amount");

        // Nếu là lần thanh toán đầu tiên, chuyển trạng thái thành Ongoing
        if (rental.lastPaymentDate == 0) {
            require(block.timestamp >= rental.startDate, "Not yet time for the first rent payment");
            rental.status = RentalStatus.Ongoing; // Chuyển trạng thái hợp đồng thành Ongoing
        } else {
            uint nextPaymentDate = rental.lastPaymentDate + 30 days;
            require(block.timestamp >= nextPaymentDate, "Not yet time for the next rent payment");
        }

        rental.lastPaymentDate = block.timestamp;
        rental.owner.transfer(msg.value);

        emit RentPaid(msg.sender, rental.owner, msg.value, rental.propertyId, block.timestamp);
    }

    function endContract(uint _rentalIndex) public onlyOwner(_rentalIndex) rentalNotEnded(_rentalIndex) {
        Rental storage rental = rentals[_rentalIndex];
        require(block.timestamp > rental.endDate, "Cannot end contract before the end date");

        if (rental.status == RentalStatus.Ongoing) {
            rental.renter.transfer(rental.depositAmount);
            emit DepositReturned(rental.renter, rental.depositAmount, rental.propertyId, block.timestamp);
        }

        rental.status = RentalStatus.Ended;

        emit ContractEnded(rental.owner, rental.renter, rental.propertyId, block.timestamp);
    }

    function applyPenalty(uint _rentalIndex, uint _penaltyAmount) public onlyOwner(_rentalIndex) rentalNotEnded(_rentalIndex) {
        Rental storage rental = rentals[_rentalIndex];
        require(_penaltyAmount > 0, "Penalty amount must be greater than zero");

        rental.owner.transfer(_penaltyAmount);
        emit PenaltyApplied(rental.renter, _penaltyAmount, block.timestamp);
    }

    function cancelDeposit(uint _rentalIndex) public onlyRenter(_rentalIndex) {
        require(_rentalIndex < rentals.length, "Invalid rental index");
        Rental storage rental = rentals[_rentalIndex];

        require(rental.status == RentalStatus.Deposited, "Deposit not made");
        require(block.timestamp > rental.startDate + MAX_CREATION_PERIOD, "Creation period not yet expired");

        uint depositAmount = rental.depositAmount;
        rental.depositAmount = 0; // To prevent re-entrancy attacks
        rental.status = RentalStatus.NotCreated; // Reset status

        payable(rental.renter).transfer(depositAmount);

        emit DepositCancelled(rental.renter, depositAmount, rental.propertyId, block.timestamp);
    }

    function getRentalDetails(uint _rentalIndex) public view returns (Rental memory) {
        return rentals[_rentalIndex];
    }

    function getAllRentals() public view returns (Rental[] memory) {
        return rentals;
    }
}
