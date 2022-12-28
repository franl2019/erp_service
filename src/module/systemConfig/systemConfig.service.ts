import {Injectable} from "@nestjs/common";
import {SystemConfigOptionService} from "./systemConfigOption/systemConfigOption.service";
import {SystemConfigOptionCreateDto} from "./systemConfigOption/dto/systemConfigOptionCreate.dto";
import {SystemConfigHeadService} from "./systemConfigHead/systemConfigHead.service";
import {SystemConfigMxService} from "./systemConfigMx/systemConfigMx.service";
import {SystemConfigMxCreateDto} from "./systemConfigMx/dto/systemConfigMxCreate.dto";
import {SystemConfigOptionUpdateDto} from "./systemConfigOption/dto/systemConfigOptionUpdate.dto";
import {SystemConfigHeadCreateDto} from "./systemConfigHead/dto/systemConfigHeadCreate.dto";
import {SystemConfigHeadUpdateDto} from "./systemConfigHead/dto/systemConfigHeadUpdate.dto";
import {SystemConfigOptionMxCreateDto} from "./systemConfigOptionMx/dto/systemConfigOptionMxCreate.dto";
import {SystemConfigOptionMxService} from "./systemConfigOptionMx/systemConfigOptionMx.service";
import {SystemConfigOptionMxUpdateDto} from "./systemConfigOptionMx/dto/systemConfigOptionMxUpdate.dto";
import {SystemConfigMxUpdateDto} from "./systemConfigMx/dto/systemConfigMxUpdate.dto";
import {useVerifyParam} from "../../utils/verifyParam/useVerifyParam";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {ISystemConfigMx} from "./systemConfigMx/systemConfigMx";
import {SystemConfigOptionDeleteDto} from "./systemConfigOption/dto/systemConfigOptionDelete.dto";

