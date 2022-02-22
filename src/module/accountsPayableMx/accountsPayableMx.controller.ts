import {Body, Controller, Post} from "@nestjs/common";
import {AccountsPayableMxService} from "./accountsPayableMx.service";
import {AccountsPayableFindDto} from "./dto/accountsPayableFind.dto";

@Controller('erp/accountsPayableMx')
export class AccountsPayableMxController {

    constructor(private readonly accountsPayableMxService:AccountsPayableMxService) {
    }

    @Post('find')
    public async find(@Body() accountsPayableFindDto:AccountsPayableFindDto){
        const data = await this.accountsPayableMxService.find(accountsPayableFindDto);
        return {
            code:200,
            msg:'查询成功',
            data
        }
    }
}