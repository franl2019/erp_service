import {IsInt, IsNumber, IsString, NotEquals} from "class-validator";
import {IInventory, Inventory} from "../inventory";
import {useVerifyParam} from "../../../utils/verifyParam/useVerifyParam";

export class InventoryEditDto extends Inventory {
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

    @IsString()
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

    constructor() {
        super();
    }

    async setValue(inventory: IInventory): Promise<this> {
        await super.setValue(inventory);
        await useVerifyParam(this)
        return this
    }
}