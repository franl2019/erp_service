import {Injectable} from "@nestjs/common";
import {SaleOrderMxEntity} from "./saleOrderMx.entity";
import {ISaleOrderMx} from "./saleOrderMx";
import {SaleOrderMxCreateDto} from "./dto/saleOrderMxCreate.dto";
import {useVerifyParam} from "../../utils/verifyParam/useVerifyParam";

@Injectable()
export class SaleOrderMxService {

    constructor(
        private readonly saleOrderMxEntity:SaleOrderMxEntity,
    ) {
    }

    public async find(saleOrderId:number){
        return await this.saleOrderMxEntity.find(saleOrderId);
    }

    public async findOne(saleOrderId:number,saleOrderMxId:number){
        return await this.saleOrderMxEntity.findOne(
            saleOrderId,
            saleOrderMxId
        );
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

    public async salesOrderSale(saleOrderId: number,saleOrderMxId: number, saleQty:number){
        await this.saleOrderMxEntity.salesOrderSale(
            saleOrderId,
            saleOrderMxId,
            saleQty
        )
    }

    public async salesOrderStopSale(saleOrderId: number,saleOrderMxId: number, stopQty:number){
        await this.saleOrderMxEntity.salesOrderStopSale(
            saleOrderId,
            saleOrderMxId,
            stopQty
        )
    }

    public async lineClose(saleOrderId: number,saleOrderMxId: number,lineClose:boolean){
        await this.saleOrderMxEntity.lineClose(saleOrderId,saleOrderMxId,lineClose)
    }
}