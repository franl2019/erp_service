import {Body, Controller, Post} from "@nestjs/common";
import {WeightedAverageRecordMxService} from "./weightedAverageRecordMx.service";
import {ReqState} from "../../decorator/user.decorator";
import {IState} from "../../interface/IState";
import {CountWeightedAverageRecordMxDto} from "./dto/countWeightedAverageRecordMx.dto";
import * as moment from "moment";

@Controller('erp/weightedAverageRecordMx')
export class WeightedAverageRecordMxController {

    constructor(
        private readonly weightedAverageRecordMxService: WeightedAverageRecordMxService
    ) {
    }

    @Post('countWeightedAverageRecordMx')
    public async countWeightedAverageRecordMx(@Body() findDto: CountWeightedAverageRecordMxDto, @ReqState() state: IState) {
        const inDate = moment(findDto.inDate).format('YYYY-MM');
        await this.weightedAverageRecordMxService.countWeightedAverageRecordMx(inDate, state.user.username);
        return {
            code: 200,
            msg: "计算成功"
        }
    }
}