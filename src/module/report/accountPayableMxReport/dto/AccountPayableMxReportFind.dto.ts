import {IsInt} from "class-validator";

export class AccountPayableMxReportFindDto {
    @IsInt()
    buyid:number
}