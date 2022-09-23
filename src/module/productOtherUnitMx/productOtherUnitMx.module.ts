import {Module} from "@nestjs/common";
import {ProductOtherUnitMxService} from "./productOtherUnitMx.service";
import {ProductOtherUnitMxEntity} from "./productOtherUnitMx.entity";
import {ProductOtherUnitMxController} from "./productOtherUnitMx.controller";

@Module({
    controllers:[ProductOtherUnitMxController],
    providers:[ProductOtherUnitMxService,ProductOtherUnitMxEntity],
    exports:[ProductOtherUnitMxService]
})
export class ProductOtherUnitMxModule {
}