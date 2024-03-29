import {Body, Controller, Post} from "@nestjs/common";
import {AccountsVerifySheetMxService} from "./accountsVerifySheetMx.service";
import {AccountsVerifySheetMxFindDto} from "./dto/accountsVerifySheetMxFind.dto";

@Controller('erp/accountsVerifySheetMx')
export class AccountsVerifySheetMxController {

    constructor(private readonly accountsVerifySheetMxService: AccountsVerifySheetMxService) {
    }

    @Post('find')
    public async find(@Body() accountsVerifySheetMxFindDto: AccountsVerifySheetMxFindDto) {
        const data = await this.accountsVerifySheetMxService.find(accountsVerifySheetMxFindDto);
        return {
            code: 200,
            msg: "查询成功",
            data
        }
    }
}