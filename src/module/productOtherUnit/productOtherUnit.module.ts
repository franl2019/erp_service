import {Module} from "@nestjs/common";
import {ProductOtherUnitEntity} from "./productOtherUnit.entity";
import {ProductOtherUnitService} from "./productOtherUnit.service";
import {ProductOtherUnitController} from "./productOtherUnit.controller";

@Module({
    controllers:[ProductOtherUnitController],
    providers:[ProductOtherUnitEntity,ProductOtherUnitService],
    exports:[ProductOtherUnitService]
})
export class ProductOtherUnitModule {
}