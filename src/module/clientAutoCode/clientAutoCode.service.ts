import {Injectable} from "@nestjs/common";
import {ClientAutoCodeEntity} from "./clientAutoCode.entity";
import {IClientAutoCode} from "./clientAutoCode";

@Injectable()
export class ClientAutoCodeService {

    constructor(
        private readonly clientAutoCodeEntity:ClientAutoCodeEntity
    ) {
    }

    private async findOne(autoCodeName:string){
        return await this.clientAutoCodeEntity.findOne(autoCodeName);
    }

    private async create(clientAutoCode:IClientAutoCode){
        return await this.clientAutoCodeEntity.create(clientAutoCode);
    }

    private async update(clientAutoCode:IClientAutoCode){
        return await this.clientAutoCodeEntity.update(clientAutoCode);
    }

    public async getClientAutoCode(parentName: string){
        const clientAutoCode = await this.findOne(parentName);
        let clientCodeName:string;
        if(clientAutoCode&&clientAutoCode.autoCodeName.length>0&&clientAutoCode.autoCodeNumber > 0){

            //客户自动编号顺序号增加
            clientAutoCode.autoCodeNumber = clientAutoCode.autoCodeNumber + 1;
            await this.update(clientAutoCode);

            //返回自动编号,顺序号位数补齐
            const autoCodeNumberLength:number = String(clientAutoCode.autoCodeNumber).length;
            let fillUpAutoCodeNumber:string = '';
            if(autoCodeNumberLength === 1){
                fillUpAutoCodeNumber = '00';
            }else if(autoCodeNumberLength === 2){
                fillUpAutoCodeNumber = '0';
            }

            //拼接自动编号
            clientCodeName = parentName + fillUpAutoCodeNumber + clientAutoCode.autoCodeNumber
        }else{

            //创建自动编号顺序号记录
            const newClientAutoCode:IClientAutoCode = {
                autoCodeName: parentName,
                autoCodeNumber: 1
            }
            await this.create(newClientAutoCode);
            clientCodeName = parentName + '00' + newClientAutoCode.autoCodeNumber
        }

        return clientCodeName
    }
}