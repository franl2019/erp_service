import {BuyAutoCodeEntity} from "./buyAutoCode.entity";
import {Injectable} from "@nestjs/common";
import {IBuyAutoCode} from "./buyAutoCode";

@Injectable()
export class BuyAutoCodeService {

    constructor(
        private readonly buyAutoCodeEntity:BuyAutoCodeEntity
    ) {
    }

    private async findOne(parentName: string){
        return await this.buyAutoCodeEntity.findOne(parentName);
    }

    private async create(buyAutoCode: IBuyAutoCode){
        return await this.buyAutoCodeEntity.create(buyAutoCode);
    }

    private async update(buyAutoCode: IBuyAutoCode){
        return await this.buyAutoCodeEntity.update(buyAutoCode);
    }

    public async getBuyAutoCode(parentName: string){
        const buyAutoCode = await this.findOne(parentName);
        let buyCodeName:string;
        if(buyAutoCode&&buyAutoCode.autoCodeName.length>0&&buyAutoCode.autoCodeNumber > 0){
            buyAutoCode.autoCodeNumber = buyAutoCode.autoCodeNumber + 1;
            await this.update(buyAutoCode);
            const autoCodeNumberLength:number = String(buyAutoCode.autoCodeNumber).length;
            let fillUpAutoCodeNumber:string = '';
            if(autoCodeNumberLength === 1){
                fillUpAutoCodeNumber = '00';
            }else if(autoCodeNumberLength === 2){
                fillUpAutoCodeNumber = '0';
            }

            buyCodeName = parentName + fillUpAutoCodeNumber + buyAutoCode.autoCodeNumber
        }else{
            const newBuyAutoCode:IBuyAutoCode = {
                autoCodeName: parentName, autoCodeNumber: 1
            }
            await this.create(newBuyAutoCode);
            buyCodeName = parentName + '00' + newBuyAutoCode.autoCodeNumber
        }

        return buyCodeName
    }
}