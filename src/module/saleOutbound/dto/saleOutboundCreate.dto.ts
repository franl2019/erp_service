import {OutboundCreateDto} from "../../outbound/dto/outboundCreate.dto";
import {CodeType} from "../../autoCode/codeType";

export class SaleOutboundCreateDto extends OutboundCreateDto{
    constructor() {
        super();
        this.outboundtype = CodeType.XS
    }
}