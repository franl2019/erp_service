import {DeleteInboundDto} from "../../inbound/dto/deleteInbound.dto";
import {IsInt} from "class-validator";

export class DeleteBuyInboundDto extends DeleteInboundDto {
    @IsInt()
    inboundid: number
}