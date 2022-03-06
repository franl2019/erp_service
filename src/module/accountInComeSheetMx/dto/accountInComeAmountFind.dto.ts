import {IsInt} from "class-validator";

export class AccountInComeAmountFindDto {
    @IsInt()
    accountInComeAmountId: number
}