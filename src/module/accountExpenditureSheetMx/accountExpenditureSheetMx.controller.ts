import {Body, Controller, Post} from "@nestjs/common";
import {AccountExpenditureSheetMxService} from "./accountExpenditureSheetMx.service";
import {AccountExpenditureSheetMxFindDto} from "./dto/accountExpenditureSheetMxFind.dto";

@Controller('erp/accountExpenditureSheetMx')
export class AccountExpenditureSheetMxController {

    constructor(
        private readonly accountExpenditureSheetMxService:AccountExpenditureSheetMxService
    ) {
    }

    @Post('find')
    public async find(@Body() findDto:AccountExpenditureSheetMxFindDto){
        const data = await this.accountExpenditureSheetMxService.findById(findDto.accountExpenditureId);
        return {
            code:200,
            msg:'查询成功',
            data
        }
    }
}