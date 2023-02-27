import {OutboundCreateDto} from "./outboundCreate.dto";
import {IsInt, NotEquals} from "class-validator";

export class OutboundUpdateDto extends OutboundCreateDto{
    @IsInt()
    @NotEquals(0)
    outboundid:number
}