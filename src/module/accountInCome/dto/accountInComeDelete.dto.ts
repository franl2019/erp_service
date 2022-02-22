import {IsInt} from "class-validator";

export class AccountInComeDeleteDto {
    @IsInt()
    accountIncomeId: number
}