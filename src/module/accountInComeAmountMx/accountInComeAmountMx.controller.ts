import {Body, Controller, Post} from "@nestjs/common";
import {AccountInComeAmountMxFindDto} from "./dto/accountInComeAmountMxFind.dto";
import {AccountInComeAmountMxService} from "./accountInComeAmountMx.service";

@Controller('erp/accountInComeAmountMx')
export class AccountInComeAmountMxController {

    constructor(
        private readonly accountInComeAmountMxService:AccountInComeAmountMxService
    ) {
    }

    @Post('find')
    public async find(@Body() accountInComeAmountMxFindDto:AccountInComeAmountMxFindDto){
        const data = await this.accountInComeAmountMxService.find(accountInComeAmountMxFindDto.accountInComeAmountId);
        return {
            code:200,
            msg:'查询成功',
            data
        }
    }
}