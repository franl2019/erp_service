import {Injectable} from "@nestjs/common";
import {ClientEntity} from "./client.entity";
import {SelectClientDto} from "./dto/selectClient.dto";
import {AddClientDto} from "./dto/addClient.dto";
import {UpdateClientDto} from "./dto/updateClient.dto";
import {DeleteClientDto} from "./dto/deleteClient.dto";
import {State} from "../../interface/IState";
import {ClientAreaEntity} from "../clientArea/clientArea.entity";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IClient} from "./client";
import {ClientAutoCodeService} from "../clientAutoCode/clientAutoCode.service";


@Injectable()
export class ClientService {

    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly clientEntity: ClientEntity,
        private readonly clientAreaSql: ClientAreaEntity,
        private readonly clientAutoCodeService:ClientAutoCodeService
    ) {
    }

    private async checkGsClientIsExist() {
        const gsClient = await this.getGsClient()
        if (gsClient && gsClient.clientid !== 0) {
            return Promise.reject(new Error("公司标记客户已存在"))
        }
    }

    public async findOne(clientid: number) {
        return await this.clientEntity.findOne(clientid);
    }

    public async find(client: SelectClientDto, state: State) {
        client.operateareaids = state.user.client_operateareaids;
        return await this.clientEntity.find(client);
    }

    public async getGsClient(): Promise<IClient> {
        return await this.clientEntity.getGsClient();
    }

    public async create(client: AddClientDto, state: State) {
        client.creater = state.user.username;
        client.createdAt = new Date();

        if (state.user.client_operateareaids.indexOf(client.operateareaid) === -1) {
            await Promise.reject(new Error("缺少该操作区域权限,保存失败"));
        }

        return this.mysqldbAls.sqlTransaction(async ()=>{
            //检查客户地区是否存在
            const clientArea = await this.clientAreaSql.findOne(client.clientareaid);

            if(client.clientcode.length===0){
                client.clientcode = await this.clientAutoCodeService.getClientAutoCode(clientArea.parentCode)
            }

            //检查公司标记是否为1,检查是否已存在公司标记客户
            if (client.gs === 1) {
                await this.checkGsClientIsExist();
            }

            return await this.clientEntity.create(client);
        })

    }

    public async update(client: UpdateClientDto, state: State) {
        return await this.mysqldbAls.sqlTransaction(async () => {
            client.updater = state.user.username;
            client.updatedAt = new Date();
            const client_DB = await this.clientEntity.findOne(client.clientid);
            //验证操作区域权限，没有该客户的操作区域不能修改，更新的操作区域没有权限也不能更新
            if (state.user.client_operateareaids.indexOf(client_DB.operateareaid) === -1 || state.user.client_operateareaids.indexOf(client.operateareaid) === -1) {
                await Promise.reject(new Error("缺少该操作区域权限,更新失败"));
            }

            //检查公司标记是否为1,检查是否已存在公司标记客户
            if (client.gs === 1) {
                await this.checkGsClientIsExist();
            }

            if (client_DB.level1review + client_DB.level2review === 0) {
                await this.clientEntity.update(client);
            } else {
                await Promise.reject(new Error("客户已审核无法更新保存，请先撤审"));
            }
        });
    }

    public async delete_data(client: DeleteClientDto, state: State) {
        return await this.mysqldbAls.sqlTransaction(async () => {
            const client_DB = await this.clientEntity.findOne(client.clientid);
            //验证操作区域权限，没有该客户的操作区域不能修改，更新的操作区域没有权限也不能更新
            if (state.user.client_operateareaids.indexOf(client_DB.operateareaid) === -1) {
                await Promise.reject(new Error("缺少该操作区域权限,更新失败"));
            }
            if (client_DB.level1review + client_DB.level2review === 0) {
                await this.clientEntity.delete_data(client.clientid, state.user.username);
            } else {
                await Promise.reject(new Error("客户已审核无法删除，请先撤审"));
            }
        });
    }

    public async level1Review(clientid:number, userName:string) {
        return await this.clientEntity.l1Review(clientid, userName);
    }

    public async unLevel1Review(clientid:number) {
        return await this.clientEntity.unl1Review(clientid);
    }

    public async level2Review(clientid:number, userName:string) {
        return await this.clientEntity.l2Review(clientid, userName);
    }

    public async unLevel2Review(clientid:number) {
        return await this.clientEntity.unl2Review(clientid);
    }

}
