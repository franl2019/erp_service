import {ISaleOrder} from "../saleOrder";
import {IsArray, IsDateString, IsInt, IsNumber, IsString, NotEquals} from "class-validator";
import {ISaleOrderMx} from "../../saleOrderMx/saleOrderMx";
import {IsDateStringOrNull} from "../../../utils/verifyParam/useCustomDecorator";

export interface ISaleOrderCreateSheetDto extends ISaleOrder{
    saleOrderMx:ISaleOrderMx[]
}

export class SaleOrderCreateDto implements ISaleOrderCreateSheetDto{

    //单据id
    saleOrderId: number;
    //单据编号
    saleOrderCode: string;
    //单据状态
    saleOrderState: number;
    //订货日期
    @IsDateString()
    orderDate: Date;
    //出货日期
    @IsDateStringOrNull()
    deliveryDate: Date | null;
    //客户id
    @IsInt()
    @NotEquals(0)
    clientid: number;
    //仓库id
    @IsInt()
    warehouseid: number;
    //结算方式
    @IsString()
    moneytype: string;
    //相关号码
    @IsString()
    relatednumber: string;
    //地址
    @IsString()
    address: string;
    //联系人
    @IsString()
    contact: string;
    //订金
    @IsNumber()
    deposit: number;
    //打印次数
    printCount: number;

    //终止审核
    stopReview: number;
    stopName: string;
    stopDate: Date | null;
    //手动完成审核
    manualFinishReview: number;
    manualFinishName: string;
    manualFinishDate: Date | null;
    //加急审核
    urgentReview: number;
    urgentName: string;
    urgentDate: Date | null;
    //销售审核
    level1Review: number;
    level1Name: string;
    level1Date: Date | null;
    //财务审核
    level2Review: number;
    level2Name: string;
    level2Date: Date | null;
    //删除标记
    del_uuid: number;
    deleter: string;
    deletedAt: Date | null;

    creater:string;
    createdAt:Date | null

    updater:string
    updatedAt:Date | null

    @IsString()
    remark1: string;
    @IsString()
    remark2: string;
    @IsString()
    remark3: string;
    @IsString()
    remark4: string;
    @IsString()
    remark5: string;

    @IsArray()
    saleOrderMx: ISaleOrderMx[];
    @IsString()
    salesman: string;
}