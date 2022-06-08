import {IsInt, IsString} from "class-validator";

export class cashBankDepositJournalReportFindDto {
    @IsInt()
    accountId:number;
    @IsString()
    startDate:string;
    @IsString()
    endDate:string;
}