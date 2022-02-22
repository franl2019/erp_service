import {Body, Controller, Post} from "@nestjs/common";
import {AccountsReceivableMxService} from "./accountsReceivableMx.service";
import {AccountsReceivableFindDto} from "./dto/accountsReceivableFind.dto";

@Controller('erp/accountsReceivableMx')
export class AccountsReceivableMxController {

    constructor(private readonly accountsReceivableMxService:AccountsReceivableMxService) {
    }

    @Post('find')
    public async find(@Body() accountsReceivableFindDto:AccountsReceivableFindDto){
        const data = await this.accountsReceivableMxService.find(accountsReceivableFindDto);
        return {
            code:200,
            msg:'查询成功',
            data
        }
    }
}