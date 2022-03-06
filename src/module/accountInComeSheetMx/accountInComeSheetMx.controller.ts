import {Controller} from "@nestjs/common";
import {AccountInComeSheetMxService} from "./accountInComeSheetMx.service";
import {AccountInComeAmountFindDto} from "./dto/accountInComeAmountFind.dto";

@Controller('erp/accountInComeSheetMx')
export class AccountInComeSheetMxController {

    constructor(
        private readonly accountInComeSheetMxService: AccountInComeSheetMxService
    ) {
    }

    public async find(accountInComeAmountFindDto: AccountInComeAmountFindDto) {
        const data = await this.accountInComeSheetMxService.find(accountInComeAmountFindDto.accountInComeAmountId);
        return {
            code: 200,
            msg: '查询成功',
            data
        }
    }

}