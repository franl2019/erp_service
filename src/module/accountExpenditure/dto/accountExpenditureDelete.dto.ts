import {IsInt} from "class-validator";

export class AccountExpenditureDeleteDto {
    @IsInt()
    accountExpenditureId:number;
}