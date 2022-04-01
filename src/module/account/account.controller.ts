import {Body, Controller, Post} from "@nestjs/common";
import {AccountService} from "./account.service";
import {CreateAccountDto} from "./dto/createAccount.dto";
import {ReqState} from "../../decorator/user.decorator";
import {State} from "../../interface/IState";
import {DeleteAccountDto} from "./dto/deleteAccount.dto";
import {FindAccountDto} from "./dto/findAccount.dto";

@Controller('erp/account')
export class AccountController {

    constructor(private readonly accountService: AccountService) {
    }

    @Post('find')
    public async find(@Body() findAccountDto:FindAccountDto) {
        const data = await this.accountService.find(findAccountDto);
        return {
            code: 200,
            msg: '查询成功',
            data
        }
    }

    @Post('findAccountAuth')
    public async findAuthByUserId(@ReqState() state: State){
        const data = await this.accountService.findAuthByUserId(state.user.userid);
        return {
            code: 200,
            msg: '查询成功',
            data
        }
    }

    @Post('create')
    public async create(@Body() createDto: CreateAccountDto, @ReqState() state: State) {
        createDto.creater = state.user.username;
        createDto.createdAt = new Date();
        await this.accountService.create([createDto]);
        return {
            code: 200,
            msg: '保存成功'
        }
    }

    @Post('update')
    public async update(@Body() createDto: CreateAccountDto, @ReqState() state: State) {
        await this.accountService.update(createDto, state);
        return {
            code: 200,
            msg: '保存成功'
        }
    }

    @Post('delete_data')
    public async delete_data(@Body() deleteAccountDto: DeleteAccountDto, @ReqState() state: State) {
        await this.accountService.delete_data(deleteAccountDto.accountId, state);
        return {
            code: 200,
            msg: '删除成功'
        }
    }

    @Post('unDelete_data')
    public async unDelete_data(@Body() deleteAccountDto: DeleteAccountDto) {
        await this.accountService.unDelete_data(deleteAccountDto.accountId);
        return {
            code: 200,
            msg: '取消删除成功'
        }
    }
}