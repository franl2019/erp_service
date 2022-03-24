import {IsInt} from "class-validator";

export class Level2ReviewSaleOutboundDto {
    @IsInt()
    outboundid:number;
}