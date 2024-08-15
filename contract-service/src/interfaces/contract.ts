// export interface IUpdateContractReq {
//     contractId: number;
//     userId: number;
// }

export interface CreateContractReq {
    owner_address: string;
    renter_address: string;
    property_id: string;
    contract_terms: string;
    start_date: Date;
    end_date: Date;
    rentalIndex: number;
    monthly_rent: number;
    deposit_amount: number;
    
}

