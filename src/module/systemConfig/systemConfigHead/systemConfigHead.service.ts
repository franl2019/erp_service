import {Injectable} from "@nestjs/common";
import {SystemConfigHeadEntity} from "./systemConfigHead.entity";
import {SystemConfigHeadCreateDto} from "./dto/systemConfigHeadCreate.dto";
import {SystemConfigHeadUpdateDto} from "./dto/systemConfigHeadUpdate.dto";

@Injectable()
export class SystemConfigHeadService {

    constructor(
        private readonly systemConfigHeadEntity:SystemConfigHeadEntity
    ) {
    }

    public async findAll(){
        return await this.systemConfigHeadEntity.findAll();
    }

    public async create(systemConfigHeadCreateDto:SystemConfigHeadCreateDto){
        return await this.systemConfigHeadEntity.create(systemConfigHeadCreateDto)
    }

    public async update(systemConfigHeadUpdateDto:SystemConfigHeadUpdateDto){
        return await this.systemConfigHeadEntity.update(systemConfigHeadUpdateDto)
    }

    public async delete_data(systemConfigHeadId:number,userName:string){
        return await this.systemConfigHeadEntity.delete_data(systemConfigHeadId, userName)
    }
}