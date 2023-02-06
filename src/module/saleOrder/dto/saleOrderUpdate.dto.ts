import {ISaleOrder} from "../saleOrder";
import { IsInt, NotEquals} from "class-validator";
import {ISaleOrderMx} from "../../saleOrderMx/saleOrderMx";
import {SaleOrderCreateDto} from "./saleOrderCreate.dto";

export interface ISaleOrderUpdateSheetDto extends ISaleOrder{
    saleOrderMx:ISaleOrderMx[]
}

export class SaleOrderUpdateDto extends SaleOrderCreateDto{
    //单据id
    @IsInt()
    @NotEquals(0)
    saleOrderId: number;

    constructor() {
        super();
    }
}