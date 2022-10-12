import {Injectable} from "@nestjs/common";
import {SystemConfigOptionEntity} from "./systemConfigOption.entity";
import {SystemConfigOptionCreateDto} from "./dto/systemConfigOptionCreate.dto";
import {SystemConfigOptionUpdateDto} from "./dto/systemConfigOptionUpdate.dto";
import {SystemConfigOptionDeleteDto} from "./dto/systemConfigOptionDelete.dto";

@Injectable()
export class SystemConfigOptionService {

    constructor(
        private readonly systemConfigOptionEntity:SystemConfigOptionEntity
    ) {
    }

    public async findAll(){
        return await this.systemConfigOptionEntity.findAll();
    }

    public async create(systemConfigOption:SystemConfigOptionCreateDto){
        return await this.systemConfigOptionEntity.create(systemConfigOption);
    }

    public async update(systemConfigOption:SystemConfigOptionUpdateDto,username:string){
        return await this.systemConfigOptionEntity.update(systemConfigOption,username);
    }

    public async delete_data(systemConfigOption:SystemConfigOptionDeleteDto,username:string){
        return await this.systemConfigOptionEntity.delete_data(systemConfigOption,username)
    }
}