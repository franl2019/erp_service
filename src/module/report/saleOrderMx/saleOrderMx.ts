import {ISaleOrder} from "../../saleOrder/saleOrder";
import {ISaleOrderMx} from "../../saleOrderMx/saleOrderMx";
import {IProduct} from "../../product/product";

export interface ISaleOrderMxReport extends ISaleOrder,ISaleOrderMx,IProduct{

}