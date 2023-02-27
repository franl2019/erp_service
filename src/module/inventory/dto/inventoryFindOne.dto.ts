import {IsInt, IsString} from "class-validator";
import {IOutboundMx} from "../../outboundMx/outboundMx";
import {IInboundMx} from "../../inboundMx/inboundMx";

export class InventoryFindOneDto {
    @IsString()
    spec_d: string;

    @IsString()
    materials_d: string;

    @IsString()
    remark: string;

    @IsString()
    remarkmx: string;

    @IsInt()
    productid: number;

    @IsInt()
    clientid: number;

    @IsInt()
    warehouseid: number;

    @IsString()
    batchNo: string;

    public useOutboundMxFindInventory(outboundMx: IOutboundMx){
        this.spec_d = outboundMx.spec_d;
        this.materials_d = outboundMx.materials_d;
        this.remark = outboundMx.remark;
        this.remarkmx = outboundMx.remarkmx;
        this.productid = outboundMx.productid
        this.clientid = outboundMx.clientid;
        this.warehouseid = outboundMx.warehouseid;
        this.batchNo = outboundMx.batchNo;
        return this
    }

    public useInboundMxFindInventory(inboundMx:IInboundMx){
        this.productid = inboundMx.productid;
        this.spec_d = inboundMx.spec_d;
        this.materials_d = inboundMx.materials_d;
        this.remark = inboundMx.remark;
        this.remarkmx = inboundMx.remarkmx;
        this.clientid = inboundMx.clientid;
        this.warehouseid = 0;
        this.batchNo = "";
        return this
    }
}