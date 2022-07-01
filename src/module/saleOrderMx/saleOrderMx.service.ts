import {Injectable} from "@nestjs/common";
import {SaleOrderMxEntity} from "./saleOrderMx.entity";
import {ISaleOrderMx} from "./saleOrderMx";
import {SaleOrderMxCreateDto} from "./dto/saleOrderMxCreate.dto";
import {useVerifyParam} from "../../utils/useVerifyParam";

@Injectable()
export class SaleOrderMxService {

    constructor(
        private readonly saleOrderMxEntity:SaleOrderMxEntity
    ) {
    }

    public async find(saleOrderId:number){
        return await this.saleOrderMxEntity.find(saleOrderId);
    }

    public async create(saleOrderMxList:ISaleOrderMx[]){
        for (let i = 0; i < saleOrderMxList.length; i++) {
            const saleOrderMx = new SaleOrderMxCreateDto(saleOrderMxList[i]);
            await useVerifyParam(saleOrderMx)
        }
        return await this.saleOrderMxEntity.create(saleOrderMxList);
    }

    public async delete_data(saleOrderId:number){
        return await this.saleOrderMxEntity.delete_data(saleOrderId);
    }
}