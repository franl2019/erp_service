import {L1RInboundDto} from "../../inbound/dto/L1RInbound.dto";
import {IsInt} from "class-validator";

export class Level1ReviewBuyInboundDto extends L1RInboundDto {
    @IsInt()
    inboundid: number;
}