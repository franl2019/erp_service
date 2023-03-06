import {IsInt, IsNumber, IsString, NotEquals} from "class-validator";
import {Inventory} from "../inventory";
import {InventoryFindOneDto} from "./inventoryFindOne.dto";

export class InventoryCreateDto extends Inventory {
    @IsString()
    spec_d: string;

    @IsString()
    materials_d: string;

    @IsString()
    remark: string;

    @IsString()
    remarkmx: string;

    @IsString()
    batchNo: string;

    @IsNumber()
    qty: number;

    updatedAt: Date;

    updater: string;

    @IsNumber()
    latest_sale_price: number;

    @IsInt()
    @NotEquals(0)
    productid: number;

    @IsInt()
    @NotEquals(0)
    clientid: number;

    @IsInt()
    warehouseid: number;

    inventoryid: number;


    constructor(inventoryFindOneDto:InventoryFindOneDto) {
        super();
        this.spec_d = inventoryFindOneDto.spec_d;
        this.materials_d = inventoryFindOneDto.materials_d;
        this.remark = inventoryFindOneDto.remark;
        this.remarkmx = inventoryFindOneDto.remarkmx;
        this.batchNo = inventoryFindOneDto.batchNo;
        this.productid = inventoryFindOneDto.productid;
        this.clientid = inventoryFindOneDto.clientid;
        this.warehouseid = inventoryFindOneDto.warehouseid;
        this.latest_sale_price = 0
    }

    setQty(qty:number,userName:string){
        this.qty = qty;
        this.updater = userName;
        this.updatedAt = new Date();
        return this
    }


}