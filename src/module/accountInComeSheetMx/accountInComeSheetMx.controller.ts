import {Body, Controller, Post} from "@nestjs/common";
import {AccountInComeSheetMxService} from "./accountInComeSheetMx.service";
import {AccountInComeSheetMxFindDto} from "./dto/accountInComeSheetMxFind.dto";

@Controller('erp/accountInComeSheetMx')
export class AccountInComeSheetMxController {

    constructor(
        private readonly accountInComeSheetMxService: AccountInComeSheetMxService
    ) {
    }

    @Post('find')
    public async find(@Body() accountInComeSheetMxFindDto: AccountInComeSheetMxFindDto) {
        const data = await this.accountInComeSheetMxService.findById(accountInComeSheetMxFindDto.accountInComeId);
        return {
            code: 200,
            msg: '查询成功',
            data
        }
    }

}