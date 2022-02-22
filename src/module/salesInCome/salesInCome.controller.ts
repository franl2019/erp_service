import {Body, Controller, Post} from "@nestjs/common";
import {SalesInComeFindDto} from "./dto/salesInComeFind.dto";
import {ReqState} from "../../decorator/user.decorator";
import {IState} from "../../interface/IState";
import {SalesInComeService} from "./salesInCome.service";
import {SalesInComeCreateDto} from "./dto/salesInComeCreate.dto";
import {SalesInComeUpdateDto} from "./dto/salesInComeUpdate.dto";
import {SalesInComeDeleteDto} from "./dto/salesInComeDelete.dto";

@Controller('erp/salesInCome')
export class SalesInComeController {

    constructor(private readonly salesInComeService: SalesInComeService) {
    }

    @Post('find')
    public async find(@Body() salesInComeFindDto: SalesInComeFindDto, @ReqState() state: IState) {
        salesInComeFindDto.accountIds = state.user.accountIds;
        const data = await this.salesInComeService.find(salesInComeFindDto);
        return {
            code: 200,
            msg: '查询成功',
            data
        }
    }

    @Post('create')
    public async create(@Body() salesInComeCreateDto: SalesInComeCreateDto, @ReqState() state: IState) {
        salesInComeCreateDto.createdAt = new Date();
        salesInComeCreateDto.creater = state.user.username;
        await this.salesInComeService.create(salesInComeCreateDto);
        return {
            code: 200,
            msg: '保存成功'
        }
    }

    @Post('update')
    public async update(@Body() salesInComeUpdateDto: SalesInComeUpdateDto, @ReqState() state: IState) {
        salesInComeUpdateDto.updatedAt = new Date();
        salesInComeUpdateDto.updater = state.user.username;
        await this.salesInComeService.create(salesInComeUpdateDto);
        return {
            code: 200,
            msg: '更新成功'
        }
    }

    @Post('delete_data')
    public async delete_data(@Body() salesInComeDeleteDto: SalesInComeDeleteDto, @ReqState() state: IState) {
        await this.salesInComeService.delete_data(salesInComeDeleteDto.salesInComeId, state.user.username);
        return {
            code: 200,
            msg: '更新成功'
        }
    }
}