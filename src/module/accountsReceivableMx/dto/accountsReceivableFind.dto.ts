import {IsInt} from "class-validator";

export class AccountsReceivableFindDto {
    @IsInt()
    accountsReceivableId: number;
}