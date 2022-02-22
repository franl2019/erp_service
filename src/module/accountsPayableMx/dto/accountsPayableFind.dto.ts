import {IsInt} from "class-validator";

export class AccountsPayableFindDto {
    @IsInt()
    accountsPayableId: number;
}