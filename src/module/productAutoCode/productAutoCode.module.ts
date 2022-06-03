import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {ProductAutoCodeEntity} from "./productAutoCode.entity";
import {ProductAutoCodeService} from "./productAutoCode.service";

@Module({
    imports:[MysqldbModule],
    providers:[ProductAutoCodeEntity,ProductAutoCodeService],
    exports:[ProductAutoCodeService]
})
export class ProductAutoCodeModule {

}