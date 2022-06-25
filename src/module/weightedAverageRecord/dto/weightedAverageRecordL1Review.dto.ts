import {IsDateString} from "class-validator";

export class WeightedAverageRecordL1ReviewDto {
    @IsDateString()
    inDate:string;
}