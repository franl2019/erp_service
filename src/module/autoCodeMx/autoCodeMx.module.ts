import {Module} from "@nestjs/common";
import {AutoCodeMxEntity} from "./autoCodeMx.entity";
import {AutoCodeMxService} from "./autoCodeMx.service";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {AutoCodeModule} from "../autoCode/autoCode.module";

@Module({
    imports: [MysqldbModule, AutoCodeModule],
    providers: [AutoCodeMxEntity, AutoCodeMxService],
    exports: [AutoCodeMxService]
})
export class AutoCodeMxModule {}