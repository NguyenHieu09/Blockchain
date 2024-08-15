// //contract.repository.ts
// import { Contract } from '@prisma/client';
// import prisma from '../prisma/prismaClient';
// import { CreateContractReq } from '../schemas/contract.schema';
// import { IUpdateContractReq } from '../interfaces/contract';

// export const createContract = async (contract: CreateContractReq): Promise<Contract> => {
//     return prisma.contract.create({
//         data: contract,
//     });
// };

// export const getAllContracts = async (): Promise<Array<Contract>> => {
//     return prisma.contract.findMany();
// };

// export const getContractById = async ({ contractId, userId }: IUpdateContractReq): Promise<Contract | null> => {
//     return prisma.contract.findUnique({
//         where: {
//             contract_id: contractId,
//             OR: [
//                 {
//                     owner_id: userId,
//                 },
//                 {
//                     renter_id: userId,
//                 },
//             ],
//         },
//     });
// };

// export const getContractsByOwnerId = async (ownerId: number): Promise<Contract[]> => {
//     return prisma.contract.findMany({
//         where: {
//             owner_id: ownerId,
//         },
//     });
// };

// export const getContractsByRenterId = async (renterId: number): Promise<Contract[]> => {
//     return prisma.contract.findMany({
//         where: {
//             renter_id: renterId,
//         },
//     });
// };

// export const updateContractById = async (contractId: number, contract: CreateContractReq): Promise<Contract | null> => {
//     return prisma.contract.update({
//         where: {
//             contract_id: contractId,
//         },
//         data: contract,
//     });
// };

// export const softDeleteContractById = async (contractId: number): Promise<Contract | null> => {
//     return prisma.contract.update({
//         where: {
//             contract_id: contractId,
//         },
//         data: {
//             deleted: true,
//         },
//     });
// };

// export const deleteContractById = async (contractId: number): Promise<Contract | null> => {
//     return prisma.contract.delete({
//         where: {
//             contract_id: contractId,
//         },
//     });
// };

// // import Web3 from 'web3';
// // import { Contract } from 'web3-eth-contract';
// // import RentalContractABI from '../../contractRental/build/contracts/RentalContract.json'; // ABI của hợp đồng
// import { Contract as PrismaContract } from '@prisma/client';
// // import prisma from '../prisma/prismaClient';
// // import { CreateContractReq } from '../schemas/contract.schema';

// // // Khởi tạo Web3 và hợp đồng
// // const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
// // const contractAddress = '0x1bb889935A1b09Cb736a092B6605271e2d066B0b'; // Địa chỉ của hợp đồng đã triển khai

// // // Khai báo kiểu ABI cho Contract
// // const rentalContract: Contract<any> = new web3.eth.Contract(RentalContractABI.abi as any, contractAddress);
// import Web3 from 'web3';
// import RentalContractABI from '../../contractRental/build/contracts/RentalContract.json';
// import prisma from '../prisma/prismaClient';
// import { CreateContractReq } from '../schemas/contract.schema';

// // Khởi tạo Web3 và hợp đồng từ biến môi trường
// const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));

// // const web3 = new Web3(new Web3.providers.HttpProvider(process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545'));
// const contractAddress = process.env.RENTAL_CONTRACT_ADDRESS || '0x973d24c05a0100216e347011f837875e3a6e161b';
// const rentalContract = new web3.eth.Contract(RentalContractABI.abi as any, contractAddress);

// // ...phần còn lại của mã giữ nguyên

// // Định nghĩa hàm tạo hợp đồng trên blockchain
// const createBlockchainContract = async (
//     rentalIndex: number, 
//     startDate: number, 
//     endDate: number, 
//     details: string, 
//     monthlyRent: number, 
//     propertyId: string
// ) => {
//     const accounts = await web3.eth.getAccounts();
//     const ownerAddress = accounts[0]; // Địa chỉ của chủ nhà

//     try {
//         const receipt = await rentalContract.methods.createContract(
//             rentalIndex, 
//             startDate, 
//             endDate, 
//             details, 
//             monthlyRent, 
//             propertyId
//         ).send({ from: ownerAddress });

//         // Log toàn bộ thông tin của receipt
//         console.log("Blockchain contract created successfully:");
//         console.log(receipt);

//         return receipt; // Trả về receipt để kiểm tra kết quả giao dịch
//     } catch (error) {
//         console.error("Error creating blockchain contract:", error);
//         throw error;
//     }
// };

// // // Hàm để tạo hợp đồng trong cơ sở dữ liệu
// // export const createContract = async (contract: CreateContractReq): Promise<PrismaContract> => {
// //     // Gọi hàm tạo hợp đồng trên blockchain
// //     const blockchainReceipt = await createBlockchainContract(
// //         contract.rentalIndex,
// //         new Date(contract.start_date).getTime(),
// //         new Date(contract.end_date).getTime(),
// //         contract.contract_terms,
// //         contract.monthly_rent,
// //         contract.property_id
// //     );

