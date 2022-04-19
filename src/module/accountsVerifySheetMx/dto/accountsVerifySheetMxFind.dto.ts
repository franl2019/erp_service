import {IsInt} from "class-validator";

export class AccountsVerifySheetMxFindDto {
    //账款核销Id
    @IsInt()
    accountsVerifySheetId: number;
}