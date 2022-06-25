import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {WeightedAverageRecordEntity} from "./weightedAverageRecord.entity";
import {WeightedAverageRecordService} from "./weightedAverageRecord.service";
import {WeightedAverageRecordController} from "./weightedAverageRecord.controller";

@Module({
    imports:[MysqldbModule],
    controllers:[WeightedAverageRecordController],
    providers:[WeightedAverageRecordEntity,WeightedAverageRecordService],
    exports:[WeightedAverageRecordService]
})
export class WeightedAverageRecordModule {

}