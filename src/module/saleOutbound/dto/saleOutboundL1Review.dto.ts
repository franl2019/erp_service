import {IsInt} from "class-validator";

export class SaleOutboundL1ReviewDto {
    @IsInt()
    outboundid:number;
}