@Injectable()
export class SystemConfigService {

    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly systemConfigHeadService: SystemConfigHeadService,
        private readonly systemConfigMxService: SystemConfigMxService,
        private readonly systemConfigOptionService: SystemConfigOptionService,
        private readonly systemConfigOptionMxService: SystemConfigOptionMxService
    ) {
    }

    public async getSystemConfigHead(systemConfigHeadId: number) {
        return await this.systemConfigHeadService.findOne(systemConfigHeadId);
    }

    //创建账套头
    public async createSystemConfig(systemConfigHead: SystemConfigHeadCreateDto,username:string) {
        return await this.mysqldbAls.sqlTransaction(async () => {
            //创建账套单头
            const createResult = await this.systemConfigHeadService.create(systemConfigHead,username);
            systemConfigHead.systemConfigHeadId = createResult.insertId;

            //查找现有账套资料
            const existingSystemConfigOptionList = await this.systemConfigOptionService.findAll();

            //创建账套配置明细
            const systemConfigMxCreateDtoList = []

            for (let i = 0; i < existingSystemConfigOptionList.length; i++) {
                const systemConfigOption = existingSystemConfigOptionList[i]
                const systemConfigMxCreateDto = new SystemConfigMxCreateDto();
                systemConfigMxCreateDto.systemConfigHeadId = systemConfigHead.systemConfigHeadId;
                systemConfigMxCreateDto.systemConfigOptionId = systemConfigOption.systemConfigOptionId;
                systemConfigMxCreateDto.systemConfigOptionMxId = 1;
                systemConfigMxCreateDto.updater = username;
                systemConfigMxCreateDto.updatedAt = new Date();

                systemConfigMxCreateDtoList.push(systemConfigMxCreateDto);
            }

            await this.systemConfigMxService.create(systemConfigMxCreateDtoList)

            return createResult
        })
    }

    //更新账套头
    public async updateSystemConfigHead(systemConfigHead: SystemConfigHeadUpdateDto,username:string) {
        return await this.systemConfigHeadService.update(systemConfigHead,username);
    }

    //删除账套头
    public async deleteSystemConfigHead(systemConfigHeadId: number, userName: string) {
        return await this.systemConfigHeadService.delete_data(systemConfigHeadId, userName);
    }

    public async findAllSystemConfigMx(systemConfigHeadId: number) {
        return await this.systemConfigMxService.findAll(systemConfigHeadId);
    }

    public async findOneSystemConfigMx(systemConfigHeadId: number, systemConfigOptionId: number) {
        return await this.systemConfigMxService.findOne(systemConfigHeadId, systemConfigOptionId)
    }

    public async can(systemConfigHeadId: number, systemConfigOptionId: number, systemConfigOptionMxId: number) {
        const systemConfigMx = await this.findOneSystemConfigMx(systemConfigHeadId, systemConfigOptionId);
        return systemConfigMx.systemConfigOptionMxId === systemConfigOptionMxId
    }

    public async verifySystemConfigMxUpdateDto(systemConfigMxList: SystemConfigMxUpdateDto[], username: string): Promise<ISystemConfigMx[]> {
        const systemConfigMxList_successVerify: ISystemConfigMx[] = [];
        const updatedAt: Date = new Date();
        for (let i = 0; i < systemConfigMxList.length; i++) {
            const systemConfigMx = systemConfigMxList[i];
            const systemConfigMxUpdateDto = new SystemConfigMxUpdateDto({
                systemConfigHeadId: systemConfigMx.systemConfigHeadId,
                systemConfigOptionId: systemConfigMx.systemConfigOptionId,
                systemConfigOptionMxId: systemConfigMx.systemConfigOptionMxId,
                updatedAt: updatedAt,
                updater: username

            });
            await useVerifyParam(systemConfigMxUpdateDto);
            systemConfigMxList_successVerify.push(systemConfigMxUpdateDto);
        }

        return systemConfigMxList_successVerify
    }

    //更新账套明细
    public async updateSystemConfigMx(systemConfigMxList: SystemConfigMxUpdateDto[], username: string) {
        const systemConfigMxList_successVerify = await this.verifySystemConfigMxUpdateDto(systemConfigMxList, username);
        await this.mysqldbAls.sqlTransaction(async () => {
            for (let i = 0; i < systemConfigMxList_successVerify.length; i++) {
                const systemConfigMx = systemConfigMxList_successVerify[i];
                await this.systemConfigMxService.update(systemConfigMx);
            }
        })
        return true
    }

    //创建账套配置项
    public async createSystemConfigOption(systemConfigOption: SystemConfigOptionCreateDto) {
        return await this.mysqldbAls.sqlTransaction(async () => {
            //创建账套配置选项
            const createResult = await this.systemConfigOptionService.create(systemConfigOption);
            systemConfigOption.systemConfigOptionId = createResult.insertId;

            //给现有账套添加新配置项

            //查找现有账套
            const existingAllSystemConfigHeadList = await this.systemConfigHeadService.findAll();
            for (let i = 0; i < existingAllSystemConfigHeadList.length; i++) {
                const systemConfigHead = existingAllSystemConfigHeadList[i];
                //查找该账套下,有没有刚刚创建的配置选项id
                const systemConfigMx = await this.systemConfigMxService.findOne(systemConfigHead.systemConfigHeadId, systemConfigOption.systemConfigOptionId);

                //如果有就报错
                if (
                    systemConfigMx.systemConfigHeadId === systemConfigHead.systemConfigHeadId
                    && systemConfigMx.systemConfigOptionId === systemConfigOption.systemConfigOptionId
                ) {
                    return Promise.reject(new Error('创建账套配置选项,与现有账套配置明细冲突,请检查id'))
                }

                //为现有账套创建配置明细
                const systemConfigMxCreateDto = new SystemConfigMxCreateDto();
                systemConfigMxCreateDto.systemConfigHeadId = systemConfigHead.systemConfigHeadId;
                systemConfigMxCreateDto.systemConfigOptionId = systemConfigOption.systemConfigOptionId;
                systemConfigMxCreateDto.systemConfigOptionMxId = 1;
                systemConfigMxCreateDto.updater = systemConfigOption.updater;
                systemConfigMxCreateDto.updatedAt = systemConfigOption.updatedAt;
                await this.systemConfigMxService.create([systemConfigMxCreateDto])
            }

            return createResult
        })
    }

    //更新账套配置项
    public async updateSystemConfigOption(systemConfigOption: SystemConfigOptionUpdateDto,username:string) {
        //更新账套配置项
        return await this.systemConfigOptionService.update(systemConfigOption,username);
    }

    //删除账套配置项
    public async deleteSystemConfigOption(systemConfigOption: SystemConfigOptionDeleteDto,username:string) {
        return await this.systemConfigOptionService.delete_data(systemConfigOption,username);
    }

    //创建账套配置项的选项
    public async createSystemConfigOptionMx(systemConfigOptionMx: SystemConfigOptionMxCreateDto) {
        return await this.systemConfigOptionMxService.create(systemConfigOptionMx);
    }

    //更新账套配置项的选项
    public async updateSystemConfigOptionMx(systemConfigOptionMx: SystemConfigOptionMxUpdateDto) {
        return await this.systemConfigOptionMxService.update(systemConfigOptionMx);
    }
}