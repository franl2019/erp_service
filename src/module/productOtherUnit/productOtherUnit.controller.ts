import {Body, Controller, Post} from "@nestjs/common";
import {ProductOtherUnitService} from "./productOtherUnit.service";
import {ProductOtherUnitFindDto} from "./dto/productOtherUnitFind.dto";
import {ProductOtherUnitCreateDto} from "./dto/productOtherUnitCreate.dto";
import {ProductOtherUnitUpdateDto} from "./dto/productOtherUnitUpdate.dto";
import {ProductOtherUnitDeleteDto} from "./dto/productOtherUnitDelete.dto";
import {IState, ReqState} from "../../decorator/user.decorator";

@Controller('erp/productOtherUnit')
export class ProductOtherUnitController {

    constructor(
        private readonly productOtherUnitService: ProductOtherUnitService
    ) {
    }

    @Post('find')
    public async find(@Body() findDto: ProductOtherUnitFindDto) {
        const data = await this.productOtherUnitService.find(findDto);
        return {
            code: 200,
            msg: '查询成功',
            data
        }
    }

    @Post('create')
    public async create(@Body() createDto: ProductOtherUnitCreateDto,@ReqState() state:IState) {
        createDto.creater = state.user.username;
        createDto.createdAt = new Date();

        await this.productOtherUnitService.create(createDto);
        return {
            code: 200,
            msg: '新增成功'
        }
    }

    @Post('update')
    public async update(@Body() updateDto: ProductOtherUnitUpdateDto,@ReqState() state:IState) {
        updateDto.updater = state.user.username;
        updateDto.updatedAt = new Date();

        await this.productOtherUnitService.update(updateDto);
        return {
            code: 200,
            msg: '更新成功'
        }
    }

    @Post('delete_data')
    public async delete_data(@Body() productOtherUnitDeleteDto: ProductOtherUnitDeleteDto,@ReqState() state:IState) {
        await this.productOtherUnitService.delete_data(productOtherUnitDeleteDto.productOtherUnitId,state.user.username);
        return {
            code: 200,
            msg: '删除成功'
        }
    }
}