import {IsInt} from "class-validator";

export class AccountInComeLevel1ReviewDto {
    @IsInt()
    accountInComeId: number
}