import {Injectable} from "@nestjs/common";
import {ProductOtherUnitEntity} from "./productOtherUnit.entity";
import {ProductOtherUnitFindDto} from "./dto/productOtherUnitFind.dto";
import {ProductOtherUnitCreateDto} from "./dto/productOtherUnitCreate.dto";
import {ProductOtherUnitUpdateDto} from "./dto/productOtherUnitUpdate.dto";

@Injectable()
export class ProductOtherUnitService {

    constructor(
        private readonly productOtherUnitEntity:ProductOtherUnitEntity
    ) {
    }

    public async findOne(productOtherUnitId: number){
        return await this.productOtherUnitEntity.findOne(productOtherUnitId);
    }

    public async find(findDto:ProductOtherUnitFindDto){
        return await this.productOtherUnitEntity.find(findDto);
    }

    public async create(createDto: ProductOtherUnitCreateDto){
        return await this.productOtherUnitEntity.create(createDto);
    }

    public async update(updateDto: ProductOtherUnitUpdateDto){
        return await this.productOtherUnitEntity.update(updateDto);
    }

    public async delete_data(productOtherUnitId: number,username:string){
        return await this.productOtherUnitEntity.delete_data(productOtherUnitId,username);
    }
}