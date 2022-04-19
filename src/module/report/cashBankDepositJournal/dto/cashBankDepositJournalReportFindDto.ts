import {IsInt} from "class-validator";

export class cashBankDepositJournalReportFindDto {
    @IsInt()
    accountId:number;
}