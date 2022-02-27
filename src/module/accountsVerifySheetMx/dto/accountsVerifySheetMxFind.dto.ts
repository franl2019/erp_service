import {IsInt} from "class-validator";

export class AccountsVerifySheetMxFindDto {
    //账款核销明细Id
    @IsInt()
    accountsVerifySheetMxId: number;
    //账款核销Id
    @IsInt()
    accountsVerifySheetId: number;
}