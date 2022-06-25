import {IsDateString} from "class-validator";

export class CountWeightedAverageRecordMxDto {
    @IsDateString()
    inDate:string;
}