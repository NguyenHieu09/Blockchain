const RentalContract = artifacts.require("RentalContract");

contract("RentalContract", (accounts) => {
    const [owner, renter] = accounts;
    let rentalContract;

    before(async () => {
        rentalContract = await RentalContract.new(
            owner,
            renter,
            Math.floor(Date.now() / 1000), // Start date (hiện tại)
            Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60), // End date (1 năm sau)
            "Test rental contract",
            web3.utils.toWei("1", "ether"), // Deposit amount (1 ETH)
            web3.utils.toWei("0.1", "ether"), // Monthly rent (0.1 ETH)
            "property-123" // Property ID
        );
    });

    it("should initialize contract with correct parameters", async () => {
        const contractOwner = await rentalContract.owner();
        const contractRenter = await rentalContract.renter();
        const startDate = await rentalContract.startDate();
        const endDate = await rentalContract.endDate();
        const details = await rentalContract.details();
        const depositAmount = await rentalContract.depositAmount();
        const monthlyRent = await rentalContract.monthlyRent();
        const propertyId = await rentalContract.propertyId();
        const status = await rentalContract.status();

        assert.equal(contractOwner, owner, "Owner address should be correct");
        assert.equal(contractRenter, renter, "Renter address should be correct");
        assert.isTrue(startDate.toNumber() > 0, "Start date should be a positive number");
        assert.isTrue(endDate.toNumber() > startDate.toNumber(), "End date should be after start date");
        assert.equal(details, "Test rental contract", "Details should match");
        assert.equal(depositAmount.toString(), web3.utils.toWei("1", "ether"), "Deposit amount should match");
        assert.equal(monthlyRent.toString(), web3.utils.toWei("0.1", "ether"), "Monthly rent should match");
        assert.equal(propertyId, "property-123", "Property ID should match");
        assert.equal(status.toString(), "1", "Status should be ACCEPTED (1)");
    });

    it("should allow owner or renter to terminate the contract", async () => {
        await rentalContract.terminateContract({ from: renter });
        const status = await rentalContract.status();
        assert.equal(status.toString(), "3", "Status should be CANCELLED (3) after termination");

        // Test that a non-owner/non-renter cannot terminate the contract
        try {
            await rentalContract.terminateContract({ from: accounts[2] });
            assert.fail("Expected error but none was received");
        } catch (error) {
            assert.include(error.message, "Only owner or renter can terminate the contract", "Expected error message not received");
        }
    });
});
