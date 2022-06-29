import {SaleOrderEntity} from "./saleOrder.entity";
import {Injectable} from "@nestjs/common";
import {SaleOrderFindDto} from "./dto/saleOrderFind.dto";
import {ISaleOrder} from "./saleOrder";

@Injectable()
export class SaleOrderService {

    constructor(
        private readonly saleOrderEntity:SaleOrderEntity
    ) {
    }

    public async findOne(saleOrderId:number){
        return await this.saleOrderEntity.findOne(saleOrderId)
    }

    public async find(findDto:SaleOrderFindDto){
        return await this.saleOrderEntity.find(findDto);
    }

    public async create(saleOrder: ISaleOrder){
        //默认 未审核
        saleOrder.saleOrderState = 0;
        return await this.saleOrderEntity.create(saleOrder)
    }

    public async update(saleOrder: ISaleOrder){
        return await this.saleOrderEntity.update(saleOrder);
    }

    public async l1Review(saleOrderId:number,username:string){
        return await this.saleOrderEntity.l1Review(saleOrderId, username);
    }

    public async unl1Review(saleOrderId:number){
        return await this.saleOrderEntity.unl1Review(saleOrderId);
    }

    public async l2Review(saleOrderId:number,username:string){
        return await this.saleOrderEntity.l2Review(saleOrderId, username);
    }

    public async unl2Review(saleOrderId:number){
        return await this.saleOrderEntity.unl2Review(saleOrderId);
    }

    public async stopReview(saleOrderId:number,username:string){
        return await this.saleOrderEntity.stopReview(saleOrderId, username);
    }

    public async unStopReview(saleOrderId:number){
        return await this.saleOrderEntity.unStopReview(saleOrderId);
    }

    public async manualFinishReview(saleOrderId:number,username:string){
        return await this.saleOrderEntity.manualFinishReview(saleOrderId, username);
    }

    public async unManualFinishReview(saleOrderId:number){
        return await this.saleOrderEntity.unManualFinishReview(saleOrderId);
    }

    public async urgentReview(saleOrderId:number,username:string){
        return await this.saleOrderEntity.urgentReview(saleOrderId, username);
    }

    public async unUrgentReview(saleOrderId:number){
        return await this.saleOrderEntity.unUrgentReview(saleOrderId);
    }

    public async delete_data(saleOrderId:number,username:string){
        return await this.saleOrderEntity.delete_data(saleOrderId, username)
    }
}