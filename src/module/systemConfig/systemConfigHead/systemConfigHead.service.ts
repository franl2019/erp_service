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

    public async findOne(systemConfigHeadId:number){
        return await this.systemConfigHeadEntity.findById(systemConfigHeadId);
    }

    public async findAll(){
        return await this.systemConfigHeadEntity.findAll();
    }

    public async create(systemConfigHeadCreateDto:SystemConfigHeadCreateDto,username:string){
        return await this.systemConfigHeadEntity.create(systemConfigHeadCreateDto,username);
    }

    public async update(systemConfigHeadUpdateDto:SystemConfigHeadUpdateDto,username:string){
        return await this.systemConfigHeadEntity.update(systemConfigHeadUpdateDto,username)
    }

    public async delete_data(systemConfigHeadId:number,userName:string){
        return await this.systemConfigHeadEntity.delete_data(systemConfigHeadId, userName)
    }
}