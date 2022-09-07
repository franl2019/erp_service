import {Body, Controller, Post} from "@nestjs/common";
import {ProductOtherUnitMxService} from "./productOtherUnitMx.service";
import {ProductOtherUnitMxFindDto} from "./dto/productOtherUnitMxFind.dto";

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

    // @Post('create')
    // public async create(@Body() createDto: ProductOtherUnitMxCreateDto,@ReqState() state:IState) {
    //     createDto.creater = state.user.username;
    //     createDto.createdAt = new Date();
    //     await this.productOtherUnitMxService.create(createDto);
    //     return {
    //         code: 200,
    //         msg: '保存成功'
    //     }
    // }
}