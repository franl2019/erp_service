import {L1RInboundDto} from "../../inbound/dto/L1RInbound.dto";
import {IsInt} from "class-validator";

export class BuyInboundL2ReviewDto extends L1RInboundDto {
    @IsInt()
    inboundid: number;
}