import {IsInt} from "class-validator";

export class Level1ReviewSaleOutboundDto {
    @IsInt()
    outboundid:number;
}