import {Body, Controller, Post} from "@nestjs/common";
import {AccountsVerifySheetFindDto} from "./dto/accountsVerifySheetFind.dto";
import {AccountsVerifySheetService} from "./accountsVerifySheet.service";
import {AccountsVerifySheetCreateDto} from "./dto/accountsVerifySheetCreate.dto";
import {AccountsVerifySheetUpdateDto} from "./dto/accountsVerifySheetUpdate.dto";
import {AccountsVerifySheetDeleteDto} from "./dto/accountsVerifySheetDelete.dto";
import {ReqState} from "../../decorator/user.decorator";
import {IState} from "../../interface/IState";
import {AccountsVerifySheetL1ReviewDto} from "./dto/accountsVerifySheetL1Review.dto";

@Controller('erp/accountsVerifySheet')
export class AccountsVerifySheetController {

    constructor(private readonly accountsVerifySheetService: AccountsVerifySheetService) {
    }

    @Post('find')
    public async find(@Body() findDto: AccountsVerifySheetFindDto) {
        const data = await this.accountsVerifySheetService.find(findDto);
        return {
            code: 200,
            msg: '查询成功',
            data
        }
    }

    @Post('findAccountsVerifySheetState')
    public async findAccountsVerifySheetState(@Body() findDto: AccountsVerifySheetFindDto){
        const sheetCompleteState = await this.accountsVerifySheetService.findAccountsVerifySheetState(findDto);
        return {
            code: 200,
            msg: '查询成功',
            sheetCompleteState
        }
    }

    @Post('create')
    public async create(@Body() createDto: AccountsVerifySheetCreateDto, @ReqState() state: IState) {
        createDto.creater = state.user.username;
        createDto.createdAt = new Date();
        const createResult = await this.accountsVerifySheetService.create(createDto);
        return {
            code: 200,
            msg: '保存成功',
            createResult
        }
    }

    @Post('create_l1Review')
    public async create_l1Review(@Body() createDto: AccountsVerifySheetCreateDto, @ReqState() state: IState) {
        createDto.creater = state.user.username;
        createDto.createdAt = new Date();
        const createResult = await this.accountsVerifySheetService.create_l1Review(createDto);
        return {
            code: 200,
            msg: '保存审核成功',
            createResult
        }
    }

    @Post('update')
    public async update(@Body() updateDto: AccountsVerifySheetUpdateDto, @ReqState() state: IState) {
        updateDto.updater = state.user.username;
        updateDto.updatedAt = new Date();
        await this.accountsVerifySheetService.update(updateDto);
        return {
            code: 200,
            msg: '更新成功'
        }
    }

    @Post('delete_data')
    public async delete_data(@Body() deleteDto: AccountsVerifySheetDeleteDto, @ReqState() state: IState) {
        await this.accountsVerifySheetService.delete_data(deleteDto.accountsVerifySheetId, state.user.username);
        return {
            code: 200,
            msg: '删除成功'
        }
    }

    @Post('level1Review')
    public async level1Review(@Body() l1ReviewDto: AccountsVerifySheetL1ReviewDto, @ReqState() state: IState) {
        await this.accountsVerifySheetService.level1Review(l1ReviewDto.accountsVerifySheetId, state.user.username);
        return {
            code: 200,
            msg: '审核成功'
        }
    }

    @Post('unLevel1Review')
    public async unLevel1Review(@Body() l1ReviewDto: AccountsVerifySheetL1ReviewDto) {
        await this.accountsVerifySheetService.unLevel1Review(l1ReviewDto.accountsVerifySheetId);
        return {
            code: 200,
            msg: '撤审成功'
        }
    }
}