// //     if (!blockchainReceipt.contractAddress) {
// //         throw new Error('Blockchain contract address is undefined');
// //     }

// //     // Xây dựng đối tượng dữ liệu cho Prisma
// //     const contractData: any = {
// //         rental_index: contract.rentalIndex,
// //         owner_id: contract.owner_id,
// //         renter_id: contract.renter_id,
// //         property_id: contract.property_id,
// //         contract_terms: contract.contract_terms,
// //         start_date: new Date(contract.start_date),
// //         end_date: new Date(contract.end_date),
// //         deleted: false,
// //         status: 'WAITING',
// //         blockchain_contract_address: blockchainReceipt.contractAddress // Đây sẽ không phải là undefined
// //     };

// //     // Lưu hợp đồng vào cơ sở dữ liệu
// //     const createdContract = await prisma.contract.create({
// //         data: contractData,
// //     });

// //     // Log thông tin hợp đồng đã lưu vào cơ sở dữ liệu
// //     console.log("Contract created and saved to database successfully:");
// //     console.log(createdContract);

// //     return createdContract;
// // };

// export const createContract = async (contract: CreateContractReq): Promise<PrismaContract> => {
//     // Chuyển đổi ngày thành timestamp (số giây kể từ Epoch)
//     const startDateTimestamp = new Date(contract.start_date).getTime() / 1000;
//     const endDateTimestamp = new Date(contract.end_date).getTime() / 1000;

//     // Gọi hàm tạo hợp đồng trên blockchain
//     const blockchainReceipt = await createBlockchainContract(
//         contract.rentalIndex,
//         startDateTimestamp,
//         endDateTimestamp,
//         contract.contract_terms,
//         contract.monthly_rent,
//         contract.property_id
//     );

//     if (!blockchainReceipt.contractAddress) {
//         throw new Error('Blockchain contract address is undefined');
//     }

//     // Xây dựng đối tượng dữ liệu cho Prisma
//     const contractData: any = {
//         rental_index: contract.rentalIndex,
//         owner_id: contract.owner_id,
//         renter_id: contract.renter_id,
//         property_id: contract.property_id,
//         contract_terms: contract.contract_terms,
//         start_date: new Date(startDateTimestamp * 1000), // Chuyển đổi từ timestamp về đối tượng Date
//         end_date: new Date(endDateTimestamp * 1000),     // Chuyển đổi từ timestamp về đối tượng Date
//         deleted: false,
//         status: 'WAITING',
//         blockchain_contract_address: blockchainReceipt.contractAddress
//     };

//     // Lưu hợp đồng vào cơ sở dữ liệu
//     const createdContract = await prisma.contract.create({
//         data: contractData,
//     });

//     // Log thông tin hợp đồng đã lưu vào cơ sở dữ liệu
//     console.log("Contract created and saved to database successfully:");
//     console.log(createdContract);

//     return createdContract;
// };



// import Web3 from 'web3';
// import { Contract } from 'web3-eth-contract';
// import RentalContractABI from '../../contractRental/build/contracts/RentalContract.json'; // ABI của hợp đồng
// import { Contract as PrismaContract, Status } from '@prisma/client';
// import prisma from '../prisma/prismaClient';
// import { CreateContractReq } from '../schemas/contract.schema';

// // Khởi tạo Web3 và hợp đồng từ biến môi trường
// const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));

// const contractAddress = process.env.RENTAL_CONTRACT_ADDRESS || '0x973d24c05a0100216e347011f837875e3a6e161b';

// // Kiểm tra tính hợp lệ của địa chỉ hợp đồng
// if (!web3.utils.isAddress(contractAddress)) {
//     throw new Error('Invalid contract address.');
// }

// const rentalContract = new web3.eth.Contract(RentalContractABI.abi as any, contractAddress);

// // Định nghĩa hàm tạo hợp đồng trên blockchain
// const createBlockchainContract = async (
//     rentalIndex: number, 
//     startDate: number, 
//     endDate: number, 
//     details: string, 
//     monthlyRent: number, 
//     propertyId: string
// ) => {
//     const accounts = await web3.eth.getAccounts();
//     const ownerAddress = accounts[0]; // Địa chỉ của chủ nhà

//     try {
//         const receipt = await rentalContract.methods.createContract(
//             rentalIndex, 
//             startDate, 
//             endDate, 
//             details, 
//             monthlyRent, 
//             propertyId
//         ).send({ 
//             from: ownerAddress, 
//             gas: '3000000', 
//             gasPrice: web3.utils.toWei('20', 'gwei').toString() // Chuyển đổi thành chuỗi
//         });
        
//         console.log("Blockchain contract created successfully:");
//         console.log(receipt);

//         return receipt; 
//     } catch (error: unknown) {
//         if (error instanceof Error) {
//             console.error("Error creating blockchain contract:", error.message);
//         } else {
//             console.error("Unknown error occurred while creating blockchain contract.");
//         }
//         throw error;
//     }
// };

