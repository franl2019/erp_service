import {Body, Controller, Post} from "@nestjs/common";
import {AccountsPayableService} from "./accountsPayable.service";
import {AccountsPayableFindDto} from "./dto/accountsPayableFind.dto";

@Controller('erp/accountsPayable')
export class AccountsPayableController {

    constructor(private readonly accountsPayableService: AccountsPayableService) {
    }

    @Post('find')
    public async find(@Body() findDto: AccountsPayableFindDto) {
        const data = await this.accountsPayableService.find(findDto);
        return {
            code: 200,
            msg: '查询成功',
            data
        }
    }
}