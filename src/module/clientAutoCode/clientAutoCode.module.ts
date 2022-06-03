import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {ClientAutoCodeEntity} from "./clientAutoCode.entity";
import {ClientAutoCodeService} from "./clientAutoCode.service";

@Module({
    imports:[MysqldbModule],
    providers:[ClientAutoCodeEntity,ClientAutoCodeService],
    exports:[ClientAutoCodeService]
})
export class ClientAutoCodeModule {
}