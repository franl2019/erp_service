import {IsInt} from "class-validator";

export class AccountsVerifySheetDeleteDto {
    @IsInt()
    accountsVerifySheetId: number;
}