import {Body, Controller, Post} from "@nestjs/common";
import {ProductOtherUnitMxService} from "./productOtherUnitMx.service";
import {ProductOtherUnitMxFindDto} from "./dto/productOtherUnitMxFind.dto";
import {ProductOtherUnitMxCreateDto} from "./dto/productOtherUnitMxCreate.dto";
import {ProductOtherUnitMxDeleteDto} from "./dto/productOtherUnitMxDelete.dto";
import {IState, ReqState} from "../../decorator/user.decorator";

@Controller('erp/productOtherUnitMx')
export class ProductOtherUnitMxController {

    constructor(
        private readonly productOtherUnitMxService: ProductOtherUnitMxService
    ) {
    }

    @Post('find')
    public async find(@Body() findDto: ProductOtherUnitMxFindDto) {
        const data = await this.productOtherUnitMxService.find(findDto.productid);
        return {
            code: 200,
            msg: '查询成功',
            data
        }
    }

    @Post('create')
    public async create(@Body() createDto: ProductOtherUnitMxCreateDto,@ReqState() state:IState) {
        createDto.creater = state.user.username;
        createDto.createdAt = new Date();
        await this.productOtherUnitMxService.create(createDto);
        return {
            code: 200,
            msg: '保存成功'
        }
    }

    @Post('delete_data')
    public async delete_data(@Body() deleteDto: ProductOtherUnitMxDeleteDto) {
        await this.productOtherUnitMxService.delete_data(deleteDto.productid, deleteDto.productOtherUnitId);
        return {
            code: 200,
            msg: '删除成功'
        }
    }
}