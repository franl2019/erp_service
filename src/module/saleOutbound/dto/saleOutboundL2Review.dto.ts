import {IsInt} from "class-validator";

export class SaleOutboundL2ReviewDto {
    @IsInt()
    outboundid:number;
}