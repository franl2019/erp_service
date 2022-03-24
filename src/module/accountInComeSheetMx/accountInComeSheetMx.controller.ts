import {Controller} from "@nestjs/common";
import {AccountInComeSheetMxService} from "./accountInComeSheetMx.service";
import {AccountInComeSheetMxFindDto} from "./dto/accountInComeSheetMxFind.dto";

@Controller('erp/accountInComeSheetMx')
export class AccountInComeSheetMxController {

    constructor(
        private readonly accountInComeSheetMxService: AccountInComeSheetMxService
    ) {
    }

    public async find(accountInComeAmountFindDto: AccountInComeSheetMxFindDto) {
        const data = await this.accountInComeSheetMxService.findById(accountInComeAmountFindDto.accountInComeId);
        return {
            code: 200,
            msg: '查询成功',
            data
        }
    }

}