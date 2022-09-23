import {Module} from "@nestjs/common";
import {SaleOrderMxEntity} from "./saleOrderMx.entity";
import {SaleOrderMxService} from "./saleOrderMx.service";
import {SaleOrderMxController} from "./saleOrderMx.controller";

@Module({
    controllers:[SaleOrderMxController],
    providers:[SaleOrderMxEntity,SaleOrderMxService],
    exports:[SaleOrderMxService]
})
export class SaleOrderMxModule {

}