// migrations/2_deploy_contracts.js
const RentalContract = artifacts.require("RentalContract");

module.exports = async function (deployer, network, accounts) {
    // Địa chỉ của chủ sở hữu và người thuê
    const owner = accounts[0];
    const renter = accounts[1];

    // Các thông số hợp đồng
    const startDate = Math.floor(Date.now() / 1000); // Thời gian bắt đầu hợp đồng
    const endDate = startDate + (365 * 24 * 60 * 60); // Thời gian kết thúc hợp đồng (1 năm sau)
    const details = "Contract details here"; // Chi tiết hợp đồng
    const depositAmount = web3.utils.toWei("1", "ether"); // Số tiền cọc (1 ETH)
    const monthlyRent = web3.utils.toWei("0.1", "ether"); // Tiền thuê hàng tháng (0.1 ETH)
    const propertyId = "property-123"; // ID của tài sản

    // Triển khai hợp đồng với các tham số
    await deployer.deploy(
        RentalContract,
        owner,
        renter,
        startDate,
        endDate,
        details,
        depositAmount,
        monthlyRent,
        propertyId
    );
};
