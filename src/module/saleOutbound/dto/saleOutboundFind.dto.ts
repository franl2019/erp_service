import {OutboundFindDto} from "../../outbound/dto/outboundFind.dto";
import {CodeType} from "../../autoCode/codeType";

export class SaleOutboundFindDto extends OutboundFindDto {
    constructor() {
        super();
        this.outboundtype = CodeType.XS
    }
}