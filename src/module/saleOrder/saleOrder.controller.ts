import {SaleOrderService} from "./saleOrder.service";
import {Body, Controller, Post} from "@nestjs/common";
import {SaleOrderFindDto} from "./dto/saleOrderFind.dto";
import {IState, ReqState} from "../../decorator/user.decorator";
import {SaleOrderCreateDto} from "./dto/saleOrderCreate.dto";
import {SaleOrderUpdateDto} from "./dto/saleOrderUpdate.dto";
import {SaleReviewDto} from "./dto/saleReview.dto";

@Controller('erp/saleOrder')
export class SaleOrderController {

    @Post('find')
    public async find(@Body() findDto:SaleOrderFindDto,@ReqState() state:IState){
        if(findDto.warehouseids.length ===0){
            findDto.warehouseids = state.user.warehouseids;
        }
        const data = await this.saleOrderService.find(findDto);
        return {
            code:200,
            msg:'查询成功',
            data
        }
    }


    constructor(
        private readonly saleOrderService:SaleOrderService
    ) {
    }

    @Post('create')
    public async create(@Body() createDto:SaleOrderCreateDto,@ReqState() state:IState){
        createDto.creater = state.user.username;
        createDto.createdAt = new Date();
        const createResult = await this.saleOrderService.createSheet(createDto);
        return {
            code:200,
            msg:'新增成功',
            createResult
        }
    }

    @Post('createAndL1Review')
    public async createAndL1Review(@Body() createDto:SaleOrderCreateDto,@ReqState() state:IState){
        createDto.creater = state.user.username;
        createDto.createdAt = new Date();
        const createResult = await this.saleOrderService.createSheet(createDto);
        return {
            code:200,
            msg:'新增成功',
            createResult
        }
    }

    @Post('update')
    public async update(@Body() updateDto:SaleOrderUpdateDto,@ReqState() state:IState){
        updateDto.updater = state.user.username;
        updateDto.updatedAt = new Date();
        await this.saleOrderService.updateSheet(updateDto);
        return{
            code:200,
            msg:'更新成功'
        }
    }

    @Post('l1Review')
    public async l1Review(@Body() reviewDto:SaleReviewDto,@ReqState() state:IState){
        await this.saleOrderService.l1Review(reviewDto.saleOrderId,state.user.username);
        return {
            code:200,
            msg:'销售审核成功'
        }
    }

    @Post('unl1Review')
    public async unl1Review(@Body() reviewDto:SaleReviewDto){
        await this.saleOrderService.unl1Review(reviewDto.saleOrderId);
        return {
            code:200,
            msg:'撤销,销售审核成功'
        }
    }

    @Post('l2Review')
    public async l2Review(@Body() reviewDto:SaleReviewDto,@ReqState() state:IState){
        await this.saleOrderService.l2Review(reviewDto.saleOrderId,state.user.username);
        return {
            code:200,
            msg:'财务审核成功'
        }
    }

    @Post('unl2Review')
    public async unl2Review(@Body() reviewDto:SaleReviewDto){
        await this.saleOrderService.unl2Review(reviewDto.saleOrderId);
        return {
            code:200,
            msg:'撤销,财务审核成功'
        }
    }

    @Post('stopReview')
    public async stopReview(@Body() reviewDto:SaleReviewDto,@ReqState() state:IState){
        await this.saleOrderService.stopReview(reviewDto.saleOrderId,state.user.username);
        return {
            code:200,
            msg:'终止审核成功'
        }
    }

    @Post('unStopReview')
    public async unStopReview(@Body() reviewDto:SaleReviewDto){
        await this.saleOrderService.unStopReview(reviewDto.saleOrderId);
        return {
            code:200,
            msg:'撤销,终止审核成功'
        }
    }

    @Post('manualFinishReview')
    public async manualFinishReview(@Body() reviewDto:SaleReviewDto,@ReqState() state:IState){
        await this.saleOrderService.manualFinishReview(reviewDto.saleOrderId,state.user.username);
        return {
            code:200,
            msg:'手动完成审核成功'
        }
    }

    @Post('unManualFinishReview')
    public async unManualFinishReview(@Body() reviewDto:SaleReviewDto){
        await this.saleOrderService.unManualFinishReview(reviewDto.saleOrderId);
        return {
            code:200,
            msg:'撤销,手动完成审核成功'
        }
    }

    @Post('urgentReview')
    public async urgentReview(@Body() reviewDto:SaleReviewDto,@ReqState() state:IState){
        await this.saleOrderService.urgentReview(reviewDto.saleOrderId,state.user.username);
        return {
            code:200,
            msg:'加急审核成功'
        }
    }

    @Post('unUrgentReview')
    public async unUrgentReview(@Body() reviewDto:SaleReviewDto){
        await this.saleOrderService.unUrgentReview(reviewDto.saleOrderId);
        return {
            code:200,
            msg:'撤销,加急审核成功'
        }
    }

    @Post('delete_data')
    public async delete_data(@Body() reviewDto:SaleReviewDto,@ReqState() state:IState){
        await this.saleOrderService.delete_data(reviewDto.saleOrderId,state.user.username);
        return {
            code:200,
            msg:'销售订单删除成功'
        }
    }
}