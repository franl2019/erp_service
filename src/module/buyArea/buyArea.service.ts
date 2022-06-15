import {Injectable} from "@nestjs/common";
import {BuyAreaEntity} from "./buyArea.entity";
import {UpdateBuyAreaDto} from "./dto/updateBuyArea.dto";
import {AddBuyAreaDto} from "./dto/addBuyArea.dto";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IBuyArea} from "./buyArea";

@Injectable()
export class BuyAreaService {

    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly buyAreaEntity: BuyAreaEntity
    ) {
    }

    //获取父级地区List
    private async getParentBuyArea(buyArea: IBuyArea) {
        const buyAreaList = await this.find()
        const parentAreaList: IBuyArea[] = []

        getChild(buyArea);

        function getChild(buyArea: IBuyArea) {
            for (let i = 0; i < buyAreaList.length; i++) {
                const buyAreaItem = buyAreaList[i];
                if (buyArea.parentid === buyAreaItem.buyareaid) {
                    parentAreaList.push(buyAreaItem);
                    getChild(buyAreaItem);
                }
            }
        }


        parentAreaList.reverse();

        return parentAreaList
    }

    //获取子地区List
    private async getChildBuyArea(buyArea: IBuyArea) {
        const buyAreaList = await this.find()
        const childAreaList: IBuyArea[] = []

        getChild(buyArea);

        function getChild(buyArea: IBuyArea) {
            for (let i = 0; i < buyAreaList.length; i++) {
                const buyAreaItem = buyAreaList[i];
                if (buyArea.buyareaid === buyAreaItem.parentid) {
                    childAreaList.push(buyAreaItem);
                    getChild(buyAreaItem);
                }
            }
        }


        childAreaList.reverse();

        return childAreaList
    }

    private async getParenCode(buyArea: IBuyArea){
        const parentBuyAreaList = await this.getParentBuyArea(buyArea)

        let parenCode = '';
        for (let i = 0; i < parentBuyAreaList.length; i++) {
            parenCode = parenCode + parentBuyAreaList[i].buyareacode
        }

        return parenCode + buyArea.buyareacode;
    }

    public async getChildIdList(buyArea: IBuyArea){
        const childIdList:number[] = [];
        const childList = await this.getChildBuyArea(buyArea);
        childList.push(buyArea);

        for (let i = 0; i < childList.length; i++) {
            childIdList.push(childList[i].buyareaid);
        }

        return childIdList
    }

    public async find() {
        return await this.buyAreaEntity.find();
    }

    public async findOne(buyareaid: number) {
        return await this.buyAreaEntity.findOne(buyareaid);
    }

    public async find_deleted() {
        return await this.buyAreaEntity.getDeleteBuyAreas();
    }

    public async create(buyArea: AddBuyAreaDto) {

        buyArea.sonflag = 0;
        buyArea.parentCode = await this.getParenCode(buyArea);

        return await this.mysqldbAls.sqlTransaction(async () => {
            // ClientArea.parentid = 0 根地区
            if (buyArea.parentid !== 0) {
                //检查所属地区是否存在
                const parentBuyArea = await this.buyAreaEntity.findOne(buyArea.parentid);
                //更新父级地区sonflag标记
                await this.buyAreaEntity.updateSonflag(parentBuyArea.buyareaid);

                return await this.buyAreaEntity.create(buyArea);
            } else {
                //添加地区
                return await this.buyAreaEntity.create(buyArea);
            }
        });
    }

    public async update(buyArea: UpdateBuyAreaDto) {

        if (buyArea.sonflag == null) buyArea.sonflag = 0;

        if (buyArea.buyareaid === buyArea.parentid) {
            return Promise.reject(new Error("错误,所属地区和地区自身相同"));
        }

        buyArea.parentCode = await this.getParenCode(buyArea);

        return await this.mysqldbAls.sqlTransaction(async () => {
            const buyArea_DB = await this.buyAreaEntity.findOne(buyArea.buyareaid);
            //检查是否存在下级区域，有下级区域不能修改parentid
            if (buyArea.parentid !== buyArea_DB.parentid) {
                const childrenBuyAreas = await this.buyAreaEntity.getChildrenBuyArea(buyArea.buyareaid);
                if (childrenBuyAreas.length > 0) {
                    return Promise.reject(new Error("供应商地区下级存在,不能修改类别所属"));
                }

                await this.buyAreaEntity.update(buyArea);
            } else {
                await this.buyAreaEntity.update(buyArea);
            }
            if (buyArea.parentid !== buyArea_DB.parentid && buyArea_DB.parentid !== 0) {
                await this.buyAreaEntity.updateSonflag(buyArea_DB.parentid);
            }
            if (buyArea.parentid !== buyArea_DB.parentid && buyArea.parentid !== 0) {
                await this.buyAreaEntity.updateSonflag(buyArea.parentid);
            }
        });


    }

    public async delete_data(buyareaId: number, userName: string) {
        return await this.mysqldbAls.sqlTransaction(async () => {

            //检查地区是否有供应商
            const buyBelongsToBuyAreaList = await this.buyAreaEntity.getBuyBelongsToBuyArea(buyareaId);
            if (buyBelongsToBuyAreaList.length !== 0) {
                return Promise.reject(new Error("供应商地区下已存在供应商，不能删除"));
            }

            //检查地区是否有下属地区
            const buyArea_DB = await this.buyAreaEntity.findOne(buyareaId);
            const childrenBuyAreas = await this.buyAreaEntity.getChildrenBuyArea(buyareaId);
            if (childrenBuyAreas.length !== 0) {
                return Promise.reject(new Error("供应商地区下级存在,不能删除"));
            }

            //删除地区
            await this.buyAreaEntity.delete_data(buyareaId, userName);

            //更新父级地区sonflag标记
            if (buyArea_DB.parentid !== 0) {
                await this.buyAreaEntity.updateSonflag(buyArea_DB.parentid);
            }
        });

    }

    public async undelete(buyareaId: number) {
        return await this.mysqldbAls.sqlTransaction(async () => {
            const buyArea_DB = await this.buyAreaEntity.getDeleteBuyArea(buyareaId);
            await this.buyAreaEntity.undelete(buyareaId);
            if (buyArea_DB.parentid !== 0) {
                await this.buyAreaEntity.updateSonflag(buyArea_DB.parentid);
            }
        });

    }
}
