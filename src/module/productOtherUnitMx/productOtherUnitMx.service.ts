import {Injectable} from "@nestjs/common";
import {ProductOtherUnitMxEntity} from "./productOtherUnitMx.entity";
import {ProductOtherUnitMxCreateDto} from "./dto/productOtherUnitMxCreate.dto";

@Injectable()
export class ProductOtherUnitMxService {

    constructor(
        private readonly productOtherUnitMxEntity:ProductOtherUnitMxEntity
    ) {
    }

    public async find(productid: number){
        return await this.productOtherUnitMxEntity.find(productid);
    }

    public async create(createDto:ProductOtherUnitMxCreateDto){
        return await this.productOtherUnitMxEntity.create(createDto);
    }

    public async delete_data(productid: number){
        return await this.productOtherUnitMxEntity.delete_data(productid);
    }
}