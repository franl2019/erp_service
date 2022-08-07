import {Injectable} from "@nestjs/common";
import {BuyEntity} from "./buy.entity";
import {SelectBuyDto} from "./dto/selectBuy.dto";
import {AddBuyDto} from "./dto/addBuy.dto";
import {UpdateBuyDto} from "./dto/updateBuy.dto";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {BuyAreaService} from "../buyArea/buyArea.service";
import {BuyAutoCodeService} from "../buyAutoCode/buyAutoCode.service";
import {IState} from "../../decorator/user.decorator";


@Injectable()
export class BuyService {

    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly buyEntity: BuyEntity,
        private readonly buyAreaService: BuyAreaService,
        private readonly buyAutoCodeService: BuyAutoCodeService
    ) {
    }

    public async findOne(buyid:number){
        return await this.buyEntity.findOne(buyid);
    }

    public async find(buy: SelectBuyDto, state: IState) {
        buy.operateareaids = state.user.buy_operateareaids;
        return await this.buyEntity.find(buy);
    }

    public async findDeleted(buy: SelectBuyDto, state: IState) {
        buy.operateareaids = state.user.buy_operateareaids;
        return await this.buyEntity.getDeletedBuys(buy);
    }

    public async create(buy: AddBuyDto, userName:string) {
        buy.creater = userName;
        buy.createdAt = new Date();

        return this.mysqldbAls.sqlTransaction(async ()=>{
            //检查供应商地区是否存在
            const buyArea = await this.buyAreaService.findOne(buy.buyareaid);
            if (buy.buycode.length === 0) {
                buy.buycode = await this.buyAutoCodeService.getBuyAutoCode(buyArea.parentCode);
            }

            return await this.buyEntity.create(buy);
        })
    }

    public async update(buy: UpdateBuyDto, userName: string) {
        buy.updater = userName;
        buy.updatedAt = new Date();

        return this.mysqldbAls.sqlTransaction(async ()=>{
            //检查供应商地区是否存在
            await this.buyAreaService.findOne(buy.buyareaid);

            return await this.buyEntity.update(buy);
        })
    }

    public async delete_data(buyId: number, userName: string) {
        return await this.buyEntity.delete_data(buyId, userName);
    }

    public async undelete(buyId: number) {
        return await this.buyEntity.undelete(buyId);
    }

    public async level1Review(buyId: number, userName: string) {
        return await this.buyEntity.l1Review(buyId, userName);
    }

    public async unLevel1Review(buyId: number) {
        return await this.buyEntity.unl1Review(buyId);
    }

    public async level2Review(buyId: number, userName: string) {
        return await this.buyEntity.l2Review(buyId, userName);
    }

    public async unLevel2Review(buyId: number) {
        return await this.buyEntity.unl2Review(buyId);
    }

}
