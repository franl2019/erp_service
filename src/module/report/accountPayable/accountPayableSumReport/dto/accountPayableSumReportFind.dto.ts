import {IsInt, IsString} from "class-validator";

export class AccountPayableSumReportFindDto {
    @IsInt()
    buyid:number;
    @IsString()
    startDate:string;
    @IsString()
    endDate:string
}