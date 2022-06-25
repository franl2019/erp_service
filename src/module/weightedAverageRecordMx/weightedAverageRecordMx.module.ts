import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {WeightedAverageRecordMxService} from "./weightedAverageRecordMx.service";
import {WeightedAverageRecordMxEntity} from "./weightedAverageRecordMx.entity";
import {WeightedAverageRecordMxController} from "./weightedAverageRecordMx.controller";
import {WeightedAverageRecordModule} from "../weightedAverageRecord/weightedAverageRecord.module";

@Module({
    imports:[MysqldbModule,WeightedAverageRecordModule],
    controllers:[WeightedAverageRecordMxController],
    providers:[WeightedAverageRecordMxEntity,WeightedAverageRecordMxService],
    exports:[WeightedAverageRecordMxService]
})
export class WeightedAverageRecordMxModule {}