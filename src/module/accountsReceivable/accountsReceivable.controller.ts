import {Body, Controller, Post} from "@nestjs/common";
import {AccountsReceivableService} from "./accountsReceivable.service";
import {AccountsReceivableFindDto} from "./dto/accountsReceivableFind.dto";
import {AccountsReceivableCreateDto} from "./dto/accountsReceivableCreate.dto";
import {ReqState} from "../../decorator/user.decorator";
import {IState} from "../../interface/IState";
import {AccountsReceivableUpdateDto} from "./dto/accountsReceivableUpdate.dto";

@Controller('erp/accountsReceivable')
export class AccountsReceivableController {

    constructor(private readonly accountsReceivableService: AccountsReceivableService) {
    }

    @Post('find')
    public async find(@Body() findDto: AccountsReceivableFindDto) {
        const data = await this.accountsReceivableService.find(findDto);
        return {
            code: 200,
            msg: '查询成功',
            data
        }
    }

    @Post('create')
    public async create(@Body() createDto: AccountsReceivableCreateDto, @ReqState() state: IState) {
        createDto.creater = state.user.username;
        createDto.createdAt = new Date();
        await this.accountsReceivableService.create(createDto);
        return {
            code: 200,
            msg: '保存成功'
        }
    }

    @Post('update')
    public async update(@Body() updateDto: AccountsReceivableUpdateDto, @ReqState() state: IState) {
        updateDto.updater = state.user.username;
        updateDto.updatedAt = new Date();
        await this.accountsReceivableService.create(updateDto);
        return {
            code: 200,
            msg: '更新成功'
        }
    }
}