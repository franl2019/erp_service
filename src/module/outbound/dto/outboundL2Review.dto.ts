import {IsInt, NotEquals} from "class-validator";

export class OutboundL2ReviewDto {
    @IsInt()
    @NotEquals(0)
    outboundid:number
}