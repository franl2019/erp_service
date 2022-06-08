import {IsInt, IsString} from "class-validator";

export class AccountsReceivableSumReportFindDto {
    @IsInt()
    clientid:number;

    @IsString()
    startDate:string;

    @IsString()
    endDate:string;
}