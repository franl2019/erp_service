import {Body, Controller, Post} from "@nestjs/common";
import {AccountsReceivableService} from "./accountsReceivable.service";
import {AccountsReceivableFindDto} from "./dto/accountsReceivableFind.dto";

@Controller('erp/accountsReceivable')
export class AccountsReceivableController {

    constructor(private readonly accountsReceivableService: AccountsReceivableService) {
    }

    @Post('find')
    public async find(@Body() findDto: AccountsReceivableFindDto) {
        const data = await this.accountsReceivableService.find(findDto);
        return {
            code: 200,
            msg: '查询成功',
            data
        }
    }
}