import {Body, Controller, Post} from "@nestjs/common";
import {AccountInComeFindDto} from "./dto/accountInComeFind.dto";
import {ReqState} from "../../decorator/user.decorator";
import {IState} from "../../interface/IState";
import {AccountInComeService} from "./accountInCome.service";
import {AccountInComeCreateDto} from "./dto/accountInComeCreate.dto";
import {AccountInComeUpdateDto} from "./dto/accountInComeUpdate.dto";
import {AccountInComeDeleteDto} from "./dto/accountInComeDelete.dto";
import {AccountInComeLevel1ReviewDto} from "./dto/accountInComeLevel1Review.dto";

@Controller("erp/accountInCome")
export class AccountInComeController {
    constructor(private readonly accountInComeService: AccountInComeService) {
    }

    @Post('find')
    public async find(@Body() accountInComeFindDto: AccountInComeFindDto) {
        const data = await this.accountInComeService.find(accountInComeFindDto);
        return {
            code: 200,
            msg: "查询成功",
            data
        }
    }

    @Post('create')
    public async create(@Body() accountInComeCreateDto: AccountInComeCreateDto, @ReqState() state: IState) {
        accountInComeCreateDto.creater = state.user.username;
        accountInComeCreateDto.createdAt = new Date();
        await this.accountInComeService.create(accountInComeCreateDto);
        return {
            code: 200,
            msg: "保存成功"
        }
    }

    @Post('update')
    public async update(@Body() accountInComeUpdateDto: AccountInComeUpdateDto, @ReqState() state: IState) {
        accountInComeUpdateDto.updater = state.user.username;
        accountInComeUpdateDto.updatedAt = new Date();
        await this.accountInComeService.update(accountInComeUpdateDto);
        return {
            code: 200,
            msg: "保存成功"
        }
    }

    @Post('delete_data')
    public async delete_data(@Body() accountInComeDeleteDto: AccountInComeDeleteDto, @ReqState() state: IState) {
        await this.accountInComeService.delete_data(accountInComeDeleteDto.accountIncomeId, state.user.username);
        return {
            code: 200,
            msg: "删除成功"
        }
    }

    @Post('level1Review')
    public async level1Review(@Body() accountInCome: AccountInComeLevel1ReviewDto, @ReqState() state: IState) {
        await this.accountInComeService.level1Review(accountInCome.accountIncomeId, state.user.username);
        return {
            code: 200,
            msg: "审核成功"
        }
    }

    @Post('unLevel1Review')
    public async unLevel1Review(@Body() accountInCome: AccountInComeLevel1ReviewDto) {
        await this.accountInComeService.unLevel1Review(accountInCome.accountIncomeId);
        return {
            code: 200,
            msg: "撤审成功"
        }
    }
}