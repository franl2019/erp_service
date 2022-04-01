import {Body, Controller, Post} from "@nestjs/common";
import {AccountExpenditureAmountMxFindDto} from "./dto/accountExpenditureAmountMxFind.dto";
import {AccountExpenditureAmountMxService} from "./accountExpenditureAmountMx.service";

@Controller('erp/accountExpenditureAmountMx')
export class AccountExpenditureAmountMxController {

    constructor(
        private readonly accountExpenditureAmountMxService:AccountExpenditureAmountMxService
    ) {
    }

    @Post('find')
    public async find(@Body() findDto:AccountExpenditureAmountMxFindDto){
       const data = await this.accountExpenditureAmountMxService.findById(findDto.accountExpenditureId);
       return {
           code:200,
           msg:'查询成功',
           data
       }
    }
}