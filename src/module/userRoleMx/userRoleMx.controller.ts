import {Body, Controller, Post} from "@nestjs/common";
import {UserRoleMxService} from "./userRoleMx.service";
import {UserRoleMxFindAllDto} from "./dto/userRoleMxFindAll.dto";
import {UserRoleMxFindOneDto} from "./dto/userRoleMxFindOne.dto";
import {UserRoleMxCreateDto} from "./dto/userRoleMxCreate.dto";
import {IState, ReqState} from "../../decorator/user.decorator";
import {UserRoleMxDeleteDto} from "./dto/userRoleMxDelete.dto";

@Controller('erp/userRoleMx')
export class UserRoleMxController {

    constructor(
        private readonly userRoleMxService:UserRoleMxService
    ) {
    }

    @Post('findAll')
    public async findAll(@Body() userRoleMxFindAllDto:UserRoleMxFindAllDto){
        const data = await this.userRoleMxService.findByRoleId(userRoleMxFindAllDto.roleId);
        return {
            code:200,
            msg:'查询成功',
            data
        }
    }

    @Post('findOne')
    public async findOne(@Body() userRoleMxFindOneDto:UserRoleMxFindOneDto){
        const data = await this.userRoleMxService.findOne(userRoleMxFindOneDto);
        return {
            code:200,
            msg:'查询成功',
            data
        }
    }

    @Post('create')
    public async create(@Body() userRoleMxCreateDto:UserRoleMxCreateDto,@ReqState() state:IState){
        userRoleMxCreateDto.creater = state.user.username;
        userRoleMxCreateDto.createdAt = new Date();
        await this.userRoleMxService.create(userRoleMxCreateDto);
        return {
            code:200,
            msg:'保存成功'
        }
    }

    @Post('delete_data')
    public async delete_data(@Body() userRoleMxDeleteDto:UserRoleMxDeleteDto){
        await this.userRoleMxService.delete_data(userRoleMxDeleteDto);
        return {
            code:200,
            msg:'删除成功'
        }
    }
}