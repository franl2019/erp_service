import {IOutboundDeleteDto} from "../../outbound/dto/outboundDelete.dto";
import {IsInt} from "class-validator";

export class SaleOutboundDeleteDto implements IOutboundDeleteDto{
    @IsInt()
    outboundid: number;
}