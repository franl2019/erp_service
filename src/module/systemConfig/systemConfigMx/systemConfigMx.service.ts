import {Injectable} from "@nestjs/common";
import {SystemConfigMxEntity} from "./systemConfigMx.entity";
import {SystemConfigMxCreateDto} from "./dto/systemConfigMxCreate.dto";
import {SystemConfigMxUpdateDto} from "./dto/systemConfigMxUpdate.dto";

@Injectable()
export class SystemConfigMxService {

    constructor(
        private readonly systemConfigMxEntity: SystemConfigMxEntity
    ) {
    }

    public async findOne(systemConfigHeadId: number, systemConfigOptionId: number) {
        return await this.systemConfigMxEntity.findOne(systemConfigHeadId, systemConfigOptionId);
    }

    public async findAll(systemConfigHeadId: number) {
        return await this.systemConfigMxEntity.findAll(systemConfigHeadId);
    }

    public async create(systemConfigMxCreateDtoList:SystemConfigMxCreateDto[]){
        return await this.systemConfigMxEntity.create(systemConfigMxCreateDtoList)
    }

    public async update(systemConfigMx:SystemConfigMxUpdateDto){
        return await this.systemConfigMxEntity.update(systemConfigMx);
    }
}