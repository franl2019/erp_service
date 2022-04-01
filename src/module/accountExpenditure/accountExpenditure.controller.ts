import {Body, Controller, Post} from "@nestjs/common";
import {AccountExpenditureFindDto} from "./dto/accountExpenditureFind.dto";
import {ReqState} from "../../decorator/user.decorator";
import {IState} from "../../interface/IState";
import {AccountExpenditureService} from "./accountExpenditure.service";
import {AccountExpenditureCreateDto} from "./dto/accountExpenditureCreate.dto";
import {AccountExpenditureUpdateDto} from "./dto/accountExpenditureUpdate.dto";
import {AccountExpenditureL1ReviewDto} from "./dto/accountExpenditureL1Review.dto";
import {AccountExpenditureDeleteDto} from "./dto/accountExpenditureDelete.dto";

@Controller("erp/accountExpenditure")
export class AccountExpenditureController {

    constructor(
        private readonly accountExpenditureService: AccountExpenditureService
    ) {
    }

    @Post("find")
    public async find(@Body() accountExpenditureFindDto: AccountExpenditureFindDto, @ReqState() state: IState) {
        const data = await this.accountExpenditureService.find(accountExpenditureFindDto);
        return {
            code: 200,
            msg: "查询成功",
            data
        };
    }

    @Post("create")
    public async create(@Body() accountExpenditureCreateDto: AccountExpenditureCreateDto, @ReqState() state: IState) {
        accountExpenditureCreateDto.creater = state.user.username;
        accountExpenditureCreateDto.createdAt = new Date();
        await this.accountExpenditureService.create(accountExpenditureCreateDto);
        return {
            code: 200,
            msg: "保存成功"
        };
    }

    @Post("update")
    public async update(@Body() accountExpenditureUpdateDto: AccountExpenditureUpdateDto, @ReqState() state: IState) {
        accountExpenditureUpdateDto.updater = state.user.username;
        accountExpenditureUpdateDto.updatedAt = new Date();
        await this.accountExpenditureService.update(accountExpenditureUpdateDto);
        return {
            code: 200,
            msg: "保存成功"
        };
    }

    @Post("level1Review")
    public async level1Review(@Body() accountExpenditureL1ReviewDto: AccountExpenditureL1ReviewDto, @ReqState() state: IState) {
        await this.accountExpenditureService.level1Review(accountExpenditureL1ReviewDto.accountExpenditureId, state.user.username);
        return {
            code: 200,
            msg: "审核成功"
        };
    }

    @Post("unLevel1Review")
    public async unLevel1Review(@Body() accountExpenditureL1ReviewDto: AccountExpenditureL1ReviewDto) {
        await this.accountExpenditureService.unLevel1Review(accountExpenditureL1ReviewDto.accountExpenditureId);
        return {
            code: 200,
            msg: "撤审成功"
        };
    }

    @Post("deleteById")
    public async deleteById(@Body() deleteDto: AccountExpenditureDeleteDto) {
        await this.accountExpenditureService.deleteById(deleteDto.accountExpenditureId);
        return {
            code: 200,
            msg: "删除成功"
        };
    }
}