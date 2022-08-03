import {Body, Controller, Post} from "@nestjs/common";
import {AccountRecordService} from "./accountRecord.service";
import {AccountRecordFindDto} from "./dto/accountRecordFind.dto";
import {IState, ReqState} from "../../decorator/user.decorator";

@Controller("erp/accountsRecord")
export class AccountRecordController {

    constructor(
        private readonly accountRecordService: AccountRecordService
    ) {
    }

    @Post("find")
    public async find(@Body() accountRecordFindDto: AccountRecordFindDto, @ReqState() state: IState) {
        const data = await this.accountRecordService.find(accountRecordFindDto);
        return {
            code: 200,
            msg: "查询成功",
            data
        };
    }
}