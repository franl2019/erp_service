import {IsInt, NotEquals} from "class-validator";

export class OutboundL1ReviewDto {
    @IsInt()
    @NotEquals(0)
    outboundid:number
}