import {IsInt, IsString} from "class-validator";

export class AccountPayableMxReportFindDto {
    @IsInt()
    buyid:number;
    @IsString()
    startDate:string;
    @IsString()
    endDate:string;
}