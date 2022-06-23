import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {WeightedAverageRecordMxService} from "./weightedAverageRecordMx.service";
import {WeightedAverageRecordMxEntity} from "./weightedAverageRecordMx.entity";

@Module({
    imports:[MysqldbModule],
    providers:[WeightedAverageRecordMxEntity,WeightedAverageRecordMxService]
})
export class WeightedAverageRecordMxModule {}