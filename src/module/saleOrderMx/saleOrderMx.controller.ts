import {SaleOrderMxService} from "./saleOrderMx.service";
import {Controller, Post} from "@nestjs/common";
import {SaleOrderMxFindDto} from "./dto/saleOrderMxFind.dto";

@Controller('erp/saleOrderMx')
export class SaleOrderMxController {

    constructor(
        private readonly saleOrderMxService: SaleOrderMxService
    ) {
    }

    @Post('find')
    public async find(findDto: SaleOrderMxFindDto) {
        const data = await this.saleOrderMxService.find(findDto.saleOrderId);
        return {
            code: 200,
            msg: "查询成功",
            data
        }
    }
}