
import {IsInt, NotEquals} from "class-validator";

export class AccountExpenditureSheetMxFindDto{
    @IsInt()
    @NotEquals(0)
    accountExpenditureId:number;
}