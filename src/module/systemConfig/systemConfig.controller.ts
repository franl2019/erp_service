import {Body, Controller, Post} from "@nestjs/common";
import {SystemConfigService} from "./systemConfig.service";
import {SystemConfigHeadCreateDto} from "./systemConfigHead/dto/systemConfigHeadCreate.dto";
import {SystemConfigHeadUpdateDto} from "./systemConfigHead/dto/systemConfigHeadUpdate.dto";
import {SystemConfigHeadDeleteDto} from "./systemConfigHead/dto/systemConfigHeadDelete.dto";
import {IState, ReqState} from "../../decorator/user.decorator";
import {SystemConfigMxUpdateListDto} from "./systemConfigMx/dto/systemConfigMxUpdate.dto";
import {SystemConfigOptionCreateDto} from "./systemConfigOption/dto/systemConfigOptionCreate.dto";
import {SystemConfigOptionUpdateDto} from "./systemConfigOption/dto/systemConfigOptionUpdate.dto";
import {SystemConfigOptionMxCreateDto} from "./systemConfigOptionMx/dto/systemConfigOptionMxCreate.dto";
import {SystemConfigOptionMxUpdateDto} from "./systemConfigOptionMx/dto/systemConfigOptionMxUpdate.dto";

@Controller('erp/systemConfig')
export class SystemConfigController {

    constructor(
        private readonly systemConfigService: SystemConfigService
    ) {
    }

    @Post('createSystemConfig')
    public async createSystemConfig(@Body() systemConfigHead: SystemConfigHeadCreateDto, @ReqState() state: IState) {
        systemConfigHead.creater = state.user.username;
        systemConfigHead.createdAt = new Date();
        await this.systemConfigService.createSystemConfig(systemConfigHead);
        return {
            code: 200,
            msg: '保存成功,创建账套'
        }
    }

    @Post('updateSystemConfigHead')
    public async updateSystemConfigHead(@Body() systemConfigHead: SystemConfigHeadUpdateDto, @ReqState() state: IState) {
        systemConfigHead.updater = state.user.username;
        systemConfigHead.updatedAt = new Date();
        await this.systemConfigService.updateSystemConfigHead(systemConfigHead);
        return {
            code: 200,
            msg: '保存成功,更新账套头'
        }
    }

    @Post('deleteSystemConfig')
    public async deleteSystemConfig(
        @Body() systemConfigHeadDeleteDto: SystemConfigHeadDeleteDto,
        @ReqState() state: IState
    ) {
        await this.systemConfigService.deleteSystemConfigHead(systemConfigHeadDeleteDto.systemConfigHeadId, state.user.username);
        return {
            code: 200,
            msg: '删除成功,账套头'
        }
    }

    @Post('findUserSystemConfigMx')
    public async findSystemConfigMx(
        @ReqState() state: IState
    ) {
        const userSystemConfigMxList = await this.systemConfigService.findAllSystemConfigMx(state.user.systemConfigHeadId);
        return {
            code: 200,
            msg: '查询成功',
            data: userSystemConfigMxList,
        }
    }

    @Post('updateSystemConfigMx')
    public async updateSystemConfigMx(
        @Body() systemConfigMxUpdateListDto: SystemConfigMxUpdateListDto
    ) {
        await this.systemConfigService.updateSystemConfigMx(systemConfigMxUpdateListDto.systemConfigMxUpdateList);
        return {
            code: 200,
            msg: '更新成功,更新账套系统配置明细'
        }
    }

    @Post('createSystemConfigOption')
    public async createSystemConfigOption(
        @Body() systemConfigOption: SystemConfigOptionCreateDto,
        @ReqState() state: IState
    ) {
        systemConfigOption.creater = state.user.username;
        systemConfigOption.createdAt = new Date();
        await this.systemConfigService.createSystemConfigOption(systemConfigOption)
        return {
            code: 200,
            msg: '保存成功,创建账套系统配置项'
        }
    }

    @Post('updateSystemConfigOption')
    public async updateSystemConfigOption(
        @Body() systemConfigOption: SystemConfigOptionUpdateDto,
        @ReqState() state: IState
    ) {
        systemConfigOption.updater = state.user.username;
        systemConfigOption.updatedAt = new Date();
        await this.systemConfigService.updateSystemConfigOption(systemConfigOption);
        return {
            code: 200,
            msg: '更新成功,更新账套系统配置项'
        }
    }

    @Post('createSystemConfigOptionMx')
    public async createSystemConfigOptionMx(
        @Body() systemConfigOptionMx: SystemConfigOptionMxCreateDto
    ) {
        await this.systemConfigService.createSystemConfigOptionMx(systemConfigOptionMx);
        return {
            code: 200,
            msg: '保存成功,创建账套系统配置项选择'
        }
    }

    @Post('updateSystemConfigOptionMx')
    public async updateSystemConfigOptionMx(
        @Body() systemConfigOptionMx: SystemConfigOptionMxUpdateDto
    ) {
        await this.systemConfigService.updateSystemConfigOptionMx(systemConfigOptionMx);
        return {
            code: 200,
            msg: '更新成功,更新账套系统配置项选择'
        }
    }
}