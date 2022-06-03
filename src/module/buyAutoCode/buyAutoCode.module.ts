import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {BuyAutoCodeEntity} from "./buyAutoCode.entity";
import {BuyAutoCodeService} from "./buyAutoCode.service";

@Module({
    imports:[MysqldbModule],
    providers:[BuyAutoCodeEntity,BuyAutoCodeService],
    exports:[BuyAutoCodeService]
})
export class BuyAutoCodeModule {

}