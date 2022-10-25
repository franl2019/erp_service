import {DeleteInboundDto} from "../../inbound/dto/deleteInbound.dto";
import {IsInt} from "class-validator";

export class BuyInboundDeleteDto extends DeleteInboundDto {
    @IsInt()
    inboundid: number
}