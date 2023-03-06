import {bignumber, chain} from 'mathjs';

export interface IInventory {
    inventoryid: number;
    spec_d: string;
    materials_d: string;
    remark: string;
    remarkmx: string;
    qty: number;
    updatedAt: Date;
    updater: string;
    latest_sale_price: number;
    productid: number;
    clientid: number;
    warehouseid: number;
    batchNo: string;
}

export interface IFindInventory extends IInventory {
    warehousename: string;
    clientcode: string;
    clientname: string;
    productcode: string;
    productname: string;
    materials: string;
    spec: string;
    unit: string;
    packunit: string;
    packqty: number;
    m3: number;
    length: number;
    width: number;
    height: number;
}

export class Inventory implements IInventory {
    inventoryid: number;
    spec_d: string;
    materials_d: string;
    remark: string;
    remarkmx: string;
    qty: number;
    updatedAt: Date;
    updater: string;
    latest_sale_price: number;
    productid: number;
    clientid: number;
    warehouseid: number;
    batchNo: string


    public async add(qty: number,userName:string) {
        this.qty = Number(
            chain(bignumber(this.qty))
                .add(bignumber(qty))
        );
        this.updater = userName;
        return this
    }

    public async subtract(qty: number,userName:string) {
        this.qty = Number(
            chain(bignumber(this.qty))
                .subtract(bignumber(qty))
        );

        this.updater = userName;
    }

    public  async setValue(inventory:IInventory){
        this.inventoryid = inventory.inventoryid;
        this.spec_d = inventory.spec_d;
        this.materials_d = inventory.materials_d;
        this.remark = inventory.remark;
        this.remarkmx = inventory.remarkmx;
        this.qty = inventory.qty;
        this.updatedAt = inventory.updatedAt;
        this.updater = inventory.updater;
        this.latest_sale_price = inventory.latest_sale_price;
        this.productid = inventory.productid;
        this.clientid = inventory.clientid;
        this.warehouseid = inventory.warehouseid;
        this.batchNo = inventory.batchNo;
        return this
    }
}