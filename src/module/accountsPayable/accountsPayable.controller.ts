import {Body, Controller, Post} from "@nestjs/common";
import {AccountsPayableService} from "./accountsPayable.service";
import {AccountsPayableFindDto} from "./dto/accountsPayableFind.dto";
import {AccountsPayableCreateDto} from "./dto/accountsPayableCreateDto";
import {ReqState} from "../../decorator/user.decorator";
import {IState} from "../../interface/IState";
import {AccountsPayableUpdateDto} from "./dto/accountsPayableUpdateDto";

@Controller('erp/accountsPayable')
export class AccountsPayableController {

    constructor(private readonly accountsPayableService: AccountsPayableService) {
    }

    @Post('find')
    public async find(@Body() findDto: AccountsPayableFindDto) {
        const data = await this.accountsPayableService.find(findDto);
        return {
            code: 200,
            msg: '查询成功',
            data
        }
    }

    @Post('create')
    public async create(@Body() createDto: AccountsPayableCreateDto, @ReqState() state: IState) {
        createDto.creater = state.user.username;
        createDto.createdAt = new Date();
        await this.accountsPayableService.create(createDto);
        return {
            code: 200,
            msg: '保存成功'
        }
    }

    @Post('update')
    public async update(@Body() updateDto: AccountsPayableUpdateDto, @ReqState() state: IState) {
        updateDto.updater = state.user.username;
        updateDto.updatedAt = new Date();
        await this.accountsPayableService.create(updateDto);
        return {
            code: 200,
            msg: '更新成功'
        }
    }
}