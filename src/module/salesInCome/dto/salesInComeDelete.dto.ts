import {IsInt} from "class-validator";

export class SalesInComeDeleteDto {
    @IsInt()
    salesInComeId: number;
}