import {IsDateString, IsInt} from "class-validator";

export class CashBankDepositJournalDto {
    @IsInt()
    accountId:number;
    @IsDateString()
    startDate:string;
    @IsDateString()
    endDate:string
}