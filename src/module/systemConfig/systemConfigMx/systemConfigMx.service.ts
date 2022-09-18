import {Injectable} from "@nestjs/common";
import {SystemConfigMxEntity} from "./systemConfigMx.entity";
import {SystemConfigMxCreateDto} from "./dto/systemConfigMxCreate.dto";

@Injectable()
export class SystemConfigMxService {

    constructor(
        private readonly systemConfigMxEntity: SystemConfigMxEntity
    ) {
    }

    public async findOne(systemConfigHeadId: number, systemConfigOptionId: number) {
        return await this.systemConfigMxEntity.findOne(systemConfigHeadId, systemConfigOptionId);
    }

    public async create(systemConfigMxCreateDtoList:SystemConfigMxCreateDto[]){
        return await this.systemConfigMxEntity.create(systemConfigMxCreateDtoList)
    }
}