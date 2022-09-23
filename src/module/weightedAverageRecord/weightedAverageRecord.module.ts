import {Module} from "@nestjs/common";
import {WeightedAverageRecordEntity} from "./weightedAverageRecord.entity";
import {WeightedAverageRecordService} from "./weightedAverageRecord.service";
import {WeightedAverageRecordController} from "./weightedAverageRecord.controller";

@Module({
    controllers:[WeightedAverageRecordController],
    providers:[WeightedAverageRecordEntity,WeightedAverageRecordService],
    exports:[WeightedAverageRecordService]
})
export class WeightedAverageRecordModule {

}