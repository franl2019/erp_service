import {IsInt} from "class-validator";

export class AccountInComeAmountMxFindDto {
    @IsInt()
    accountInComeAmountId: number
}