import {Module} from "@nestjs/common";
import {MysqldbModule} from "../mysqldb/mysqldb.module";
import {WeightedAverageRecordEntity} from "./weightedAverageRecord.entity";
import {WeightedAverageRecordService} from "./weightedAverageRecord.service";

@Module({
    imports:[MysqldbModule],
    providers:[WeightedAverageRecordEntity,WeightedAverageRecordService],
    exports:[WeightedAverageRecordService]
})
export class WeightedAverageRecordModule {

}