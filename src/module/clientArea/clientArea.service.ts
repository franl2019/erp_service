import {Injectable} from "@nestjs/common";
import {ClientAreaEntity} from "./clientArea.entity";
import {UpdateClientAreaDto} from "./dto/updateClientArea.dto";
import {AddClientAreaDto} from "./dto/addClientArea.dto";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IClientArea} from "./clientArea";

@Injectable()
export class ClientAreaService {

    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly clientAreaSql: ClientAreaEntity) {
    }

    //获取父级地区List
    private async getParentClientArea(clientArea: IClientArea) {
        const clientAreaList = await this.find();
        const parentAreaList: IClientArea[] = [];

        getChild(clientArea);

        function getChild(clientArea: IClientArea) {
            for (let i = 0; i < clientAreaList.length; i++) {
                const clientAreaItem = clientAreaList[i];
                if (clientArea.parentid === clientAreaItem.clientareaid) {
                    parentAreaList.push(clientAreaItem);
                    getChild(clientAreaItem);
                }
            }
        }


        parentAreaList.reverse();

        return parentAreaList
    }

    //获取子地区List
    private async getChildClientArea(clientArea: IClientArea) {
        const clientAreaList = await this.find();
        const childAreaList: IClientArea[] = [];

        getChild(clientArea);

        function getChild(clientArea: IClientArea) {
            for (let i = 0; i < clientAreaList.length; i++) {
                const clientAreaItem = clientAreaList[i];
                if (clientArea.clientareaid === clientAreaItem.parentid) {
                    childAreaList.push(clientAreaItem);
                    getChild(clientAreaItem);
                }
            }
        }


        childAreaList.reverse();

        return childAreaList
    }

    private async getParenCode(clientArea: IClientArea){
        const parentClientAreaList = await this.getParentClientArea(clientArea);

        let parenCode = '';
        for (let i = 0; i < parentClientAreaList.length; i++) {
            parenCode = parenCode + parentClientAreaList[i].clientareacode;
        }

        return parenCode + clientArea.clientareacode;
    }

    public async getChildIdList(clientArea: IClientArea){
        const childIdList:number[] = [];
        const childList = await this.getChildClientArea(clientArea);
        childList.push(clientArea);

        for (let i = 0; i < childList.length; i++) {
            childIdList.push(childList[i].clientareaid);
        }

        return childIdList
    }

    public async find() {
        return await this.clientAreaSql.find();
    }

    public async findOne(clientareaid: number) {
        return await this.clientAreaSql.findOne(clientareaid);
    }

    public async create(clientArea: AddClientAreaDto) {

        clientArea.parentCode = await this.getParenCode(clientArea);
        clientArea.sonflag = 0;

        return await this.mysqldbAls.sqlTransaction(async () => {

            // ClientArea.parentid = 0 根地区
            if (clientArea.parentid !== 0) {
                //检查所属地区是否存在
                const parentClientArea = await this.clientAreaSql.findOne(clientArea.parentid);

                //更新父级地区sonflag标记
                await this.clientAreaSql.updateSonflag(parentClientArea.clientareaid);

                //添加地区
                return await this.clientAreaSql.create(clientArea);
            } else {
                //添加地区
                return await this.clientAreaSql.create(clientArea);
            }

        });

    }

    public async update(clientArea: UpdateClientAreaDto) {
        clientArea.sonflag = 0;
        clientArea.parentCode = await this.getParenCode(clientArea);

        return await this.mysqldbAls.sqlTransaction(async () => {
            const clientArea_db = await this.clientAreaSql.findOne(clientArea.clientareaid);

            if (clientArea.clientareaid === clientArea.parentid) {
                return Promise.reject(new Error("不能选择自己作为父级区域"));
            }

            //检查是否存在下级区域，有下级区域不能修改parentid
            if (clientArea.parentid !== clientArea_db.parentid) {
                const childrenClientAreas = await this.clientAreaSql.getChildrenClientArea(clientArea.clientareaid);
                if (childrenClientAreas.length > 0) {
                    return Promise.reject(new Error("客户地区下级存在,不能修改类别所属"));
                } else {
                    await this.clientAreaSql.update(clientArea);
                }
            } else {
                await this.clientAreaSql.update(clientArea);
            }

            if (clientArea.parentid !== clientArea_db.parentid && clientArea_db.parentid !== 0) {
                await this.clientAreaSql.updateSonflag(clientArea_db.parentid);
            }

            if (clientArea.parentid !== clientArea_db.parentid && clientArea.parentid !== 0) {
                await this.clientAreaSql.updateSonflag(clientArea.parentid);
            }
        });
    }

    public async delete_data(clientAreaId: number, userName: string) {

        return await this.mysqldbAls.sqlTransaction(async () => {

            const clientArea = await this.clientAreaSql.findOne(clientAreaId);

            //查询客户地区下的客户
            const clientFromClientAreaList = await this.clientAreaSql.getClientBelongsToClientArea(clientAreaId);
            if (clientFromClientAreaList.length !== 0) {
                return Promise.reject(new Error("客户地区下存在客户，不能删除"));
            }

            const childrenClientAreas = await this.clientAreaSql.getChildrenClientArea(clientAreaId);
            if (childrenClientAreas.length !== 0) {
                return Promise.reject(new Error("客户地区下级存在,不能删除"));
            }

            await this.clientAreaSql.delete_data(clientAreaId, userName);

            if (clientArea.parentid !== 0) {
                await this.clientAreaSql.updateSonflag(clientArea.parentid);
            }
        });
    }

}