// // Hàm tạo hợp đồng và lưu trữ vào cơ sở dữ liệu
// export const createContract = async (contract: CreateContractReq): Promise<PrismaContract> => {
//     const startDateTimestamp = new Date(contract.start_date).getTime() / 1000;
//     const endDateTimestamp = new Date(contract.end_date).getTime() / 1000;

//     const blockchainReceipt = await createBlockchainContract(
//         contract.rentalIndex,
//         startDateTimestamp,
//         endDateTimestamp,
//         contract.contract_terms,
//         contract.monthly_rent,
//         contract.property_id
//     );

//     if (!blockchainReceipt.contractAddress) {
//         throw new Error('Blockchain contract address is undefined');
//     }

//     const contractData = {
//         rental_index: contract.rentalIndex,
//         owner_id: contract.owner_id, // Đảm bảo đây là kiểu number
//         renter_id: contract.renter_id, // Đảm bảo đây là kiểu number
//         property_id: contract.property_id,
//         contract_terms: contract.contract_terms,
//         start_date: new Date(startDateTimestamp * 1000),
//         end_date: new Date(endDateTimestamp * 1000),
//         deleted: false,
//         status: Status.WAITING, // Sử dụng giá trị enum thay vì chuỗi
//         blockchain_contract_address: blockchainReceipt.contractAddress
//     };

//     const createdContract = await prisma.contract.create({
//         data: contractData,
//     });

//     console.log("Contract created and saved to database successfully:");
//     console.log(createdContract);

//     return createdContract;
// };

import Web3 from 'web3';
import { Contract as Web3Contract } from 'web3-eth-contract';
import RentalContractABI from '../../contractRental/build/contracts/RentalContract.json'; // ABI của hợp đồng
import { Contract as PrismaContract, Status } from '@prisma/client';
import prisma from '../prisma/prismaClient';
import { CreateContractReq } from '../schemas/contract.schema';

// Khởi tạo Web3 và hợp đồng từ biến môi trường
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));

const contractAddress = process.env.RENTAL_CONTRACT_ADDRESS || '0x21078C49Ab8a50c5CBFFaE02C932BBa8b3a61Fd1';

// Kiểm tra tính hợp lệ của địa chỉ hợp đồng
if (!web3.utils.isAddress(contractAddress)) {
    throw new Error('Invalid contract address.');
}

const rentalContract = new web3.eth.Contract(RentalContractABI.abi as any, contractAddress);

// Định nghĩa hàm tạo hợp đồng trên blockchain
const createBlockchainContract = async (
    renterAddress: string, 
    startDate: number, 
    endDate: number, 
    details: string, 
    monthlyRent: number, 
    propertyId: string, 
    depositAmount: number
) => {
    const accounts = await web3.eth.getAccounts();
    const ownerAddress = accounts[0]; // Địa chỉ của chủ nhà

    try {
        const receipt = await rentalContract.methods.createContract(
            renterAddress, 
            startDate, 
            endDate, 
            details, 
            monthlyRent, 
            propertyId,
            depositAmount
        ).send({ 
            from: ownerAddress, 
            gas: '3000000', 
            gasPrice: web3.utils.toWei('20', 'gwei').toString() // Chuyển đổi thành chuỗi
        });
        
        console.log("Blockchain contract created successfully:");
        console.log(receipt);

        return receipt; 
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error creating blockchain contract:", error.message);
        } else {
            console.error("Unknown error occurred while creating blockchain contract.");
        }
        throw error;
    }
};

// Hàm tạo hợp đồng và lưu trữ vào cơ sở dữ liệu
export const createContract = async (contract: CreateContractReq): Promise<PrismaContract> => {
    const startDateTimestamp = Math.floor(contract.start_date.getTime() / 1000);
    const endDateTimestamp = Math.floor(contract.end_date.getTime() / 1000);

    // Tạo hợp đồng trên blockchain
    await createBlockchainContract(
        contract.renter_address, // Đảm bảo đây là địa chỉ của người thuê
        startDateTimestamp,
        endDateTimestamp,
        contract.contract_terms,
        contract.monthly_rent,
        contract.property_id,
        contract.deposit_amount // Thêm deposit_amount
    );

    // Lưu thông tin hợp đồng vào cơ sở dữ liệu
    const contractData = {
        owner_address: contract.owner_address,
        renter_address: contract.renter_address,
        property_id: contract.property_id,
        start_date: contract.start_date,
        end_date: contract.end_date,
        deleted: false,
        status: Status.WAITING, // Sử dụng giá trị enum thay vì chuỗi
        monthly_rent: contract.monthly_rent,
        deposit_amount: contract.deposit_amount,
        created_at: new Date(),
        updated_at: new Date(),
        contract_terms: contract.contract_terms,
    };

    const createdContract = await prisma.contract.create({
        data: contractData,
    });

    console.log("Contract created and saved to database successfully:");
    console.log(createdContract);

    return createdContract;
};

