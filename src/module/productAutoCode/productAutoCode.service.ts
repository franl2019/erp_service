import {Injectable} from "@nestjs/common";
import {ProductAutoCodeEntity} from "./productAutoCode.entity";
import {IProductCode} from "./productAutoCode";

@Injectable()
export class ProductAutoCodeService {

    constructor(
        private readonly productAutoCodeEntity:ProductAutoCodeEntity
    ) {
    }

    public async findOne(autoCodeName:string){
        return await this.productAutoCodeEntity.findOne(autoCodeName);
    }

    private async create(productAutoCode: IProductCode){
        return await this.productAutoCodeEntity.create(productAutoCode);
    }

    private async update(productAutoCode: IProductCode){
        return await this.productAutoCodeEntity.update(productAutoCode)
    }

    public async getProductAutoCode(parentName:string){
        const productCode = await this.findOne(parentName);
        let productCodeName:string;

        if(productCode&&productCode.autoCodeName.length>0&&productCode.autoCodeNumber > 0){

            //增加顺序号
            productCode.autoCodeNumber = productCode.autoCodeNumber + 1;
            await this.update(productCode);

            //补全顺序号0位
            const autoCodeNumberLength:number = String(productCode.autoCodeNumber).length;
            let fillUpAutoCodeNumber:string = '';

            if(autoCodeNumberLength === 1){
                fillUpAutoCodeNumber = '00';
            }else if(autoCodeNumberLength === 2){
                fillUpAutoCodeNumber = '0';
            }

            productCodeName = parentName + fillUpAutoCodeNumber + productCode.autoCodeNumber;

        }else{

            const newProductAutoCode:IProductCode = {
                autoCodeName: parentName, autoCodeNumber: 1
            }
            await this.create(newProductAutoCode);
            productCodeName = parentName + '00' + newProductAutoCode.autoCodeNumber;

        }

        return productCodeName
    }
}