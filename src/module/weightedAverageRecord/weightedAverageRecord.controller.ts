import {Body, Controller, Post} from "@nestjs/common";
import {WeightedAverageRecordService} from "./weightedAverageRecord.service";
import {IState, ReqState} from "../../decorator/user.decorator";
import {WeightedAverageRecordL1ReviewDto} from "./dto/weightedAverageRecordL1Review.dto";

@Controller('erp/weightedAverageRecord')
export class WeightedAverageRecordController {

    constructor(
        private readonly weightedAverageRecordService: WeightedAverageRecordService,
    ) {
    }

    @Post('checkIfCountIsRequired')
    public async checkIfCountIsRequired() {
        const isRequired = await this.weightedAverageRecordService.checkIfCountIsRequired();
        return {
            code: 200,
            msg: '查询成功',
            related: {
                isRequired
            }
        }
    }

    @Post('l1Review')
    public async l1Review(@Body() findDto:WeightedAverageRecordL1ReviewDto,@ReqState() state:IState){
        await this.weightedAverageRecordService.l1Review(findDto.inDate,state.user.username);
        return {
            code: 200,
            msg: '结转成本成功'
        }
    }

    @Post('unl1Review')
    public async unl1Review(@Body() findDto:WeightedAverageRecordL1ReviewDto){
        await this.weightedAverageRecordService.unl1Review(findDto.inDate);
        return {
            code: 200,
            msg: '撤销结转成本成功'
        }
    }
}