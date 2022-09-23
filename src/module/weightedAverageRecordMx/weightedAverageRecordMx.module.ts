import {Module} from "@nestjs/common";
import {WeightedAverageRecordMxService} from "./weightedAverageRecordMx.service";
import {WeightedAverageRecordMxEntity} from "./weightedAverageRecordMx.entity";
import {WeightedAverageRecordMxController} from "./weightedAverageRecordMx.controller";
import {WeightedAverageRecordModule} from "../weightedAverageRecord/weightedAverageRecord.module";

@Module({
    imports:[WeightedAverageRecordModule],
    controllers:[WeightedAverageRecordMxController],
    providers:[WeightedAverageRecordMxEntity,WeightedAverageRecordMxService],
    exports:[WeightedAverageRecordMxService]
})
export class WeightedAverageRecordMxModule {}