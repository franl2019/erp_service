import {Body, Controller, Post} from "@nestjs/common";
import {RoleService} from "./role/role.service";
import {RolePermissionsMxService} from "./rolePermissionsMx/rolePermissionsMx.service";
import {RoleCreateDto} from "./role/dto/roleCreate.dto";
import {IState, ReqState} from "../../decorator/user.decorator";
import {RoleUpdateDto} from "./role/dto/roleUpdate.dto";
import {RoleDeleteDto} from "./role/dto/roleDelete.dto";
import {RolePermissionsMxBatchCreateDto} from "./rolePermissionsMx/dto/rolePermissionsMxBatchCreate.dto";
import {RolePermissionsMxDeleteDto} from "./rolePermissionsMx/dto/rolePermissionsMxDelete.dto";

@Controller('erp')
export class RoleController {

    constructor(
        private readonly roleService: RoleService,
        private readonly rolePermissionsMxService: RolePermissionsMxService
    ) {
    }

    @Post('role/findAll')
    public async roleFindAll() {
        const data = await this.roleService.findAll();
        return {
            code: 200,
            msg: '查询成功',
            data
        }
    }

    @Post('role/create')
    public async roleCreate(@Body() roleCreateDto: RoleCreateDto, @ReqState() state: IState) {
        roleCreateDto.creater = state.user.username;
        roleCreateDto.createdAt = new Date();
        roleCreateDto.useflagDate = new Date();
        await this.roleService.create(roleCreateDto)
        return {
            code: 200,
            msg: '保存成功'
        }
    }

    @Post('role/update')
    public async roleUpdate(@Body() roleUpdateDto: RoleUpdateDto, @ReqState() state: IState) {
        roleUpdateDto.updater = state.user.username;
        roleUpdateDto.updatedAt = new Date();
        await this.roleService.update(roleUpdateDto)
        return {
            code: 200,
            msg: '更新成功'
        }
    }

    @Post('role/delete_data')
    public async roleDelete(@Body() roleDeleteDto: RoleDeleteDto, @ReqState() state: IState) {
        await this.roleService.delete_data(roleDeleteDto.roleId, state.user.username);
        return {
            code: 200,
            msg: '删除成功'
        }
    }

    @Post('rolePermissionsMx/create')
    public async rolePermissionsMxCreate(
        @Body() rolePermissionsMxBatchCreateDto: RolePermissionsMxBatchCreateDto,
        @ReqState() state: IState
    ) {
        await this.rolePermissionsMxService.createBatch(rolePermissionsMxBatchCreateDto, state);
        return {
            code: 200,
            msg: '保存成功'
        }
    }

    @Post('rolePermissionsMx/deleter')
    public async rolePermissionsMxDelete(
        @Body() rolePermissionsMxBatchDeleterDto: RolePermissionsMxDeleteDto
    ) {
        await this.rolePermissionsMxService.delete_data(rolePermissionsMxBatchDeleterDto);
        return {
            code: 200,
            msg: '删除成功'
        }
    }

}