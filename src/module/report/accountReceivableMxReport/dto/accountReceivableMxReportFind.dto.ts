import {IsInt} from "class-validator";

export class AccountReceivableMxReportFindDto {
    @IsInt()
    clientid:number
}