import {IsInt, IsString} from "class-validator";

export class AccountsReceivableMxReportFindDto {
    @IsInt()
    clientid:number;

    @IsString()
    startDate:string;

    @IsString()
    endDate:string;
}