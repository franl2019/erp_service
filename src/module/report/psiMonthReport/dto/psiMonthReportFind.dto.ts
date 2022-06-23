import {IsString} from "class-validator";

export class PsiMonthReportFindDto {
    @IsString()
    startDate:string;
    @IsString()
    endDate:string;
}