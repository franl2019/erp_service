import {Body, Controller, Post} from "@nestjs/common";
import {PermissionsService} from "./permissions/permissions.service";
import {PermissionsCreateDto} from "./permissions/dto/permissionsCreate.dto";
import {IState, ReqState} from "../../decorator/user.decorator";
import {PermissionsFindOneDto} from "./permissions/dto/permissionsFindOne.dto";
import {PermissionsFindAllDto} from "./permissions/dto/permissionsFindAll.dto";
import {PermissionsUpdateDto} from "./permissions/dto/permissionsUpdate.dto";
// import {PermissionsDeleteDto} from "./permissions/dto/permissionsDelete.dto";
import {PermissionsThemeService} from "./permissions_theme/permissionsTheme.service";
import {PermissionsThemeCreateDto} from "./permissions_theme/dto/permissionsThemeCreate.dto";
import {PermissionsThemeUpdateDto} from "./permissions_theme/dto/permissionsThemeUpdate.dto";
import {PermissionsThemeDeleteDto} from "./permissions_theme/dto/permissionsThemeDelete.dto";

@Controller('erp')
export class PermissionController {

    constructor(
        private readonly permissionsService: PermissionsService,
        private readonly permissionsThemeService: PermissionsThemeService
    ) {
    }

    @Post('permissions/findAll')
    public async findAllPermissions(@Body() findDto: PermissionsFindAllDto) {
        const data = await this.permissionsService.findAll(findDto);
        return {
            code: 200,
            msg: '查询成功',
            data
        }
    }


    @Post('permissions/findOne')
    public async findOnePermissions(@Body() permissions: PermissionsFindOneDto) {
        const data = await this.permissionsService.findOne(permissions.permissionsId);
        return {
            code: 200,
            msg: '查询成功',
            data
        }
    }

    @Post('permissions/create')
    public async createPermissions(@Body() permissions: PermissionsCreateDto, @ReqState() state: IState) {
        permissions.creater = state.user.username;
        permissions.createdAt = new Date();
        await this.permissionsService.create(permissions);
        return {
            code: 200,
            msg: '保存成功'
        }
    }

    @Post('permissions/update')
    public async updatePermissions(@Body() permissions: PermissionsUpdateDto, @ReqState() state: IState) {
        permissions.updater = state.user.username;
        permissions.updatedAt = new Date();
        await this.permissionsService.update(permissions);
        return {
            code: 200,
            msg: '更新成功'
        }
    }

    // @Post('permissions/delete_data')
    // public async deletePermissions(@Body() permissions: PermissionsDeleteDto, @ReqState() state: IState) {
    //     await this.permissionsService.delete_data(permissions.permissionsId, state.user.username);
    //     return {
    //         code: 200,
    //         msg: '删除成功'
    //     }
    // }

    @Post('permissionsTheme/findAll')
    public async findAllPermissionsTheme() {
        const data = await this.permissionsThemeService.findAll();
        return {
            code: 200,
            msg: '查询成功',
            data
        }
    }

    @Post('permissionsTheme/create')
    public async createPermissionsTheme(
        @Body() permissionsTheme: PermissionsThemeCreateDto,
        @ReqState() state: IState
    ) {
        permissionsTheme.creater = state.user.username;
        permissionsTheme.createdAt = new Date();
        await this.permissionsThemeService.create(permissionsTheme);
        return {
            code: 200,
            msg: '保存成功'
        }
    }

    @Post('permissionsTheme/update')
    public async updatePermissionsTheme(
        @Body() permissionsTheme: PermissionsThemeUpdateDto,
        @ReqState() state: IState
    ) {
        permissionsTheme.updater = state.user.username;
        permissionsTheme.updatedAt = new Date();
        await this.permissionsThemeService.update(permissionsTheme);
        return {
            code: 200,
            msg: '更新成功'
        }
    }

    @Post('permissionsTheme/delete_data')
    public async deletePermissionsTheme(
        @Body() permissionsTheme: PermissionsThemeDeleteDto,
        @ReqState() state: IState
    ) {
        await this.permissionsThemeService.delete_data(permissionsTheme.permissionsThemeId, state.user.username);
        return {
            code: 200,
            msg: '删除成功'
        }
    }


}