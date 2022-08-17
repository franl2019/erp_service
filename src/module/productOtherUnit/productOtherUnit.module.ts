import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {ProductOtherUnitEntity} from "./productOtherUnit.entity";
import {ProductOtherUnitService} from "./productOtherUnit.service";
import {ProductOtherUnitController} from "./productOtherUnit.controller";

@Module({
    imports:[MysqldbModule],
    controllers:[ProductOtherUnitController],
    providers:[ProductOtherUnitEntity,ProductOtherUnitService],
    exports:[ProductOtherUnitService]
})
export class ProductOtherUnitModule {
}