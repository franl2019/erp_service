import {IsInt} from "class-validator";

export class AccountsVerifySheetL1ReviewDto {
    @IsInt()
    accountsVerifySheetId: number;
}