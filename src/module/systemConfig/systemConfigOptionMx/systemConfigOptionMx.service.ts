import {Injectable} from "@nestjs/common";
import {SystemConfigOptionMxEntity} from "./systemConfigOptionMx.entity";
import {SystemConfigOptionMxDeleteDto} from "./dto/systemConfigOptionMxDelete.dto";
import {SystemConfigOptionMxCreateDto} from "./dto/systemConfigOptionMxCreate.dto";
import {SystemConfigOptionMxUpdateDto} from "./dto/systemConfigOptionMxUpdate.dto";

@Injectable()
export class SystemConfigOptionMxService {

    constructor(
        private readonly systemConfigOptionMxEntity:SystemConfigOptionMxEntity
    ) {
    }

    public async create(systemConfigOptionMx:SystemConfigOptionMxCreateDto){
        return await this.systemConfigOptionMxEntity.create(systemConfigOptionMx)
    }

    public async update(systemConfigOptionMx:SystemConfigOptionMxUpdateDto){
        return await this.systemConfigOptionMxEntity.update(systemConfigOptionMx)
    }

    public async delete_data(systemConfigOptionMxDeleteDto:SystemConfigOptionMxDeleteDto){
        return await this.systemConfigOptionMxEntity.delete_data(systemConfigOptionMxDeleteDto.systemConfigOptionMxId)
    }
}